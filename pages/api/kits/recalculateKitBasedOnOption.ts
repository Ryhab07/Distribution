import { NextApiRequest, NextApiResponse } from 'next';
import { HydratedDocument } from 'mongoose';
import Product, { ProductDocument } from "@/models/product";
import connectDB from '@/lib/db';
import PhotovoltaicKit from "@/models/PhotovoltaicKit";

// Define the type for the PhotovoltaicKit document
type PhotovoltaicKitDocument = HydratedDocument<typeof PhotovoltaicKit>;

interface Composant {
  product: ProductDocument;
  quantity: number;
}

async function recalculateKitBasedOnOption(
  kitName: string,
  option: string
): Promise<PhotovoltaicKitDocument> {
  // Connect to MongoDB
  await connectDB();

  // Fetch the kit by name
  const kit = await PhotovoltaicKit.findOne({ name: kitName });
  if (!kit) {
    throw new Error(`Kit with name ${kitName} not found`);
  }

  // Helper function to fetch a product by reference
  const fetchProduct = async (ref: string): Promise<ProductDocument> => {
    const product = await Product.findOne({ ref });
    if (!product) {
      throw new Error(`Product with reference ${ref} not found`);
    }
    return product;
  };

  // Extract the number of rails (NbRail) from the kit
  const nbRail = kit.composants.find(composant => composant.ref === "R59")?.quantity || 0;
  const nbCrochet = nbRail * 2;

  // Create a copy of the original kit's components with their product fields intact
  const updatedComposants: Composant[] = await Promise.all(
    kit.composants.map(async (composant) => {
      const product = await fetchProduct(composant.ref);
      return {
        product,
        quantity: composant.quantity,
      };
    })
  );

  let filteredComposants;

  // Handle the selected option
  switch (option) {
    case "Tuile ardoise":
      filteredComposants = updatedComposants.filter(composant =>
        !["FA0127", "RH-304-0007-2", "RH-304-000701R59", "RH-304-0059", "RH-304-0016", "380064-1"].includes(composant.product.ref)
      );
      const crochetsArdoise = await fetchProduct("RH-304-0007-2");
      const visBoisArdoise = await fetchProduct("FA0127");
      filteredComposants.push(
        { product: crochetsArdoise, quantity: nbCrochet },
        { product: visBoisArdoise, quantity: nbCrochet * 2 }
      );
      break;
  
    case "Tuile canal":
      filteredComposants = updatedComposants.filter(composant =>
        !["FA0127", "RH-304-0007-2", "RH-304-000701R59", "RH-304-0059", "RH-304-0016", "380064-1"].includes(composant.product.ref)
      );
      const crochetsCanal = await fetchProduct("RH-304-000701R59");
      const visBoisCanal = await fetchProduct("FA0127");
      filteredComposants.push(
        { product: crochetsCanal, quantity: nbCrochet },
        { product: visBoisCanal, quantity: nbCrochet * 2 }
      );
      break;
  
    case "Tuile mécanique":
      filteredComposants = updatedComposants.filter(composant =>
        !["FA0127", "RH-304-0007-2", "RH-304-000701R59", "RH-304-0059", "RH-304-0016", "380064-1"].includes(composant.product.ref)
      );
      const crochetsMecanique = await fetchProduct("RH-304-0059");
      const visBoisMecanique = await fetchProduct("FA0127");
      filteredComposants.push(
        { product: crochetsMecanique, quantity: nbCrochet },
        { product: visBoisMecanique, quantity: nbCrochet * 2 }
      );
      break;
  
    case "Tuile plate":
      filteredComposants = updatedComposants.filter(composant =>
        !["FA0127", "RH-304-0007-2", "RH-304-000701R59", "RH-304-0059", "RH-304-0016", "380064-1"].includes(composant.product.ref)
      );
      const crochetsPlate = await fetchProduct("RH-304-0016");
      const visBoisPlate = await fetchProduct("FA0127");
      filteredComposants.push(
        { product: crochetsPlate, quantity: nbCrochet },
        { product: visBoisPlate, quantity: nbCrochet * 2 }
      );
      break;
  
    case "Bacs acier":
      filteredComposants = updatedComposants.filter(composant =>
        !["R59", "R59-01", "FA0127", "RH-304-0007-2", "RH-304-000701R59", "RH-304-0059", "RH-304-0016", "380064-1"].includes(composant.product.ref)
      );
      const nbMiniRail = ((kit.composants.find(composant => composant.ref === "R59")?.quantity || 0) / 2 + 1) * 2 * 2;
      const miniRail = await fetchProduct("RF-0125");
      const tirefondsBacAcier = await fetchProduct("380064-1");
      filteredComposants.push(
        { product: miniRail, quantity: nbMiniRail },
         //{ product: tirefondsBacAcier, quantity: nbCrochet } // Replace RH-304-0007-2 with 380064-1
        { product: tirefondsBacAcier, quantity: 0 }
      );
      break;
  
    case "Fibro ciment":
      filteredComposants = updatedComposants.filter(composant =>
        !["FA0127", "RH-304-0007-2", "RH-304-000701R59", "RH-304-0059", "RH-304-0016"].includes(composant.product.ref)
      );
      const tirefondsFibroCiment = await fetchProduct("380064-1");
      filteredComposants.push(
        { product: tirefondsFibroCiment, quantity: nbCrochet }
      );
      break;
  
    default:
      throw new Error(`Invalid option: ${option}`);
  }
  

  // Log the updated components for debugging
  console.log("Updated Components:", filteredComposants);

  // Recalculate the total price for the entire kit
  const totalPrice = filteredComposants.reduce((total, composant) => {
    if (!composant.product) {
      console.error(`Product is undefined for ref: ${composant.product.ref}`);
      return total;
    }
    if (typeof composant.product.cost !== 'number') {
      console.error(`Invalid cost for product: ${composant.product.ref}`);
      return total;
    }
    if (typeof composant.quantity !== 'number') {
      console.error(`Invalid quantity for product: ${composant.product.ref}`);
      return total;
    }
    return total + (composant.product.cost * composant.quantity);
  }, 0);

  // Transform the composants array to match the fetched data structure
  const transformedComposants = filteredComposants.map(composant => ({
    ...composant.product.toObject(), // Convert Mongoose document to plain object
    quantity: composant.quantity,
  }));

  // Create a new kit object with the updated components and total price
  const updatedKit = {
    ...kit.toObject(), // Convert Mongoose document to plain object
    composants: transformedComposants,
    totalPrice,
  };

  return updatedKit as PhotovoltaicKitDocument; // Cast to the correct type
}

// Default export for the API route
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const { kitName, option } = req.body;

      // Validate the request body
      if (!kitName || !option) {
        return res.status(400).json({ success: false, error: "kitName and option are required" });
      }

      // Recalculate the kit based on the option
      const updatedKit = await recalculateKitBasedOnOption(kitName, option);

      // Return the updated kit
      res.status(200).json({ success: true, data: updatedKit });
    } catch (error) {
      console.error('Error recalculating kit:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }
}