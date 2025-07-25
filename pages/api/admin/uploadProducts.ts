import { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import fs from 'fs/promises';
import path from 'path';
import connectDB from '../../../lib/db';
import ProductModel, { ProductDocument } from '../../../models/product';
import xlsx from 'xlsx';

export const config = {
    api: {
        bodyParser: false,
    },
};

// Define the expected structure of each row in the Excel sheet
interface ProductRow {
    name: string;
    stock_reel?: number;
    stock?: number;
    cost?: number;
    use?: string;
    image?: string;
    ref: string;
    cat?: string;
    oldname?: string;
    status?: string;
}

// Multer configuration for handling document uploads
const upload = multer({
    storage: multer.diskStorage({
        destination: path.join(process.cwd(), '/uploads'),
        filename: (req, file, cb) => {
            cb(null, file.originalname);
        },
    }),
});

// Function to handle document upload and product creation
async function handleDocumentUpload(req: NextApiRequest, res: NextApiResponse) {
    const filePath = req.file.path;

    try {
        const buffer = await fs.readFile(filePath);
        const workbook = xlsx.read(buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Specify the expected row type for the parsed data
        const data: ProductRow[] = xlsx.utils.sheet_to_json<ProductRow>(worksheet);

        // Explicitly type results array as an array of ProductDocument
        const results: ProductDocument[] = [];
        
        for (const row of data) {
            const {
                name,
                stock_reel = 0,  // default to 0 if not present
                stock,
                cost,
                use,
                image = 'sans-photo.png',
                ref,
                cat,
                oldname,
                status,
            } = row;

            if (!name || !ref) continue; // Skip if required fields are missing

            const newProduct = await ProductModel.create({
                name,
                stock_reel,
                stock,
                cost,
                use,
                image,
                ref,
                cat,
                oldname,
                status
            });

            results.push(newProduct); 
            console.log('New product added:', newProduct);
        }

        res.status(201).json({ success: 'Documents added.', products: results });
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error adding document:", error.message);
            res.status(500).json({ error: `Internal server error. ${error.message}` });
        } else {
            console.error('Unexpected error adding document:', error);
            res.status(500).json({ error: 'Internal server error.' });
        }
    }
}

// Main handler function
async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        await connectDB();

        if (req.method !== 'POST') {
            return res.status(405).json({ error: 'Method not allowed' });
        }

        upload.single('file')(req, res, (err) => {
            if (err) {
                return res.status(500).json({ error: `File upload error , ${err} ` });
            }

            handleDocumentUpload(req, res);
        });
    } catch (error) {
        console.error('Database connection error:', error);
        res.status(500).json({ error: `Internal server error. ${error.message}` });
    }
}

export default handler;
