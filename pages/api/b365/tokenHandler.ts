import { NextApiRequest, NextApiResponse } from 'next';
import getToken from './getToken';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await getToken(res);
  } catch (error) {
    console.error('Error in API handler:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default handler;
