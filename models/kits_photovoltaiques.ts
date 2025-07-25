import mongoose, { Document } from 'mongoose';

// Define the shape of the composant object
interface Composant {
  _id: string; // Assuming this is the ID of the product
  // Add any other fields if present in your composant object
}

export interface PhotovoltaiquesKit extends Document {
  name: string;
  type_alim_elec: string;
  puissance: number;
  puissance_panneau: number;
  nb_panneaux_micro_onduleur: number;
  description: string;
  composants: Composant[]; 
  quantities: any;// Change the type to the defined interface
}

// Define schema for PhotovoltaiquesKit
const photovoltaiquesKitSchema = new mongoose.Schema({
  name: String,
  type_alim_elec: String,
  puissance: Number,
  puissance_panneau: Number,
  nb_panneaux_micro_onduleur: Number,
  description: String,
  composants: [{ _id: String }] // Define the shape of the composants array
});

// Check if the model already exists
const modelName = 'kits_photovoltaiques';
const existingModel = mongoose.models[modelName] as mongoose.Model<PhotovoltaiquesKit> | undefined;

// If the model already exists, use it; otherwise, define and export the model
export default existingModel ?? mongoose.model<PhotovoltaiquesKit>(modelName, photovoltaiquesKitSchema);
