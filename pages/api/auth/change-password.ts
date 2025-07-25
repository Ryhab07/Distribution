import { NextApiRequest, NextApiResponse } from "next";
import connectDB from "../../../lib/db";
import UserModel from "../../../models/user";
import { compare, hash } from "bcryptjs";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  if (req.method === "POST") {
    const { userId, currentPassword, newPassword } = req.body;

    try {
      const user = await UserModel.findById(userId);

      if (!user) {
        res.status(404).json({ error: "Utilisateur non trouvé" });
        return;
      }

      const passwordMatch = await compare(currentPassword, user.password);

      if (!passwordMatch) {
        res.status(401).json({ error: "Mot de passe actuel incorrect" });
        return;
      }

      user.password = await hash(newPassword, 12);
      await user.save();

      res.status(200).json({ success: "Mot de passe changé avec succès" });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Erreur lors du changement de mot de passe :", error.message);
        res.status(500).json({ error: "Erreur interne du serveur" });
      } else {
        console.error("Erreur inattendue lors du changement de mot de passe :", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
      }
    }
  } else {
    res.status(500).json({ error: "Route non valide" });
  }
}

export default handler;
