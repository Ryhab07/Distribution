import { NextApiRequest, NextApiResponse } from "next";
import connectDB from "@/lib/db";
import PieceModel, { PieceDocument } from "@/models/piece";
import fs from "fs";
import path from "path";
import multer from "multer";

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
            return res
              .status(400)
              .json({ error: "File size exceeds the limit of 20 MB" });
          }
          return res.status(500).json({ error: "Internal server error" });
        }

        const picture2FileNames: string[] = [];
        const DocumentFacturePieceFournisseurFileNames: string[] = [];
        const DocumentFacturePieceClientEconegoceFileNames: string[] = [];

        // Handle each file separately
        if (req.files && req.files.length > 0) {
          req.files.forEach((file) => {
            const fileName = `${file.originalname}`;
            const filePath = path.join(process.cwd(), "/uploadsss", fileName);
            fs.writeFileSync(filePath, file.buffer);
            if (file.fieldname === "picture2") {
              picture2FileNames.push(fileName);
            } else if (file.fieldname === "DocumentFacturePieceFournisseur") {
              DocumentFacturePieceFournisseurFileNames.push(fileName);
            } else if (
              file.fieldname === "DocumentFacturePieceClientEconegoce"
            ) {
              DocumentFacturePieceClientEconegoceFileNames.push(fileName);
            }
          });
        }

        console.log("req.body", req.body);

        // Create new piece document
        const newPiece: PieceDocument = new PieceModel({
          created_at: req.body.created_at,
          creator: req.body.creator,
          picture2: picture2FileNames,
          DocumentFacturePieceFournisseur:
            DocumentFacturePieceFournisseurFileNames,
          DocumentFacturePieceClientEconegoce:
            DocumentFacturePieceClientEconegoceFileNames,
          societe: req.body.societe,
          client: req.body.client,
          serieNumber: req.body.serieNumber,
          marque: req.body.marque,
          numeroCommande: req.body.numeroCommande,
          articleName: req.body.articleName,
          reference: req.body.reference,
          stockDispoTremblay: req.body.stockDispoTremblay,
          dateCommande: req.body.dateCommande,
          dateDeLivraisonPrevu: req.body.dateDeLivraisonPrevu,
          lieuDuReception: req.body.lieuDuReception,
          dateReceptionDepot: req.body.dateReceptionDepot,
          dateExpedition: req.body.dateExpiditon,
          dateReceptionPieceDef: req.body.dateReceptionPieceDef,
          dateExpeditionPieceDef: req.body.dateExpiditonPieceDef,
          numeroDevisEconegoce: req.body.numeroDevisEconegoce,
          dateReglement: req.body.dateReglement,
          facturePieceFournisseur: req.body.facturePierceFournisseur,
          avoirPieceFournisseur: req.body.avoirPierceFournisseur,
          facturePieceClientEconegoce: req.body.FacturePieceClientEconegoce,
          reponseExpertise: req.body.RepenseExpertise,
          avoirPieceClientEconegoce: req.body.AvoirPieceClientEconegoce,
          dossierCloture: req.body.DossierCloture,
          observation: req.body.Observation,
          dateLivraisonPrevue: req.body.dateLivraisonPrevue,
          personneQuiPasseCommande: req.body.personneQuiPasseCommande,
          numeroBlOuFacture: req.body.numeroBlOuFacture,
          Prix: req.body.Prix,
          Quantite: req.body.Quantite,
          status: req.body.status,
          adresseRetrait: req.body.adresseRetrait,
        });

        // Save the piece to the database
        await newPiece.save();
        console.log("newPieces", newPiece);
        res.status(201).json({ success: "Piece created successfully" });
      });
    } catch (error) {
      console.error("Error creating piece:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else if (req.method === "PUT") {
    try {
      // Parse form data using multer
      upload.any()(req, res, async (err: any) => {
        if (err) {
          console.error("Error parsing form data:", err);
          if (err.code === "LIMIT_FILE_SIZE") {
            return res
              .status(400)
              .json({ error: "File size exceeds the limit of 20 MB" });
          }
          return res.status(500).json({ error: "Internal server error" });
        }
  
        const picture1FileNames: string[] = []; // For picture1
        const picture2FileNames: string[] = [];
        const DocumentFacturePieceFournisseurFileNames: string[] = [];
        const DocumentFacturePieceClientEconegoceFileNames: string[] = [];
  
        // Handle each file separately
        if (req.files && req.files.length > 0) {
          req.files.forEach((file) => {
            const fileName = `${file.originalname}`;
            const filePath = path.join(process.cwd(), "/uploadsss", fileName);
            fs.writeFileSync(filePath, file.buffer);
            if (file.fieldname === "picture2") {
              picture2FileNames.push(fileName);
            } else if (file.fieldname === "DocumentFacturePieceFournisseur") {
              DocumentFacturePieceFournisseurFileNames.push(fileName);
            } else if (
              file.fieldname === "DocumentFacturePieceClientEconegoce"
            ) {
              DocumentFacturePieceClientEconegoceFileNames.push(fileName);
            }
          });
        }
  
        console.log("update request body", req.body);
  
        // Retrieve the existing document
        const existingPiece = await PieceModel.findById(req.body._id);
        if (!existingPiece) {
          return res.status(404).json({ error: "Piece not found" });
        }
  
        // Filter out files that are not included in the request
        const updatedPicture2 = existingPiece.picture2?.filter((file: string) => req.body.picture2.includes(file))
          .concat(picture2FileNames);
  
        const updatedDocumentFacturePieceFournisseur =
          existingPiece.DocumentFacturePieceFournisseur?.filter((file: string) =>
              req.body.DocumentFacturePieceFournisseur.includes(file)
            )
            .concat(DocumentFacturePieceFournisseurFileNames);
  
        const updatedDocumentFacturePieceClientEconegoce =
          existingPiece.DocumentFacturePieceClientEconegoce?.filter((file: string) =>
              req.body.DocumentFacturePieceClientEconegoce.includes(file)
            )
            .concat(DocumentFacturePieceClientEconegoceFileNames);
  
        // Update the existing piece document
        const updatedPiece = await PieceModel.findByIdAndUpdate(
          req.body._id,
          {
            created_at: req.body.created_at,
            creator: req.body.creator,
            picture1:
              picture1FileNames.length > 0 ? picture1FileNames : undefined, // Add picture1
            picture2: updatedPicture2,
            DocumentFacturePieceFournisseur: updatedDocumentFacturePieceFournisseur,
            DocumentFacturePieceClientEconegoce: updatedDocumentFacturePieceClientEconegoce,
            societe: req.body.societe,
            client: req.body.client,
            serieNumber: req.body.serieNumber,
            marque: req.body.marque,
            numeroCommande: req.body.numeroCommande,
            articleName: req.body.articleName,
            reference: req.body.reference,
            stockDispoTremblay: req.body.stockDispoTremblay,
            dateCommande: req.body.dateCommande,
            dateDeLivraisonPrevu: req.body.dateDeLivraisonPrevu,
            lieuDuReception: req.body.lieuDuReception,
            dateReceptionDepot: req.body.dateReceptionDepot,
            dateExpedition: req.body.dateExpiditon,
            dateReceptionPieceDef: req.body.dateReceptionPieceDef,
            dateExpeditionPieceDef: req.body.dateExpiditonPieceDef,
            numeroDevisEconegoce: req.body.numeroDevisEconegoce,
            dateReglement: req.body.dateReglement,
            facturePieceFournisseur: req.body.facturePierceFournisseur,
            avoirPieceFournisseur: req.body.avoirPierceFournisseur,
            facturePieceClientEconegoce: req.body.FacturePieceClientEconegoce,
            reponseExpertise: req.body.RepenseExpertise,
            avoirPieceClientEconegoce: req.body.AvoirPieceClientEconegoce,
            dossierCloture: req.body.DossierCloture,
            observation: req.body.Observation,
            dateLivraisonPrevue: req.body.dateLivraisonPrevue,
            personneQuiPasseCommande: req.body.personneQuiPasseCommande,
            numeroBlOuFacture: req.body.numeroBlOuFacture,
            Prix: req.body.Prix,
            Quantite: req.body.Quantite,
            status: req.body.status,
            adresseRetrait: req.body.adresseRetrait,
          },
          { new: true }
        );
  

        console.log("updatedPiece", updatedPiece);

        if (!updatedPiece) {
          return res.status(404).json({ error: "Piece not found" });
        }

        res
          .status(200)
          .json({ success: "Piece updated successfully", piece: updatedPiece });
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
