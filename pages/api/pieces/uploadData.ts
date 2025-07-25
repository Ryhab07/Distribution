import { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import fs from 'fs/promises'; // Import fs module for file operations
import path from 'path';
import xlsx from 'xlsx';
import connectDB from '../../../lib/db';
import PieceModel, { PieceDocument } from '../../../models/piece';

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

  try {
    const buffer = await fs.readFile(filePath);
    const workbook = xlsx.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);

    console.log('data', data);

    const piecesToInsert: PieceDocument[] = [];

    for (const row of data) {
      // Parse each date column properly
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
      const dateCommande = parseDate(row['DATE DE LA COMMANDE']);
      const dateLivraisonPrevue = parseDate(row['DATE DE LIVRAISON PREVUE']);
      const dateReceptionDepot = parseDate(row['DATE DE RECEPTION DEPOT']);
      const dateExpedition = parseDate(row['DATE EXPEDITION ou ENLEVEMENT']);
      const dateReceptionPieceDef = parseDate(row['DATE RECEPTION PIECE DEFECTUEUSE']);
      const dateExpeditionPieceDef = parseDate(row['DATE EXPEDITION DE LA PIECE DEFECTUEUSE']);
      const dateReglement = parseDate(row['DATE DU REGLEMENT']);

      if (!createdAt) {
        console.error('Skipping row due to invalid created_at date:', row);
        continue;
      }

      const piece: PieceDocument = {
        created_at: createdAt,
        societe: row['SOCIETE'],
        client: row['CLIENT'],
        marque: row['MARQUE'],
        serieNumber: row['NUMERO DE SERIE'],
        numeroCommande: row['NUMERO DE COMMANDE'],
        articleName: row['NOM DE LA PIECE'],
        reference: row['REFERENCE'],
        stockDispoTremblay: row['STOCK DISPO TREMBLAY'],
        dateCommande: dateCommande,
        lieuDuReception: row['LIEU DE RECEPTION'],
        dateLivraisonPrevue: dateLivraisonPrevue,
        personneQuiPasseCommande: row['PERSONNE QUI PASSE COMMANDE'],
        dateReceptionDepot: dateReceptionDepot,
        dateExpedition: dateExpedition,
        dateReceptionPieceDef: dateReceptionPieceDef,
        dateExpeditionPieceDef: dateExpeditionPieceDef,
        numeroDevisEconegoce: row['NUMERO DU DEVIS ECONEGOCE'],
        dateReglement: dateReglement,
        facturePieceFournisseur: row['FACTURE PIECE FOURNISSEUR'],
        avoirPieceFournisseur: row['AVOIR PIECE FOURNISSEUR'],
        facturePieceClientEconegoce: row['FACTURE PIECE CLIENT ECONEGOCE'],
        reponseExpertise: row['REPONSE D EXPERTISE'],
        avoirPieceClientEconegoce: row['AVOIR PIECE CLIENT ECONEGOCE'],
        dossierCloture: row['DOSSIER CLOTURE'],
        observation: row['OBSERVATION'],
        facturePierceFournisseur: [],
        numeroBlOuFacture: '',
        Prix: 0,
        $assertPopulated: '',
      };

      piecesToInsert.push(piece);
    }

    // Insert data into MongoDB using Mongoose or other ORM
    const insertedPieces = await PieceModel.insertMany(piecesToInsert);

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
