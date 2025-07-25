import fs from "fs/promises";
import path from "path";
import { NextApiRequest, NextApiResponse } from "next";
import formidable, { File } from "formidable";

export const config = {
  api: {
    bodyParser: false, // Required for handling file uploads
  },
};

// Define the file structure
interface UploadedFile {
  originalName: string;
  savedName: string;
  path: string;
  type: string;
  size: number;
}

async function saveFiles(files: File[]): Promise<UploadedFile[]> {
  const uploadedFiles: UploadedFile[] = [];
  const uploadDir = path.join(process.cwd(), "uploadsss");

  // Ensure the directory exists
  await fs.mkdir(uploadDir, { recursive: true });

  for (const file of files) {
    const fileName = `${Date.now()}_${file.originalFilename}`;
    const filePath = path.join(uploadDir, fileName);

    try {
      await fs.copyFile(file.filepath, filePath);
      uploadedFiles.push({
        originalName: file.originalFilename || "unknown",
        savedName: fileName,
        path: `/uploadsss/${fileName}`,
        type: file.mimetype || "unknown",
        size: file.size,
      });
      console.log(`Saved file: ${filePath}`);
    } catch (err) {
      console.error(`Error saving file ${file.originalFilename}:`, err);
    }
  }

  return uploadedFiles;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const form = new formidable.IncomingForm({ multiples: true, keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: "File upload failed" });
    }

    const allFiles = Object.values(files).flat() as File[];
    const uploadedFiles = await saveFiles(allFiles);

    return res.status(200).json({
      message: "Files uploaded successfully",
      files: uploadedFiles,
    });
  });
}
