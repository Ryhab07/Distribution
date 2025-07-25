import { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import fs from 'fs/promises';
import path from 'path';
import xlsx from 'xlsx';
import connectDB from '../../../lib/db';
import SavMachineModel, { SavMachineDocument } from '@/models/machine';

// Disable body parsing to handle file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

// Extend NextApiRequest to include the 'file' property from multer
interface CustomNextApiRequest extends NextApiRequest {
  file: Express.Multer.File; // Adjust type if needed
}

// Multer configuration for file upload
const upload = multer({
  storage: multer.diskStorage({
    destination: path.join(process.cwd(), '/uploads'),
    filename: (req, file, cb) => {
      cb(null, file.originalname); // Use the original filename
    },
  }),
});

// Function to convert Excel serial date to a JavaScript Date object
const convertExcelDateToJSDate = (excelDate: number): Date | null => {
  if (typeof excelDate !== 'number' || isNaN(excelDate)) {
    console.error('Invalid Excel date:', excelDate);
    return null;
  }

  const date = new Date((excelDate - 25569) * 86400 * 1000);
  if (isNaN(date.getTime())) {
    console.error('Converted to invalid date:', excelDate, date);
    return null;
  }
  return date;
};

// Function to handle file upload and data processing
async function handleFileUpload(req: CustomNextApiRequest, res: NextApiResponse) {
  const filePath = req.file.path; // Path to uploaded file
  console.log('File path:', filePath);

  try {
    const buffer = await fs.readFile(filePath);
    const workbook = xlsx.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);

    console.log('Data from file:', data);

    if (data.length === 0) {
      console.error('No data found in the file');
      res.status(400).json({ error: 'No data found in the file' });
      return;
    }

    const savToInsert: SavMachineDocument[] = [];

    // Function to parse and convert numbers correctly
    const parseNumber = (value: any): number | null => {
      if (typeof value === 'string') {
        // Handle locales using comma as decimal separator
        const normalizedValue = value.replace(',', '.');
        const numberValue = parseFloat(normalizedValue);
        return isNaN(numberValue) ? null : numberValue;
      }
      if (typeof value === 'number') {
        return value;
      }
      console.error('Invalid number value:', value);
      return null;
    };

    const parseDate = (value: any): Date | null => {
      if (typeof value === 'number') {
        return convertExcelDateToJSDate(value);
      }
      if (typeof value === 'string' && !isNaN(Date.parse(value))) {
        return new Date(value);
      }
      console.error('Invalid date value:', value);
      return null;
    };

    for (const row of data) {
      const createdAt = parseDate(row['DATE DEMANDE']);
      const dateRetourDepot = parseDate(row['DATE RETOUR DEPOT']);
      const dateDemandeAvoirFournisseur = parseDate(row['DATE DEMANDE AVOIR FOURNISSEUR']);
      const dateReceptionAvoirFournisseur = parseDate(row['DATE RECEPTION AVOIR FOURNISSEUR']);
      const dateAvoirInstallateur = parseDate(row['DATE AVOIR INSTALLATEUR']);
      const dateRetourFournisseur = parseDate(row['DATE RETOUR FOURNISSEUR']);

      if (!createdAt) {
        console.error('Skipping row due to invalid created_at date:', row);
        continue;
      }

      const formattedCreatedAt = createdAt.toISOString().replace('Z', '+00:00');

      const sav: SavMachineDocument = {
        created_at: formattedCreatedAt,
        installateur: row['INSTALLATEUR'] || '',
        client: row['CLIENT'] || '',
        causeSAV: row['CAUSE SAV'] || '',
        marque: row['MARQUE'] || '',
        articleNumber: row['N° ARTICLE'] || '',
        modele: row['MODELE'] || '',
        categorieArticle: row['CATEGORIE ARTICLE'] || '',
        serieNumber: row['N° SERIE'] || '',
        quantite: parseNumber(row['QUANTITE']) || 0,
        blNumber: row['N° BL'] || '',
        accord: row['ACCORD'] || '',
        dateRetourDepot: dateRetourDepot || null,
        dateDemandeAvoirFournisseur: dateDemandeAvoirFournisseur || null,
        dateReceptionAvoirFournisseur: dateReceptionAvoirFournisseur || null,
        statutFournisseur: row['STATUT FOURNISSEUR'] || '',
        avoirFournisseurNumber: row['N° AVOIR FOURNISSEUR'] || '',
        dateAvoirInstallateur: dateAvoirInstallateur || null,
        avoirInstallateurNumber: row['N° AVOIR INSTALLATEUR'] || '',
        nouveauBlNumber: row['NOUVEAU N° BL'] || '',
        dateRetourFournisseur: dateRetourFournisseur || null,
        prixVente: parseNumber(row['prix']) || 0,
        numeroBlOuFacture: row['N° BL'] || '',
      };

      savToInsert.push(sav);
    }

    console.log('Sav data to be inserted:', savToInsert);

    // Insert data into MongoDB
    const insertedSAVs = await SavMachineModel.insertMany(savToInsert);

    res.status(201).json({ success: 'SAV data imported successfully', savs: insertedSAVs });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error importing SAV data:', error.message);
      res.status(500).json({ error: 'Internal server error.' });
    } else {
      console.error('Unexpected error importing SAV data:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  }
}

// Main handler function
async function handler(req: CustomNextApiRequest, res: NextApiResponse) {
  try {
    await connectDB(); // Connect to MongoDB

    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // Use multer middleware to handle file upload
    upload.single('file')(req, res, (err) => {
      if (err) {
        return res.status(500).json({ error: 'Error uploading file' });
      }

      // After file upload, handle the file and process data
      handleFileUpload(req, res);
    });
  } catch (error) {
    console.error('Error connecting to database:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
}

export default handler;
