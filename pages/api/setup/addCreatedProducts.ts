// pages/populateProducts.ts
import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import connectDB from '../../../lib/db';

// Define the schema for products
const productSchema = new mongoose.Schema({
  id: String,
  product: String,
});

// Define the Product model
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

// Function to populate the products collection
const populateProducts = async () => {
  try {
    // Connect to the database
    await connectDB();

    // Read products from the JSON file
    const productsFilePath = path.join(process.cwd(), '../../../../savedProducts/DevinovProducts.json');

    console.log('File path:', productsFilePath); // Log file path

    if (!fs.existsSync(productsFilePath)) {
      throw new Error('File not found');
    }

    const productsData = fs.readFileSync(productsFilePath, 'utf-8');
    const products = JSON.parse(productsData);

    // Insert products into the collection
    await Product.insertMany(products);

    console.log('Products inserted successfully.');
  } catch (error) {
    console.error('Error populating products:', error);
  }
};

// Handler function for the Next.js API route
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await populateProducts();

  // Respond with success message
  res.status(200).json({ message: 'Products populated successfully.' });
};

export default handler;
