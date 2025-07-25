import { NextApiRequest, NextApiResponse } from "next";
import connectDB from "@/lib/db";
import UserModel from "@/models/user";
import { TokenExpiredError } from "jsonwebtoken";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Connect to MongoDB using the db.ts file
  await connectDB();

  if (req.method === "PUT") {
    // Change to PUT for the update operation
    try {
      // Extract data from the request body
      const { userId, email, name, lastname, entreprise, phone, role, adresse } = req.body;

      // Validate user ID
      if (!userId) {
        res.status(422).json({
          error: "L'identifiant de l'utilisateur est nécessaire pour mettre à jour l'utilisateur.",
        });
        return;
      }

      // Validate and decode the token
      const token = req.headers.authorization?.replace("Bearer ", "");
      console.log("token", token);

      if (!token) {
        res.status(401).json({ error: "Jeton d'autorisation manquant." });
        return;
      }

      try {

        // Find the user by ID
        const userToUpdate = await UserModel.findById(userId);

        // Check if the user exists
        if (!userToUpdate) {
          res.status(404).json({ error: "Utilisateur non trouvé." });
          return;
        }

        // Update user fields if provided
        if (email) userToUpdate.email = email;
        if (name) userToUpdate.name = name;
        if (lastname) userToUpdate.lastname = lastname;
        if (entreprise) userToUpdate.entreprise = entreprise;
        if (phone) userToUpdate.phone = phone;
        if (role) userToUpdate.role = role;
        if (adresse) userToUpdate.adresse = adresse;

        // Save the updated user
        await userToUpdate.save();

        // Send a success response
        res.status(200).json({
          success: "Informations utilisateur mises à jour.",
          user: userToUpdate,
        });
      } catch (error) {
        if (error instanceof TokenExpiredError) {
          res.status(401).json({ error: "Token has expired." });
        } else {
          res.status(401).json({ error: "Invalid token." });
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Erreur lors de la mise à jour de l'utilisateur :", error.message);
        res.status(500).json({ error: "Erreur interne du serveur" });
      } else {
        console.error("Erreur lors de la mise à jour de l'utilisateur :", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
      }
    }
  } else {
    // Response for other than PUT method
    res.status(500).json({ error: "Route invalide." });
  }
}

export default handler;
