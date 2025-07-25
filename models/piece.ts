import mongoose, { Document, Model } from "mongoose";

export interface PieceDocument extends Document {
  pieceCreatedID?: string;
  created_at?: Date;
  creator?: string;
  picture2?: string[];
  DocumentFacturePieceFournisseur?: string[];
  DocumentFacturePieceClientEconegoce?: string[];
  societe: string;
  client: string;
  serieNumber: string;
  marque: string;
  numeroCommande: string;
  articleName: string;
  reference: string;
  stockDispoTremblay: string;
  dateCommande: string | string | Date;
  lieuDuReception: string;
  dateReceptionDepot: string | Date;
  dateDeLivraisonPrevu: string | Date;
  dateExpedition: string | Date;
  dateReceptionPieceDef: string | Date;
  dateExpeditionPieceDef: string | Date;
  numeroDevisEconegoce: string;
  dateReglement: string | Date;
  facturePieceFournisseur: string[];
  avoirPieceFournisseur: string[];
  facturePieceClientEconegoce: string[];
  facturePierceFournisseur: string[];
  reponseExpertise: string;
  avoirPieceClientEconegoce: string;
  dossierCloture: string;
  observation?: string;
  dateLivraisonPrevue: string | Date;
  personneQuiPasseCommande: string;
  numeroBlOuFacture: string;
  Prix: number;
  Quantite: number;
  status?: 'En attente de commande pièces' | 'Pièces envoyées' | 'En attente de réception de pièces' | 'Facturation' | 'Avoir' | 'Validé'| 'En attente de paiement';
  adresseRetrait?: '53 Av. du Bois de la Pie, 93290 Tremblay-en-France' | '1 Avenue de la gare, 95380 Louvres';
}

const pieceSchema = new mongoose.Schema({
  created_at: {
    type: Date,
    required: true,
  },
  pieceCreatedID: {
    type: String,
    required: false,
  },
  creator: {
    type: String,
    required: false,
  },
  picture2: {
    type: [String],
    required: false,
  },
  DocumentFacturePieceFournisseur: {
    type: [String], 
    required: false,
  },
  DocumentFacturePieceClientEconegoce: {
    type: [String],
    required: false,
  },
  societe: {
    type: String,
    required: false,
  },
  client: {
    type: String,
    required: false,
  },
  serieNumber: {
    type: String,
    required: false,
  },
  marque: {
    type: String,
    required: false,
  },
  numeroCommande: {
    type: String,
    required: false,
  },
  articleName: {
    type: String,
    required: false,
  },
  reference: {
    type: String,
    required: false,
  },
  stockDispoTremblay: {
    type: String,
    required: false,
  },
  dateCommande: {
    type: mongoose.Schema.Types.Mixed,
    required: false,
  },
  lieuDuReception: {
    type: String,
    required: false,
  },
  dateReceptionDepot: {
    type: mongoose.Schema.Types.Mixed,
    required: false,
  },
  dateExpedition: {
    type: mongoose.Schema.Types.Mixed,
    required: false,
  },
  dateDeLivraisonPrevu: {
    type: mongoose.Schema.Types.Mixed,
    required: false, 
  },
  dateReceptionPieceDef: {
    type: mongoose.Schema.Types.Mixed,
    required: false,
  },
  dateExpeditionPieceDef: {
    type: mongoose.Schema.Types.Mixed,
    required: false,
  },
  numeroDevisEconegoce: {
    type: String,
    required: false,
  },
  dateReglement: {
    type: mongoose.Schema.Types.Mixed,
    required: false,
  },
  facturePieceFournisseur: {
    type: [String], // Define as an array of strings
    required: false,
  },
  avoirPieceFournisseur: {
    type: [String], // Define as an array of strings
    required: false,
  },
  facturePieceClientEconegoce: {
    type: [String], // Define as an array of strings
    required: false,
  },
  facturePierceFournisseur: {
    type: [String], // Define as an array of strings
    required: false,
  },
  reponseExpertise: {
    type: String,
    required: false,
  },
  avoirPieceClientEconegoce: {
    type: String,
    required: false,
  },
  dossierCloture: {
    type: String,
    required: false,
  },
  observation: {
    type: String,
    required: false,
  },
  dateLivraisonPrevue: {
    type: mongoose.Schema.Types.Mixed,
    required: false,
  },
  personneQuiPasseCommande: {
    type: String,
    required: false,
  },
  numeroBlOuFacture: {
    type: String,
    required: false,
  },
  Prix: {
    type: Number,
    required: false,
  },
  Quantite: {
    type: Number,
    required: false,
  },  
  status: {
    type: String,
    enum: [
      'En attente de commande pièces',
      'Pièces envoyées',
      'En attente de réception de pièces',
      'Facturation',
      'Avoir',
      'Validé',
      'En attente de paiement'
    ],
    default: 'En attente de commande pièces',
  },
  adresseRetrait: {
    type: String,
    enum: [
      '53 Av. du Bois de la Pie, 93290 Tremblay-en-France',
      '1 Avenue de la gare, 95380 Louvres',
    ],
    default: '53 Av. du Bois de la Pie, 93290 Tremblay-en-France',
  }
});

const PieceModel: Model<PieceDocument> =
  mongoose.models.Piece || mongoose.model<PieceDocument>("Piece", pieceSchema);

export default PieceModel;
