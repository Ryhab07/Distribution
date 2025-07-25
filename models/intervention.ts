import mongoose, { Document, Model } from "mongoose";

export interface InterventionDocument extends Document {
  created_at?: Date;
  interventionCreatedID?: string;
  creator?: string;
  dateDeLaDemande: string | Date;
  societe: string;
  client: string;
  marque: string;
  serieNumber: string;
  nDeTicket: string;
  devisEconegoce: string;
  devisFournisseur: string;
  dateDinterventionPrevut: string | Date;
  dateDuRapport: string | Date;
  factureFournisseur: string[];
  bonDeCommandeEconegoce: string;
  factureEconegoce: string;
  observation?: string;
}

const interventionSchema = new mongoose.Schema({
  created_at: {
    type: Date,
    required: true,
  },
  interventionCreatedID: {
    type: String,
    required: false,
  },
  creator: {
    type: String,
    required: false,
  },
  dateDeLaDemande: {
    type: mongoose.Schema.Types.Mixed,
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
  nDeTicket: {
    type: String,
    required: false,
  },
  devisEconegoce: {
    type: String,
    required: false,
  },
  devisFournisseur: {
    type: String,
    required: false,
  },
  dateDinterventionPrevut: {
    type: mongoose.Schema.Types.Mixed,
    required: false,
  },
  dateDuRapport: {
    type: mongoose.Schema.Types.Mixed,
    required: false,
  },
  factureFournisseur: {
    type: [String],
    required: false,
  },
  bonDeCommandeEconegoce: {
    type: String,
    required: false,
  },
  factureEconegoce: {
    type: String,
    required: false,
  },
  observation: {
    type: String,
    required: false,
  },
});

const InterventionModel: Model<InterventionDocument> =
  mongoose.models.Interventions ||
  mongoose.model<InterventionDocument>("Interventions", interventionSchema);

export default InterventionModel;
