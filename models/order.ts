import mongoose, { Document, Model, Schema } from "mongoose";

interface OrderDocument extends Document {
  installateur?: string;
  refChantier?: string;
  userId: string;
  retraitDeCommande: string;
  confirmationCommande: string;
  bonDeCommande?: string;
  bonDeRetrait?: string;
  composer?: boolean;
  orderNumber: number;
  createdBy: string;
  products: {
    id: string;
    name: string;
    quantity: number;
    composants?: {
      id: string;
      name: string;
      quantity: number;
    }[];
  }[];
}

const OrderModel: Model<OrderDocument> = getModel();

function getModel(): Model<OrderDocument> {
  try {
    // Try to delete the existing model
    mongoose.deleteModel("Order");
  } catch (e) {
    // Model doesn't exist, ignore the error
  }

  // Define the Order model
  const orderSchema = new mongoose.Schema({
    installateur: {
      type: String,
      required: false,
    },
    refChantier: {
      type: String,
      required: false,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    retraitDeCommande: {
      type: String,
      required: true,
    },
    confirmationCommande: {
      type: String,
      required: true,
    },
    createdBy: {
      type: String,
      required: true,
    },    
    bonDeCommande: {
      type: String,
      required: false,
    },
    bonDeRetrait: {
      type: String,
      required: false,
    },
    composer: {
      type: Boolean,
      required: false,
    },
    issueDate: {
      type: Date,
      default: Date.now,
    },
    products: [
    {
    id: { type: String, required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    composants: [
      {
        id: { type: String, required: true },
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
      },
    ],
    },
    ],
    orderNumber: {
      type: Number,
      required: true,
    },
  });

  return mongoose.model<OrderDocument>("Order", orderSchema);
}

export default OrderModel;
