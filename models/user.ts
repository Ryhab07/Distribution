import mongoose, { Document, Model, Types } from "mongoose";

interface UserDocument extends Document {
  email: string;
  email2: string;
  password: string;
  role: "user" | "admin" | "collaborator" | "picker" | "userPro";
  entreprise: string | null;
  phone: string | null;
  phoneSecondaire: string | null;
  name: string | null;
  lastname: string | null;
  adresse: string | null;
  sales375: number;
  sales500: number;
  creator: Types.ObjectId | null; // New field for the creator's ID
  emailCount: number; // New field to track email usage count
}

// Initialize UserModel directly
const UserModel: Model<UserDocument> = (() => {
  try {
    // Try to delete the existing model
    mongoose.deleteModel("User");
  } catch (e) {
    // Model doesn't exist, ignore the error
  }

  // Define and return the User model
  return mongoose.model<UserDocument>(
    "User",
    new mongoose.Schema({
      email: {
        type: String,
        required: true,
        lowercase: true,
        unique: false,
      },
      email2: {
        type: String,
        required: false,
        unique: false,
        lowercase: true,
      },
      password: {
        type: String,
        required: true,
      },
      name: {
        type: String,
      },
      lastname: {
        type: String,
      },
      entreprise: {
        type: String,
      },
      phone: {
        type: String,
      },
      phoneSecondaire: {
        type: String,
      },
      adresse: {
        type: String,
      },
      sales375: {
        type: Number,
        default: 0.0, 
      },
      sales500: {
        type: Number,
        default: 0.0, 
      },
      role: {
        type: String,
        enum: ["user", "admin", "collaborator", "picker", "userPro"],
        default: "user",
      },
      creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
        default: null, 
      },
      emailCount: {
        type: Number,
        default: 1,
      },
    })
  );
})();

export default UserModel;
