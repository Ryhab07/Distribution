import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/db';
import UserModel from '@/models/user';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await connectDB();

  if (req.method === 'GET') {
    try {
      // Extract query parameters
      const { userType, creator } = req.query;

      // Query to find the user based on user type and creator
      let query = {};
      if (userType) {
        query = { ...query, role: userType };
      }
      if (creator) {
        query = { ...query, 'creator': creator };
      }
      const user = await UserModel.find(query);

      if (!user || user.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Return the user
      return res.status(200).json({ users: user });
    } catch (error) {
      console.error('Error while fetching user:', error.message);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
};

export default handler;
