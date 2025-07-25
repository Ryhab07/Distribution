import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '../../../lib/db';
import OrderModel from '../../../models/order';

async function modifyOrder(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  if (req.method === 'POST') {
    try {
      const { _id, bonDeCommande, bonDeRetrait} = req.body;

      // Find the order by _id
      const order = await OrderModel.findById(_id);

      if (!order) {
        res.status(404).json({ error: 'Order not found.' });
        return;
      }

      // Update the order with the new information
      order.bonDeCommande = bonDeCommande;
      order.bonDeRetrait = bonDeRetrait;

      // Save the updated order
      await order.save();

      res.status(200).json({ success: 'Order modified successfully.', order });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error modifying order: ', error.message);
        res.status(500).json({ error: 'Internal server error.' });
      } else {
        console.error('Unexpected error modifying order:', error);
        res.status(500).json({ error: 'Internal server error.' });
      }
    }
  } else {
    res.status(500).json({ error: 'Invalid route.' });
  }
}

export default modifyOrder;
