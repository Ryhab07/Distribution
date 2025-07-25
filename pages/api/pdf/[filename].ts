
import { join } from 'path';
import { createReadStream } from 'fs';

export default async function handler(req, res) {
  const { filename, directory } = req.query;

  // Check if filename and directory are provided
  if (!filename || typeof filename !== 'string' || !directory || typeof directory !== 'string') {
    res.status(400).json({ error: 'Invalid filename or directory parameter' });
    return;
  }

  const filePath = join(process.cwd(), "pdfs", directory, `${filename}.pdf`);
  console.log("filePath: ", filePath);

  // Create a read stream for the file
  const stream = createReadStream(filePath);

  // Attach event listeners to the stream
  stream.on('open', () => {
    res.setHeader('Content-Type', 'application/pdf');
    stream.pipe(res);
  });
  stream.on('error', () => {
    res.status(404).json({ error: 'File not found' });
  });
}
