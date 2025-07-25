import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '../../../lib/db';
import UserModel from '../../../models/user';
import { hash } from 'bcryptjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Connect to MongoDB using the db.ts file
    await connectDB();

    // Remove the unique index on the email field if it exists
    try {
        await UserModel.collection.dropIndex('email_1');
        console.log('Unique index on email field removed successfully');
    } catch (error) {
        if (error.code === 27) {
            console.log('Index not found, skipping removal');
        } else {
            console.error('Error removing unique index:', error);
        }
    }

    if (req.method === 'POST') {
        // Extract data from the request body
        const { email, email2,  password, name, lastname, entreprise, phone, phoneSecondaire, role, adresse, sales375, sales500 = 0, creatorId } = req.body; 
        
        // Validate
        if (!email || !email.includes('@') || !password ) {
            res.status(422).json({ error: 'Données invalides. Veuillez fournir une adresse e-mail, un mot de passe et un nom d\'entreprise valides.' });
            return;
        }

        try {
            // Check how many accounts already exist with the same email
            const userCount = await UserModel.countDocuments({ email });

            if (userCount >= 5) {
                res.status(422).json({ error: 'Vous ne pouvez pas créer plus de 5 comptes avec la même adresse e-mail.' });
                return;
            }

            // Create a new user using the UserModel
            const newUser = await UserModel.create({
                email,
                email2,
                name,
                lastname,
                entreprise,
                phone,
                phoneSecondaire,
                adresse,
                password: await hash(password, 12),
                role: role || 'user',
                sales375,
                sales500,
                creator: creatorId,
                emailCount: userCount + 1,
            });

            // Send a success response
            res.status(201).json({ success: 'Utilisateur créé.', user: newUser });
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error("Erreur lors de la création de l'utilisateur :", error.message);
                // Send an error response
                res.status(500).json({ error: 'Erreur interne du serveur.' });
            } else {
                console.error('Unexpected error creating user:', error);
                res.status(500).json({ error: 'Erreur interne du serveur.' });
            }
        }
    } else {
        // Response for other than POST method
        res.status(500).json({ error: 'Itinéraire invalide.' });
    }
}

export default handler;
