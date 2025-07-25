// lib/db.ts
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

//const  MONGODB_URIinv= "mongodb://devinov:Devinov2022$@162.19.233.48:27017/ECOBL?authSource=admin"
const  MONGODB_URIinv= "mongodb://devinov:Devinov2022$@162.19.233.48:27017/distribution-mafatec?authSource=admin"
const connectDB = async () => {
  /**
   * Connects to the MongoDB database using the provided URI.
   *
   * @returns {Promise<void>} A promise that resolves when the connection is established.
   * @throws {Error} If there is an error connecting to the MongoDB database.
   */

  
  /**
   * Se connecte à la base de données MongoDB en utilisant l'URI fourni.
   *
   * @returns {Promise<void>} Une promesse qui se résout lorsque la connexion est établie.
   * @throws {Error} S'il y a une erreur lors de la connexion à la base de données MongoDB.
   */

  const MONGODB_URI = MONGODB_URIinv;

  try {

    await mongoose.connect(`${MONGODB_URI}`);

    console.log(`Connected to MongoDB : ${MONGODB_URI}`);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

export default connectDB;
