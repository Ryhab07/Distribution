import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '../../../lib/db';
import UserModel from '../../../models/user';

async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Connect to MongoDB using the db.ts file
    await connectDB();

    if (req.method === 'PATCH') { // Change method to PATCH for updating
        // Extract data from the request body
        const { id, sales375, sales500 } = req.body; 
        // Validate
        if (!id) {
            res.status(422).json({ error: 'ID invalide.' });
            return;
        }

        try {
            // Find the user by ID
            const existingUser = await UserModel.findById(id);
            if (!existingUser) {
                res.status(404).json({ "error": "Utilisateur non trouvé." });
                return;
            }

            // Update the user's sales
            existingUser.sales375 = sales375;
            existingUser.sales500 = sales500;

            // Save the updated user
            await existingUser.save();

            // Send a success response
            res.status(200).json({ success: 'Ventes de l\'utilisateur mises à jour.', user: existingUser });
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error("Erreur lors de la mise à jour des ventes de l'utilisateur :", error.message);
                // Send an error response
                res.status(500).json({ error: 'Erreur interne du serveur.' });
            } else {
                console.error('Erreur inattendue lors de la mise à jour des ventes de l\'utilisateur :', error);
                res.status(500).json({ error: 'Erreur interne du serveur.' });
            }
        }
    } else {
        // Response for other than PATCH method
        res.status(500).json({ error: 'Route invalide.' });
    }
}

export default handler;
