import { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import fs from 'fs/promises'; // Import fs module for file operations
import path from 'path';
import connectDB from '../../../lib/db';
import UserModel from '../../../models/user';
import { hash } from 'bcryptjs';
import xlsx from 'xlsx';

export const config = {
    api: {
        bodyParser: false,
    },
};

// Multer configuration
const upload = multer({
    storage: multer.diskStorage({
        destination: path.join(process.cwd(), '/uploads'),
        filename: (req, file, cb) => {
            cb(null, file.originalname); // Use the original filename
        },
    }),
});

// Function to handle file upload and user creation
async function handleFileUpload(req: NextApiRequest, res: NextApiResponse) {
    const filePath = req.file.path; // Path to uploaded file

    try {
        const buffer = await fs.readFile(filePath);
        const workbook = xlsx.read(buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(worksheet);

        console.log("data", data);

        const creatorId = req.body.creatorId as string;

        const results = [];
        for (const row of data) {
            const {
                email: initialEmail,
                email2,
                entreprise,
                contact: initialContact,
                phone,
                mobile,
                adresse,
                sales375,
                sales500
            } = row;

            console.log("row", row);

            let email = initialEmail;
            let contact = initialContact;

            // If email is empty, generate a default email
            if (!email) {
                if (entreprise) {
                    email = `contact@${entreprise.toLowerCase().replace(/\s+/g, '')}.fr`;
                } else {
                    continue; // Skip if both email and entreprise are empty
                }
            }

            // If contact is empty, assign an empty string
            if (!contact) {
                contact = "";
            }

            // Validate email format
            if (!email.includes('@')) {
                continue; // Skip invalid entries
            }

            const userCount = await UserModel.countDocuments({ email });

            if (userCount >= 5) {
                console.log("userCount", userCount);
                continue; // Skip if more than 5 accounts with the same email
            }

            const newUser = await UserModel.create({
                email,
                email2,
                name: contact,
                lastname: "",
                entreprise,
                phone,
                phoneSecondaire: mobile,
                adresse,
                password: await hash('defaultpassword', 12), // Use a default password or generate one
                role: 'user',
                sales375,
                sales500,
                creator: creatorId,
                emailCount: userCount + 1,
            });

            results.push(newUser);
            console.log('New user created:', newUser); // Log newly created user
        }

        res.status(201).json({ success: 'Utilisateurs créés.', users: results });
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Erreur lors de la création de l'utilisateur :", error.message);
            res.status(500).json({ error: 'Erreur interne du serveur.' });
        } else {
            console.error('Unexpected error creating user:', error);
            res.status(500).json({ error: 'Erreur interne du serveur.' });
        }
    }
}

// Main handler function
async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        await connectDB(); // Connect to MongoDB

        if (req.method !== 'POST') {
            return res.status(405).json({ error: 'Méthode non autorisée' });
        }

        // Use multer middleware to handle file upload
        upload.single('file')(req, res, (err) => {
            if (err) {
                return res.status(500).json({ error: 'Erreur lors de l\'upload du fichier' });
            }

            // After file upload, handle the file and process data
            handleFileUpload(req, res);
        });
    } catch (error) {
        console.error('Error connecting to database:', error);
        res.status(500).json({ error: 'Erreur interne du serveur.' });
    }
}

export default handler;
