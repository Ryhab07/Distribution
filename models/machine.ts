import mongoose, { Document, Model } from "mongoose";

export interface SavMachineDocument extends Document {
  pieceCreatedID?: string;
  created_at?: string | Date;
  creator?: string;
  picture1?: string[];
  picture2?: string[];
  numeroBlOuFacture: string;
  dateDemande: string | Date;
  installateur: string;
  client: string;
  causeSAV: string;
  marque: string;
  articleNumber: string;
  modele: string;
  categorieArticle: string;
  serieNumber: string;
  quantite: number;
  blNumber: string;
  accord: string;
  dateRetourDepot?: string | Date;
  dateDemandeAvoirFournisseur?: string | Date;
  dateReceptionAvoirFournisseur?: string | Date;
  statutFournisseur?: string;
  avoirFournisseurNumber?: string;
  dateAvoirInstallateur?: string | Date;
  avoirInstallateurNumber?: string;
  zendesk?: string;
  observation?: string;
  nouveauBlNumber?: string;
  dateRetourFournisseur?: string | Date;
  prixVente: number;
  prixAchat: number;
  retoursMachines?: string;
  status?: 'En attente de commande pièces' | 'Pièces envoyées' | 'En attente de réception de pièces' | 'Facturation' | 'Avoir' | 'Validé' | 'En attente de paiement';
  adresseRetrait?: '53 Av. du Bois de la Pie, 93290 Tremblay-en-France' | '1 Avenue de la gare, 95380 Louvres';
}

const savMachineSchema = new mongoose.Schema({
  created_at: {
    type: mongoose.Schema.Types.Mixed,
    required: false,
  },
  pieceCreatedID: {
    type: String,
    required: false,
  },
  creator: {
    type: String,
    required: false,
  },
  picture1: {
    type: [String],
    required: false,
  },
  picture2: {
    type: [String],
    required: false,
  },
  numeroBlOuFacture: {
    type: String,
    required: false,
  },
  dateDemande: {
    type: mongoose.Schema.Types.Mixed,
    required: false,
  },
  installateur: {
    type: String,
    required: false,
  },
  client: {
    type: String,
    required: false,
  },
  causeSAV: {
    type: String,
    required: false,
  },
  marque: {
    type: String,
    required: false,
  },
  articleNumber: {
    type: String,
    required: false,
  },
  modele: {
    type: String,
    required: false,
  },
  categorieArticle: {
    type: String,
    required: false,
  },
  serieNumber: {
    type: String,
    required: false,
  },
  quantite: {
    type: Number,
    required: false,
  },
  blNumber: {
    type: String,
    required: false,
  },
  accord: {
    type: String,
    required: false,
  },
  dateRetourDepot: {
    type: mongoose.Schema.Types.Mixed,
    required: false,
  },
  dateDemandeAvoirFournisseur: {
    type: mongoose.Schema.Types.Mixed,
    required: false,
  },
  dateReceptionAvoirFournisseur: {
    type: mongoose.Schema.Types.Mixed,
    required: false,
  },
  statutFournisseur: {
    type: String,
    required: false,
  },
  avoirFournisseurNumber: {
    type: String,
    required: false,
  },
  dateAvoirInstallateur: {
    type: mongoose.Schema.Types.Mixed,
    required: false,
  },
  avoirInstallateurNumber: {
    type: String,
    required: false,
  },
  zendesk: {
    type: String,
    required: false,
  },
  observation: {
    type: String,
    required: false,
  },
  nouveauBlNumber: {
    type: String,
    required: false,
  },

  retoursMachines: {
    type: String,
    required: false,    
  },
  
  dateRetourFournisseur: {
    type: mongoose.Schema.Types.Mixed,
    required: false,
  },
  prixVente: {
    type: Number,
    required: false,
  },
  prixAchat: {
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

const SavMachineModel: Model<SavMachineDocument> =
  mongoose.models.SavMachine ||
  mongoose.model<SavMachineDocument>("SavMachine", savMachineSchema);

export default SavMachineModel;