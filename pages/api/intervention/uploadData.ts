import { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import fs from 'fs/promises';
import path from 'path';
import xlsx from 'xlsx';
import connectDB from '../../../lib/db';
import InterventionModel, { InterventionDocument } from '@/models/intervention';

// Disable body parsing to handle file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

// Extend NextApiRequest to include the 'file' property from multer
interface CustomNextApiRequest extends NextApiRequest {
  file: Express.Multer.File;
}

// Multer configuration for file upload
const upload = multer({
  storage: multer.diskStorage({
    destination: path.join(process.cwd(), '/uploads'),
    filename: (req, file, cb) => {
      cb(null, file.originalname);
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

// Function to format a date to the desired string format
const formatToCustomString = (date: Date | null): string | null => {
  return date ? date.toString() : null;
};

// Function to format a date to ISO string with timezone
const formatToISOString = (date: Date): string => {
  return date.toISOString();
};

// Function to handle file upload and data processing
async function handleFileUpload(req: CustomNextApiRequest, res: NextApiResponse) {
  const filePath = req.file.path;

  try {
    const buffer = await fs.readFile(filePath);
    const workbook = xlsx.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);

    console.log('data', data);

    const piecesToInsert: InterventionDocument[] = [];

    for (const row of data) {
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

      const createdAt = parseDate(row['DATE DE LA DEMANDE']);
      const dateDeLaDemande = parseDate(row['dateDeLaDemande']);
      const dateDinterventionPrevut = parseDate(row['DATE DE L INTERVENTION PREVUE']);
      const dateDuRapport = parseDate(row['DATE DU RAPPORT']);

      if (!createdAt) {
        console.error('Skipping row due to invalid created_at date:', row);
        continue;
      }

      const piece: InterventionDocument = {
        created_at: new Date(formatToISOString(createdAt)),
        dateDeLaDemande: formatToCustomString(dateDeLaDemande),
        societe: row['SOCIETE'],
        client: row['CLIENT'],
        marque: row['MARQUE'],
        serieNumber: row['NUMERO DE SERIE'],
        nDeTicket: row['N° DE TICKET'],
        devisEconegoce: row['N° DEVIS ECONEGOCE'],
        devisFournisseur: row['N°DEVIS FOURNISSEUR'],
        dateDinterventionPrevut: formatToCustomString(dateDinterventionPrevut),
        dateDuRapport: formatToCustomString(dateDuRapport),
        facturePieceClientEconegoce: row['FACTURE  FOURNISSEUR'],
        bonDeCommandeEconegoce: row['BON DE COMMANDE ECONEGOCE'],
        factureEconegoce: row['FACTURE ECONEGOCE'],
        observation: row['OBSERVATION'],
        $assertPopulated: '',
      };

      piecesToInsert.push(piece);
    }

    const insertedPieces = await InterventionModel.insertMany(piecesToInsert);

    res.status(201).json({ success: 'Pieces imported successfully', pieces: insertedPieces });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error importing pieces:', error.message);
      res.status(500).json({ error: 'Internal server error.' });
    } else {
      console.error('Unexpected error importing pieces:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  }
}

// Main handler function
async function handler(req: CustomNextApiRequest, res: NextApiResponse) {
  try {
    await connectDB();

    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }

    upload.single('file')(req, res, (err) => {
      if (err) {
        return res.status(500).json({ error: 'Error uploading file' });
      }

      handleFileUpload(req, res);
    });
  } catch (error) {
    console.error('Error connecting to database:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
}

export default handler;
