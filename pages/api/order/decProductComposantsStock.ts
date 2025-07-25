// pages/api/kits/decProductComposantsStock.ts
import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/db';
import Product from '@/models/product';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  try {
    const products = req.body;

    // Validate request body
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    // Iterate over each product and decrement stock
    for (const { id, quantity } of products) {
      // Find product by ID
      const product = await Product.findById(id);
      if (!product) {
        return res.status(404).json({ error: `Product with ID ${id} not found` });
      }

      // Decrement the quantity
      product.stock -= quantity;

      // Save updated product
      await product.save();
    }

    return res.status(200).json({ message: 'Stock decremented successfully' });
  } catch (error) {
    console.error('Error decrementing product composants stock:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
