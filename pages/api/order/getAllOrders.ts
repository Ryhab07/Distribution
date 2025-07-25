import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '../../../lib/db';
import OrderModel from '../../../models/order';

async function getAllOrders(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  if (req.method === 'GET') {
    try {
      const { userId, createdBy } = req.query;

      if (!userId && !createdBy) {
        res.status(400).json({ error: 'User ID or Created By is required.' });
        return;
      }

      // Build the query
      const query: any = {};
      if (userId) {
        query.userId = userId;
      }
      if (createdBy) {
        query.createdBy = createdBy;
      }

      // Find all orders for the given user ID or created by value
      const orders = await OrderModel.find(query);

      if (!orders || orders.length === 0) {
        res.status(404).json({ error: 'No orders found for the given criteria.' });
        return;
      }

      res.status(200).json({ orders });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error fetching orders: ', error.message);
        res.status(500).json({ error: 'Internal server error.' });
      } else {
        console.error('Unexpected error fetching orders:', error);
        res.status(500).json({ error: 'Internal server error.' });
      }
    }
  } else {
    res.status(500).json({ error: 'Invalid route.' });
  }
}

export default getAllOrders;
