import fs from 'fs';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { imageName } = req.query as { imageName: string };
  const filePath = path.join(process.cwd(), 'uploadsss', imageName);

  // Check if the file exists
  if (fs.existsSync(filePath)) {
    // Get the file extension
    const fileExtension = path.extname(imageName).toLowerCase();

    // Set the appropriate content type
    let contentType = '';
    if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(fileExtension)) {
      contentType = `image/${fileExtension === '.jpg' ? 'jpeg' : fileExtension.slice(1)}`;
    } else if (fileExtension === '.pdf') {
      contentType = 'application/pdf';
    } else {
      res.status(415).json({ error: 'Unsupported file type' }); // Return 415 for unsupported file types
      return;
    }

    // Serve the file
    const fileStream = fs.createReadStream(filePath);
    res.setHeader('Content-Type', contentType);
    fileStream.pipe(res);
  } else {
    // Return a 404 error if the file doesn't exist
    res.status(404).json({ error: 'File not found' });
  }
}
