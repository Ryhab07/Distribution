import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '../../../lib/db';
import UserModel from '../../../models/user';
import bcrypt from 'bcryptjs'; // Import bcryptjs to hash the password

async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Connect to MongoDB using the db.ts file
    await connectDB();

    if (req.method === 'PATCH') { // Change method to PATCH for updating
        // Extract data from the request body
        const { id, name, lastname, email, sales375, sales500, address, phone, phoneSecondaire, email2, password, entreprise, adresse, role } = req.body; 
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

            // Update the user's information
            if (name !== undefined) existingUser.name = name;
            if (lastname !== undefined) existingUser.lastname = lastname;
            if (email !== undefined) existingUser.email = email;
            if (email2 !== undefined) existingUser.email2 = email2;
            if (sales375 !== undefined) existingUser.sales375 = sales375 / 100;
            if (sales500 !== undefined) existingUser.sales500 = sales500 / 100;
            if (address !== undefined) existingUser.address = address;
            if (phone !== undefined) existingUser.phone = phone;
            if (phoneSecondaire !== undefined) existingUser.phoneSecondaire = phoneSecondaire;
            if (password !== undefined) {
                // Hash the password if it's provided
                const hashedPassword = await bcrypt.hash(password, 10); // Hash with salt rounds
                existingUser.password = hashedPassword;
            }
            if (entreprise !== undefined) existingUser.entreprise = entreprise;
            if (adresse !== undefined) existingUser.adresse = adresse;         
            if (role !== undefined) existingUser.role = role;                  

            // Save the updated user
            await existingUser.save();

            // Send a success response
            res.status(200).json({ success: 'Informations de l\'utilisateur mises à jour.', user: existingUser });
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error("Erreur lors de la mise à jour des informations de l'utilisateur :", error.message);
                // Send an error response
                res.status(500).json({ error: 'Erreur interne du serveur.' });
            } else {
                console.error('Erreur inattendue lors de la mise à jour des informations de l\'utilisateur :', error);
                res.status(500).json({ error: 'Erreur interne du serveur.' });
            }
        }
    } else {
        // Response for other than PATCH method
        res.status(500).json({ error: 'Route invalide.' });
    }
}

export default handler;
