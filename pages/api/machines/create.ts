import { NextApiRequest, NextApiResponse } from "next";
import connectDB from "@/lib/db";
import SavMachineModel, { SavMachineDocument } from "@/models/machine";
import fs from "fs";
import path from "path";
import multer from "multer";

// Extend the NextApiRequest type to include the files property
interface CustomNextApiRequest extends NextApiRequest {
  files?: Express.Multer.File[];
}

// Configure multer for parsing form data and set file size limit
const upload = multer({
  // No limits, allowing any file size
});
                  
async function handler(req: CustomNextApiRequest, res: NextApiResponse) {
  // Connect to MongoDB using the db.ts file
  await connectDB();

  // Function to normalize field names by trimming spaces and handling "undefined_" prefixes
  /*const normalizeFieldName = (fieldName: string) => {
    if (!fieldName) return ""; // Return an empty string if fieldName is undefined
    return fieldName
      .trim()
      .replace(/\s+/g, "_")
      .replace(/^undefined_/, ""); // Normalize spaces to underscores, remove "undefined_" prefix if present
  };*/

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

        const picture1FileNames: string[] = [];
        const picture2FileNames: string[] = [];
        console.log("body", req.body);

        // Handle each file separately
        if (req.files && req.files.length > 0) {
          console.log("req files", req.files);
          req.files.forEach((file) => {
            const fileName = `${file.originalname}`;
            const filePath = path.join(process.cwd(), "/uploadsss", fileName);
            fs.writeFileSync(filePath, file.buffer);
            if (file.fieldname === "picture1") {
              picture1FileNames.push(fileName);
            } else if (file.fieldname === "picture2") {
              picture2FileNames.push(fileName);
            }
          });
        }

        // Convert string values to appropriate types
        const prixAchat = parseFloat(req.body.prixAchat);
        const prixVente = parseFloat(req.body.prixVente);

        // Create new piece document
        const newPiece: SavMachineDocument = new SavMachineModel({
          created_at: req.body.created_at,
          creator: req.body.creator,
          picture1: picture1FileNames,
          picture2: picture2FileNames,
          prixAchat: prixAchat,
          prixVente: prixVente,
          numeroBlOuFacture: req.body.numeroBlOuFacture,
          dateDemande: req.body.dateDemande,
          installateur: req.body.installateur,
          client: req.body.client,
          zendesk: req.body.zendesk,
          observation: req.body.observation,
          causeSAV: req.body.causeSAV,
          marque: req.body.marque,
          articleNumber: req.body.articleNumber,
          modele: req.body.modele,
          categorieArticle: req.body.categorieArticle,
          serieNumber: req.body.serieNumber,
          quantite: req.body.quantite,
          blNumber: req.body.blNumber,
          accord: req.body.accord,
          dateRetourDepot: req.body.dateRetourDepot,
          dateDemandeAvoirFournisseur: req.body.dateDemandeAvoirFournisseur,
          dateReceptionAvoirFournisseur: req.body.dateReceptionAvoirFournisseur,
          statutFournisseur: req.body.statutFournisseur,
          avoirFournisseurNumber: req.body.avoirFournisseurNumber,
          dateAvoirInstallateur: req.body.dateAvoirInstallateur,
          avoirInstallateurNumber: req.body.avoirInstallateurNumber,
          nouveauBlNumber: req.body.nouveauBlNumber,
          dateRetourFournisseur: req.body.dateRetourFournisseur,
          retoursMachines: req.body.retoursMachines,
          status: req.body.status,
          adresseRetrait: req.body.adresseRetrait,
        });

        // Save the piece to the database
        await newPiece.save();

        res.status(201).json({ success: "Piece created successfully" });
      });
    } catch (error) {
      console.error("Error creating piece:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else if (req.method === "PUT") {
    try {
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
  
        const picture1FileNames: string[] = [];
        const picture2FileNames: string[] = [];
  
        // Handle each file separately
        if (req.files && req.files.length > 0) {
          req.files.forEach((file) => {
            const fileName = `${file.originalname}`;
            const filePath = path.join(process.cwd(), "/uploadsss", fileName);
            fs.writeFileSync(filePath, file.buffer);
            if (file.fieldname === "picture1") {
              picture1FileNames.push(fileName);
            } else if (file.fieldname === "picture2") {
              picture2FileNames.push(fileName);
            }
          });
        }
  
        console.log("Update request body", req.body);
  
        // Retrieve the existing document
        const existingPiece = await SavMachineModel.findById(req.body._id);
        if (!existingPiece) {
          return res.status(404).json({ error: "Piece not found" });
        }
  
        // Filter out files that are not included in the request
        const updatedPicture1 = existingPiece?.picture1?.filter((file: string) =>
          req.body?.picture1?.includes(file)
        ).concat(picture1FileNames);
  
        const updatedPicture2 = existingPiece?.picture2?.filter((file: string) =>
          req.body?.picture2?.includes(file)
        ).concat(picture2FileNames);
  
        // Ensure existing values persist unless overridden
        const updatedPiece = await SavMachineModel.findByIdAndUpdate(
          req.body._id,
          {
            created_at: req.body.created_at || existingPiece.created_at,
            creator: req.body.creator || existingPiece.creator,
            picture1: updatedPicture1,
            picture2: updatedPicture2,
            prixAchat: req.body.prixAchat
              ? parseFloat(req.body.prixAchat)
              : existingPiece.prixAchat,
            prixVente: req.body.prixVente
              ? parseFloat(req.body.prixVente)
              : existingPiece.prixVente,
            numeroBlOuFacture:
              req.body.numeroBlOuFacture || existingPiece.numeroBlOuFacture,
            dateDemande: req.body.dateDemande || existingPiece.dateDemande,
            installateur: req.body.installateur || existingPiece.installateur,
            client: req.body.client || existingPiece.client,
            zendesk: req.body.zendesk || existingPiece.zendesk,
            observation: req.body.observation || existingPiece.observation,
            causeSAV: req.body.causeSAV || existingPiece.causeSAV,
            marque: req.body.marque || existingPiece.marque,
            articleNumber: req.body.articleNumber || existingPiece.articleNumber,
            modele: req.body.modele || existingPiece.modele,
            categorieArticle:
              req.body.categorieArticle || existingPiece.categorieArticle,
            serieNumber: req.body.serieNumber || existingPiece.serieNumber,
            quantite: req.body.quantite || existingPiece.quantite,
            blNumber: req.body.blNumber || existingPiece.blNumber,
            accord: req.body.accord || existingPiece.accord,
            dateRetourDepot:
              req.body.dateRetourDepot || existingPiece.dateRetourDepot,
            dateDemandeAvoirFournisseur:
              req.body.dateDemandeAvoirFournisseur ||
              existingPiece.dateDemandeAvoirFournisseur,
            dateReceptionAvoirFournisseur:
              req.body.dateReceptionAvoirFournisseur ||
              existingPiece.dateReceptionAvoirFournisseur,
            statutFournisseur:
              req.body.statutFournisseur || existingPiece.statutFournisseur,
            avoirFournisseurNumber:
              req.body.avoirFournisseurNumber ||
              existingPiece.avoirFournisseurNumber,
            dateAvoirInstallateur:
              req.body.dateAvoirInstallateur ||
              existingPiece.dateAvoirInstallateur,
            avoirInstallateurNumber:
              req.body.avoirInstallateurNumber ||
              existingPiece.avoirInstallateurNumber,
            nouveauBlNumber:
              req.body.nouveauBlNumber || existingPiece.nouveauBlNumber,
            dateRetourFournisseur:
              req.body.dateRetourFournisseur ||
              existingPiece.dateRetourFournisseur,
            retoursMachines:
              req.body.retoursMachines || existingPiece.retoursMachines,
            status: req.body.status || existingPiece.status,
            adresseRetrait:
              req.body.adresseRetrait || existingPiece.adresseRetrait,
          },
          { new: true }
        );
  
        res.status(200).json({
          success: "Piece updated successfully",
          piece: updatedPiece,
        });
      });
    } catch (error) {
      console.error("Error updating piece:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
  else {
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
