import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/db';
import Product from '@/models/product';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  try {
    const { id, newStock } = req.body;

    // Validate request body
    if (!id || !newStock) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Find product by ID
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Update product stock
    product.stock = newStock;

    // Save updated product
    await product.save();

    return res.status(200).json(product);
  } catch (error) {
    console.error('Error updating product stock:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}