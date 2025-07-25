import { NextApiRequest, NextApiResponse } from "next";
import connectDB from "@/lib/db";
import fs from "fs";
import path from "path";
import multer from "multer";
import InterventionModel, { InterventionDocument } from "@/models/intervention";

// Extend the NextApiRequest type to include the files property
interface CustomNextApiRequest extends NextApiRequest {
  files?: Express.Multer.File[];
}

// Configure multer for parsing form data
const upload = multer({
  // No limits, allowing any file size
});

async function handler(req: CustomNextApiRequest, res: NextApiResponse) {
  // Connect to MongoDB using the db.ts file
  await connectDB();

  if (req.method === "POST") {
    try {
      // Parse form data using multer
      upload.any()(req, res, async (err: any) => {
        if (err) {
          console.error("Error parsing form data:", err);
          if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({ error: "File size exceeds the limit of 20 MB" });
          }
          return res.status(500).json({ error: "Internal server error" });
        }

        const picture2FileNames: string[] = [];
        const DocumentfacturePierceFournisseurFileNames: string[] = [];
        const DocumentFacturePieceClientEconegoceFileNames: string[] = [];

        // Handle each file separately
        if (req.files && req.files.length > 0) {
          req.files.forEach((file) => {
            const fileName = `${req.body.creator}_${req.body.pieceCreatedID}_${file.originalname}`;
            const filePath = path.join(process.cwd(), "/uploadsss", fileName);
            fs.writeFileSync(filePath, file.buffer);
            if (file.fieldname === "picture2") {
              picture2FileNames.push(fileName);
            } else if (file.fieldname === "DocumentfacturePierceFournisseur") {
              DocumentfacturePierceFournisseurFileNames.push(fileName);
            } else if (file.fieldname === "DocumentFacturePieceClientEconegoce") {
              DocumentFacturePieceClientEconegoceFileNames.push(fileName);
            }
          });
        }

        console.log("req.body", req.body)

        // Create new piece document
        const newPiece: InterventionDocument = new InterventionModel({
          created_at: req.body.created_at,
          dateDeLaDemande: req.body.dateDeLaDemande,  
          creator: req.body.creator,   
          societe: req.body.societe,     
          client: req.body.client,     
          marque: req.body.marque,
          serieNumber: req.body.serieNumber,
          nDeTicket: req.body.nDeTicket,
          devisEconegoce: req.body.devisEconegoce,
          devisFournisseur: req.body.devisFournisseur,  
          dateDinterventionPrevut: req.body.dateDinterventionPrevut,
          dateDuRapport: req.body.dateDuRapport,
          factureFournisseur: req.body.factureFournisseur,
          bonDeCommandeEconegoce: req.body.bonDeCommandeEconegoce,
          factureEconegoce: req.body.factureEconegoce,
          observation: req.body.observation,

        });

        // Save the piece to the database
        await newPiece.save();
        console.log("newPiece", newPiece)
        res.status(201).json({ success: "Piece created successfully" });
      });
    } catch (error) {
      console.error("Error creating piece:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else if (req.method === "PUT") {
    console.log("entered")
    try {
      // Parse form data using multer
      upload.any()(req, res, async (err: any) => {
        if (err) {
          console.error("Error parsing form data:", err);
          if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({ error: "File size exceeds the limit of 20 MB" });
          }
          return res.status(500).json({ error: "Internal server error" });
        }

        const picture2FileNames: string[] = [];
        const DocumentfacturePierceFournisseurFileNames: string[] = [];
        const DocumentFacturePieceClientEconegoceFileNames: string[] = [];

        // Handle each file separately
        if (req.files && req.files.length > 0) {
          req.files.forEach((file) => {
            const fileName = `${req.body.creator}_${req.body.pieceCreatedID}_${file.originalname}`;
            const filePath = path.join(process.cwd(), "/uploadsss", fileName);
            fs.writeFileSync(filePath, file.buffer);
            if (file.fieldname === "picture2") {
              picture2FileNames.push(fileName);
            } else if (file.fieldname === "DocumentfacturePierceFournisseur") {
              DocumentfacturePierceFournisseurFileNames.push(fileName);
            } else if (file.fieldname === "DocumentFacturePieceClientEconegoce") {
              DocumentFacturePieceClientEconegoceFileNames.push(fileName);
            }
          });
        }

        console.log("update request body", req.body);
        // Update the existing piece document
        const updatedIntervention = await InterventionModel.findByIdAndUpdate(req.body._id, {
          created_at: req.body.created_at,
          dateDeLaDemande: req.body.dateDeLaDemande,   
          creator: req.body.creator,  
          societe: req.body.societe,     
          client: req.body.client,     
          marque: req.body.marque,
          serieNumber: req.body.serieNumber,
          nDeTicket: req.body.nDeTicket,
          devisEconegoce: req.body.devisEconegoce,
          devisFournisseur: req.body.devisFournisseur,  
          dateDinterventionPrevut: req.body.dateDinterventionPrevut,
          dateDuRapport: req.body.dateDuRapport,
          factureFournisseur: req.body.factureFournisseur,
          bonDeCommandeEconegoce: req.body.bonDeCommande,
          factureEconegoce: req.body.factureEconegoce,
          observation: req.body.observation,
        }, { new: true });


        console.log("updatedIntervention", updatedIntervention)

        if (!updatedIntervention) {
          return res.status(404).json({ error: "Piece not found" });
        }

        res.status(200).json({ success: "Intervention updated successfully", intervention: updatedIntervention });
      });
    } catch (error) {
      console.error("Error updating piece:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    // Response for other than POST or PUT method
    res.status(405).json({ error: "Method Not Allowed" });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
