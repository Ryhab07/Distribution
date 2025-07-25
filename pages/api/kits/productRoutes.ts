import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/db';
import Product from '@/models/product';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  try {
    switch (req.method) {
      case 'GET': {
        const { type } = req.query;

        if (type) {
          const categories = (type as string).split(',');
          const products = await Product.find({ cat: { $in: categories } });
          return res.status(200).json(products);
        } else {
          const products = await Product.find();
          return res.status(200).json(products);
        }
      }

      case 'POST': {
        // Add a new product
        const { name, stock_reel, stock, cost, use, image, ref, cat, oldname, status } = req.body;

        const newProduct = new Product({
          name,
          stock_reel,
          stock,
          cost,
          use,
          image,
          ref,
          cat,
          oldname,
          status
        });

        await newProduct.save();
        return res.status(201).json({ message: 'Product added successfully', product: newProduct });
      }

      case 'PUT': {
        const { id } = req.query; 
        const { updateData } = req.body;
      
        console.log("Received updateData:", updateData); // Log to verify updateData content
      
        try {
          const updatedProduct = await Product.findByIdAndUpdate(
            id, 
            { $set: updateData }, // Use $set to ensure fields in updateData are updated
            { new: true }
          );
      
          if (!updatedProduct) {
            return res.status(404).json({ error: 'Product not found' });
          }
      
          return res.status(200).json({
            message: 'Product updated successfully',
            product: updatedProduct,
          });
        } catch (error) {
          console.error("Error updating product:", error);
          return res.status(500).json({ error: 'Internal Server Error' });
        }
      }
      

      case 'DELETE': {
        // Delete a product
        const { id } = req.query;

        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
          return res.status(404).json({ error: 'Product not found' });
        }

        return res.status(200).json({ message: 'Product deleted successfully' });
      }

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
