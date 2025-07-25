import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '../../../lib/db';
import OrderModel from '../../../models/order';

async function getLastOrder(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  if (req.method === 'GET') {
    try {
      const { userId, createdBy } = req.query;

      // Check if either userId or createdBy is provided
      if (!userId && !createdBy) {
        res.status(400).json({ error: 'User ID or Created By is required.' });
        return;
      }

      // Build the query based on provided parameters
      const query: any = {};
      if (userId) {
        query.userId = userId;
      }
      if (createdBy) {
        query.createdBy = createdBy;
      }

      // Find the last order for the given criteria
      const lastOrder = await OrderModel.findOne(query)
        .sort({ orderNumber: -1 });

      if (!lastOrder) {
        res.status(404).json({ error: 'No order found for the given criteria.' });
        return;
      }

      res.status(200).json({ lastOrder });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error fetching last order: ', error.message);
        res.status(500).json({ error: 'Internal server error.' });
      } else {
        console.error('Unexpected error fetching last order:', error);
        res.status(500).json({ error: 'Internal server error.' });
      }
    }
  } else {
    res.status(500).json({ error: 'Invalid route.' });
  }
}

export default getLastOrder;
