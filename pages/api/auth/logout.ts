import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/db';
import jwt from 'jsonwebtoken';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Connect to MongoDB using the db.ts file
  await connectDB();

  if (req.method === 'POST') {
    try {
      // Expire the JWT token by setting the expiration time to a past date
      const expiredToken = jwt.sign({}, process.env.SECRET_KEY as string, { expiresIn: 0 });

      // Send a success response with instructions for the client
      res.setHeader('Clear-Session-Storage', 'true');
      res.setHeader('Set-Cookie', `token=${expiredToken}; HttpOnly; Max-Age=0; Path=/`);

      res.status(200).json({ message: 'Nettoyage côté serveur réussi.' });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Erreur lors du nettoyage côté serveur :', error.message);
        res.status(500).json({ message: 'Erreur interne du serveur pendant le nettoyage.' });
      } else {
        console.error('Erreur inattendue lors du nettoyage côté serveur :', error);
        res.status(500).json({ message: 'Erreur interne du serveur pendant le nettoyage.' });
      }
    }
  } else {
    // Response for other than POST method
    res.status(500).json({ message: 'Route invalide.' });
  }
}

export default handler;
