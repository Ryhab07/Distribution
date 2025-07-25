import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/db';
import PhotovoltaiquesKitModel, { PhotovoltaiquesKit } from '@/models/kits_photovoltaiques';
import FixationKitModel, { FixationKit } from '@/models/kits-fixation';
import { ProductDocument } from '@/models/product';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  try {
    const kitType = req.query.type as string;
    const kitId = req.query.id as string | undefined; // Optional _id parameter

    let kits: (PhotovoltaiquesKit | FixationKit)[];

    // Fetch kits
    if (kitId) {
      // Fetch single kit by _id
      let kit;
      if (kitType === 'fixation') {
        kit = await FixationKitModel.findById(kitId);
      } else if (kitType === 'photovoltaiques') {
        kit = await PhotovoltaiquesKitModel.findById(kitId);
      }
      if (!kit) {
        throw new Error('Kit not found');
      }
      kits = [kit]; // Convert single kit to array
      console.log("Kit fetched:", kit);
    } else {
      // Fetch all kits
      if (kitType === 'fixation') {
        kits = await FixationKitModel.find();
        console.log("Fixation Kits fetched:", kits);
      } else if (kitType === 'photovoltaiques') {
        kits = await PhotovoltaiquesKitModel.find();
        console.log("Photovoltaiques Kits fetched:", kits);
      } else {
        throw new Error('Invalid kit type');
      }
    }

    // Fetch products
    const responseProducts = await fetch("http://localhost:3000/api/kits/productRoutes");
    const products: ProductDocument[] = await responseProducts.json();

    // Combine kits with filtered products
    const kitsWithProducts = kits.map(kit => {
      const filteredProducts = kit.composants.map(composant => {
        return products.find(product => product._id === composant._id);
      });

      // Calculate component quantities
      //const componentQuantities = calculateComponentQuantities(kit);

      // Merge quantities with existing data
      const kitWithQuantities = {
        ...kit.toObject(),
        composants: filteredProducts,
        //componentQuantities: componentQuantities // Add the calculated quantities
      };

      return kitWithQuantities;
    });

    res.status(200).json(kitsWithProducts);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
