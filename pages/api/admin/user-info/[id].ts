import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/db';
import UserModel from '@/models/user';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await connectDB();

  const { query: { id } } = req;

  if (req.method === 'GET') {
    try {
      // Validate the ID parameter
      if (!id || typeof id !== 'string') {
        res.status(400).json({ error: 'Paramètre d\'ID invalide.' });
        return;
      }

      // Find the user by ID in the database
      const user = await UserModel.findById(id);

      // Check if the user was found
      if (!user) {
        res.status(404).json({ error: 'Utilisateur non trouvé.' });
        return;
      }

      // Return user information
      res.status(200).json({ user });
    } catch (error) {
      console.error('Erreur lors de la récupération des informations de l\'utilisateur par ID :', error.message);
      res.status(500).json({ error: 'Erreur interne du serveur.' });
    }
  } else {
    res.status(405).json({ error: 'Méthode non autorisée.' });
  }
};

export default handler;
