import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '../../../lib/db';
import UserModel from '../../../models/user';
import { compare } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Load environment variables from .env
dotenv.config();

async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Connect to MongoDB using the db.ts file
    await connectDB();

    if (req.method === 'POST') {
        // Extract data from the request body
        const { email, password } = req.body;

        // Validate
        if (!email || !email.includes('@') || !password) {
            res.status(422).json({ error: 'Invalid data. Veuillez fournir une adresse e-mail et un mot de passe valides.' });
            return;
        }

        try {
            // Check if the user exists
            const users = await UserModel.find({ email });

            if (users.length === 0) {
                res.status(404).json({ error: 'Utilisateur non trouvé.' });
                return;
            }

            const existingUser = users[0];

            // Compare the provided password with the hashed password in the database
            const passwordMatch = await compare(password, existingUser.password);
            if (!passwordMatch) {
                res.status(401).json({ error: 'Mot de passe incorrect.' });
                return;
            }

            // If there are multiple users with the same email, show an intermediate page
            if (users.length > 1) {
                res.status(200).json({ message: 'Multiple accounts found. Please choose your company.', users });
                return;
            }



            // Generate a token using the secret key from .env
            const token = jwt.sign(
                { userId: existingUser._id, email: existingUser.email, role: existingUser.role }, 
                process.env.SECRET_KEY as string,
                { expiresIn: '1h' }
            );

            // Send the token and user information in the response
            res.status(200).json({ success: 'Connexion réussie.', user: existingUser, token });
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error('Erreur lors de la connexion : ', error.message);
                // Send an error response
                res.status(500).json({ error: 'Erreur interne du serveur.' });
            } else {
                console.error('Erreur inattendue lors de la connexion :', error);
                res.status(500).json({ error: 'Erreur interne du serveur.' });
            }
        }
    } else {
        // Response for other than POST method
        res.status(500).json({ error: 'Route invalide.' });
    }
}

export default handler;
