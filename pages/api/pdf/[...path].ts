import { NextApiRequest, NextApiResponse } from 'next';
import { join } from 'path';
import { createReadStream } from 'fs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { path } = req.query;

    if (!path || typeof path !== 'string') {
      res.status(400).json({ error: 'Invalid path parameter' });
      return;
    }

    const [directory, filename] = path.split('/');
    const filePath = join(process.cwd(), 'pdfs', directory, filename);
    
    // Log the file path for debugging
    console.log('File path:', filePath);

    try {
      const stream = createReadStream(filePath);
      stream.on('open', () => {
        res.setHeader('Content-Type', 'application/pdf');
        stream.pipe(res);
      });
      stream.on('error', () => {
        res.status(404).json({ error: 'File not found' });
      });
    } catch (error) {
      console.error('Error serving PDF file:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
