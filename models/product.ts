import mongoose, { Document, Model } from 'mongoose';

// Define the interface for the Product document
export interface ProductDocument extends Document {
  name: string;
  stock_reel: number;
  stock: number;
  cost: number;
  status: "available" | "unavailable";
  use?: string;
  image?: string;
  ref: string;
  cat?: string;
  oldname?: string;
}

// Define the schema for the Product model
const productSchema = new mongoose.Schema<ProductDocument>(
  {
    name: { type: String, required: true },
    stock_reel: { type: Number, required: true },
    stock: { type: Number, required: true },
    cost: { type: Number, required: true },
    status: {
      type: String,
      required: true,
      enum: ["available", "unavailable"],
    },
    use: { type: String, default: null },
    image: { type: String, default: null },
    ref: { type: String, default: null },
    cat: { type: String, default: null },
    oldname: { type: String, default: null },
  },
  { strict: true }
);

// Check if the model already exists
const Product: Model<ProductDocument> = mongoose.models.Product || mongoose.model<ProductDocument>('Product', productSchema);

export default Product;
