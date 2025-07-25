import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '../../../lib/db';
import UserModel from '../../../models/user';
import OrderModel from '../../../models/order';

async function createOrder(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  if (req.method === 'POST') {
    try {
      // Extract data from the request body
      const { installateur, refChantier, userId, composer, createdBy, products } = req.body;
      console.log(` request body: {
        installateur: ${installateur}
        refChantier: ${refChantier}   
        userId: ${userId}
        composer: ${composer}     
        createdBy: ${createdBy}                       
      }`)


      // Get the latest order number from the database
      const latestOrder = await OrderModel.findOne().sort({ _id: -1 });

      // Calculate the new order number
      const newOrderNumber = (latestOrder ? latestOrder.orderNumber : 0) + 1;

      // Get the current date in the format YY-MM-DD
      const currentDate = new Date().toISOString().slice(2, 10).replace(/-/g, '');

      // Generate retraitDeCommande and confirmationCommande with the new order number
      const retraitDeCommande = `RC${currentDate}-${newOrderNumber}`;
      const confirmationCommande = `CV${currentDate}-${newOrderNumber}`;

      // Fetch user information
      const user = await UserModel.findById(userId);

      if (!user) {
        res.status(404).json({ error: 'User not found.' });
        return;
      }

      // Create the order
      const order = await OrderModel.create({
        createdBy: createdBy,
        confirmationCommande,
        composer,
        installateur,
        refChantier,
        retraitDeCommande,
        userId,
        orderNumber: newOrderNumber, 
        products,
        test: "test"
      });

      res.status(200).json({ success: 'Order created successfully.', order });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error creating order: ', error.message);
        res.status(500).json({ error: 'Internal server error.' });
      } else {
        console.error('Unexpected error creating order:', error);
        res.status(500).json({ error: 'Internal server error.' });
      }
    }
  } else {
    res.status(500).json({ error: 'Invalid route.' });
  }
}

export default createOrder;
