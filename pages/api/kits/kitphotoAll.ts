import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/db';
import PhotovoltaicKit from '@/models/PhotovoltaicKit';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      // Connect to MongoDB
      await connectDB();

      // Fetch all kits from the database
      const kits = await PhotovoltaicKit.find({});

      // Return the kits as a JSON response
      res.status(200).json({ success: true, data: kits });
    } catch (error) {
      console.error('Error fetching kits:', error);
      res.status(500).json({ success: false, error: 'Erreur lors de la récupération des kits' });
    }
  } else {
    res.status(405).json({ success: false, error: 'Méthode non autorisée' });
  }
}