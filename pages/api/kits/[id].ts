import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/db';
import PhotovoltaicKit from '@/models/PhotovoltaicKit';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { id } = req.query;
      await connectDB();
      const kit = await PhotovoltaicKit.findById(id);

      if (!kit) {
        return res.status(404).json({ success: false, error: 'Kit non trouvé' });
      }

      res.status(200).json({ success: true, data: kit });
    } catch (error) {
      console.error('Error fetching kit by ID:', error);
      res.status(500).json({ success: false, error: 'Erreur lors de la récupération du kit' });
    }
  } else {
    res.status(405).json({ success: false, error: 'Méthode non autorisée' });
  }
}