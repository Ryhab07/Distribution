// pages/api/delete-user.ts
import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/db';
import UserModel from '@/models/user';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await connectDB();

  if (req.method === 'DELETE') {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: 'User ID is required.' });
    }

    try {
      // Find and delete the user by ID
      const deletedUser = await UserModel.findByIdAndDelete(id);

      if (!deletedUser) {
        return res.status(404).json({ error: 'User not found.' });
      }

      res.status(200).json({ message: 'User deleted successfully.', user: deletedUser });
    } catch (error) {
      console.error('Error deleting user:', error.message);
      res.status(500).json({ error: 'Internal server error.' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed.' });
  }
};

export default handler;
