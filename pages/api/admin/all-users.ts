// pages/api/all-users.ts
import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/db';
import UserModel from '@/models/user';

const handler = async (_req: NextApiRequest, res: NextApiResponse) => {
  await connectDB();

  if (_req.method === 'GET') {
    try {
      // Fetch all users from the database
      const allUsers = await UserModel.find();

      // Return all users
      res.status(200).json({ users: allUsers });
    } catch (error) {
      console.error('Erreur lors de la récupération de tous les utilisateurs :', error.message);
      res.status(500).json({ error: 'Erreur interne du serveur.' });
    }
  } else {
    res.status(405).json({ error: 'Méthode non autorisée.' });
  }
};

export default handler;
