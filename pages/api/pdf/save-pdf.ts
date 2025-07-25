//import logError from "@/utils/logger";
import { NextApiRequest, NextApiResponse } from "next";
import path from "path";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "200mb", 
    },
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const {
      pdfBase64_1,
      pdfBase64_2,
      directory1,
      directory2,
      refcommande,
    } = req.body;

    console.log("Received POST request with body:", req.body);

    try {
      // Convert the base64 strings to ArrayBuffers
      console.log("Converting base64 strings to ArrayBuffers...");
      const buffer1 = Buffer.from(pdfBase64_1, "base64").buffer;
      const buffer2 = Buffer.from(pdfBase64_2, "base64").buffer;

      // Save the ArrayBuffers as PDFs in the specified directories
      console.log("Importing file system module...");
      const fs = await import("fs/promises");

      const pdfPath1 = path.join(
        process.cwd(),
        "pdfs",
        directory1,
        `${refcommande}_BC.pdf`
      );
      const pdfPath2 = path.join(
        process.cwd(),
        "pdfs",
        directory2,
        `${refcommande}_BR.pdf`
      );

      console.log("Ensuring directories exist...");
      console.log("PDF Path 1:", pdfPath1);
      console.log("PDF Path 2:", pdfPath2);

      // Create directories and handle errors
      try {
        await fs.mkdir(path.dirname(pdfPath1), { recursive: true });
        //console.log("Directory created for:", pdfPath1);
      } catch (err) {
        //console.error("Error creating directory for PDF 1:", err);
      }

      try {
        await fs.mkdir(path.dirname(pdfPath2), { recursive: true });
        console.log("Directory created for:", pdfPath2);
      } catch (err) {
        //console.error("Error creating directory for PDF 2:", err);
      }

      console.log("Writing PDF files...");
      
      // Write PDF files and handle errors
      try {
        await fs.writeFile(pdfPath1, Buffer.from(buffer1));
        //console.log("PDF 1 written successfully to:", pdfPath1);
      } catch (err) {
        //console.error("Error writing PDF 1:", err);
      }

      try {
        await fs.writeFile(pdfPath2, Buffer.from(buffer2));
        //console.log("PDF 2 written successfully to:", pdfPath2);
      } catch (err) {
        //console.error("Error writing PDF 2:", err);
      }

      res.status(200).json({ message: "PDFs saved successfully" });
      console.log("Response sent: PDFs saved successfully");
    } catch (error) {
      //logError("Error saving the PDFs on the server", error);
      //console.error("Error saving the PDFs on the server:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    //console.warn("Received non-POST request. Method not allowed.");
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
