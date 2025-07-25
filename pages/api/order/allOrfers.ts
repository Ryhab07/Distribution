import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '../../../lib/db';
import OrderModel from '../../../models/order';
import UserModel from '../../../models/user';

async function getOrdersWithUserDetails() {
  try {
    // Step 1: Get all orders
    const orders = await OrderModel.find({}).lean();

    // Step 2: Extract unique user IDs
    const userIds = [
      ...new Set(orders.flatMap(order => [order.userId, order.createdBy])),
    ];

    // Step 3: Fetch user details by unique IDs
    const users = await UserModel.find({ _id: { $in: userIds } })
      .select("name lastname")
      .lean();

    // Step 4: Map user details by ID, with fallback for missing name or lastname
    const userMap = users.reduce((acc, user) => {
      acc[user._id.toString()] = {
        name: user.name ?? "Unknown Name",
        lastname: user.lastname ?? "Unknown Lastname",
      };
      return acc;
    }, {} as Record<string, { name: string; lastname: string }>);

    // Step 5: Replace userId and createdBy in orders
    const formattedOrders = orders.map(order => ({
      ...order,
      userId: userMap[order.userId?.toString()] || null,
      createdBy: userMap[order.createdBy?.toString()] || null,
    }));

    return formattedOrders;
  } catch (error) {
    console.error("Error fetching orders with user details:", error);
    throw error;
  }
}

async function getAllOrders(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  if (req.method === 'GET') {
    try {
      // Fetch all orders with user details
      const orders = await getOrdersWithUserDetails();

      if (!orders || orders.length === 0) {
        res.status(404).json({ error: 'No orders found.' });
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
    res.status(400).json({ error: 'Invalid request method.' });
  }
}

export default getAllOrders;
