import mongoose, { Schema, Document } from 'mongoose';

export interface IPhotovoltaicKit extends Document {
  _id: string; // Unique identifier for the kit
  name: string; // Name of the kit
  type_alim_elec: string; // Type of electrical supply (e.g., Monophasé)
  puissance: number; // Power of the kit in watts
  puissance_panneau: number; // Power of the panels in watts
  nb_panneaux_micro_onduleur: number; // Number of panels per micro-inverter
  description: string; // Description of the kit
  totalPrice: number; // Total price of the kit
  composants: {
    _id: string; // Product ID
    name: string; // Product name
    stock_reel: number; // Real stock
    stock: number; // Available stock
    cost: number; // Cost of the product
    use: string; // Usage of the product
    image: string; // Image URL of the product
    ref: string; // Reference ID of the product
    cat: string; // Category of the product
    oldname: string; // Old name of the product
    status: string; // Status of the product (e.g., available, unavailable)
    quantity: number; // Quantity of the product
  }[];
  status: 'available' | 'unavailable';
}

const PhotovoltaicKitSchema: Schema = new Schema({
  _id: { type: String, required: true, unique: true }, // Unique identifier for the kit
  name: { type: String, required: true },
  type_alim_elec: { type: String, required: true },
  puissance: { type: Number, required: true },
  puissance_panneau: { type: Number, required: true },
  nb_panneaux_micro_onduleur: { type: Number, required: true },
  description: { type: String, required: true },
  totalPrice: { type: Number, required: true },
  composants: [
    {
      _id: { type: String, required: false }, // Product ID
      name: { type: String, required: false }, // Product name
      stock_reel: { type: Number, required: false }, // Real stock
      stock: { type: Number, required: false }, // Available stock
      cost: { type: Number, required: false }, // Cost of the product
      use: { type: String, required: false }, // Usage of the product
      image: { type: String, required: false }, // Image URL of the product
      ref: { type: String, required: false }, // Reference ID of the product
      cat: { type: String, required: false }, // Category of the product
      oldname: { type: String, required: false }, // Old name of the product
      status: { type: String, required: false }, // Status of the product
      quantity: { type: Number, required: false }, // Quantity of the product
    },
  ],
  status: { type: String, enum: ['available', 'unavailable'], default: 'available' },
});

export default mongoose.models.PhotovoltaicKit || mongoose.model<IPhotovoltaicKit>('PhotovoltaicKit', PhotovoltaicKitSchema);