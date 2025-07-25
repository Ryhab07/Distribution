import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/db';
import { z } from 'zod';
import mongoose from 'mongoose';
import PhotovoltaicKit from '@/models/PhotovoltaicKit';
import { calculateComposants } from '@/utils/calculateComposants';

// Updated Zod schema to handle arrays for all fields
const schema = z.object({
  brand: z.array(z.string()).min(1, "Please select at least one brand"),
  powerKit: z.array(z.string()).min(1, "Please select at least one power kit"),
  panelPower: z.array(z.string()).min(1, "Please select at least one panel power"),
  panelsPerInverter: z.array(z.string()).min(1, "Please select at least one number of panels per inverter"),
  powerType: z.array(z.string()).min(1, "Please select at least one power type"),
  panelOrientation: z.array(z.string()).min(1, "Please select at least one panel orientation"),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      // Validate the request body
      const validatedData = schema.parse(req.body);

      // Connect to MongoDB using Mongoose
      await connectDB();

      const createdOrUpdatedKits = [];

      // Loop through each combination of selected values
      for (const brand of validatedData.brand) {
        for (const powerKit of validatedData.powerKit) {
          for (const panelPower of validatedData.panelPower) {
            for (const panelsPerInverter of validatedData.panelsPerInverter) {
              for (const powerType of validatedData.powerType) {
                for (const panelOrientation of validatedData.panelOrientation) {
                  const formattedBrand = brand.toUpperCase();

                  const name = `Kit Photovoltaïque ${brand} ${parseInt(powerKit) / 1000}Kwc – ${powerType} - P${panelPower} - ${panelOrientation} - 1Mo/${panelsPerInverter}P`;
                  const description = `Pour une installation d’un kit ${brand} de ${parseInt(powerKit) / 1000}kWc ${powerType}, avec des panneaux de ${panelPower}Wc en ${panelOrientation}, sur deux lignes avec 1 micro-onduleur pour ${panelsPerInverter} panneau(x).`;

                  let composants;
                  try {
                    composants = await calculateComposants(
                      formattedBrand,
                      powerKit,
                      panelPower,
                      panelsPerInverter,
                      powerType,
                      panelOrientation
                    );
                  } catch (error) {
                    console.error('Error calculating components:', error);
                    return res.status(500).json({ success: false, error: 'Failed to calculate components' });
                  }

                  const totalPrice = composants.reduce((total, composant) => {
                    return total + (composant.product.cost * composant.quantity);
                  }, 0);

                  const transformedComposants = composants.map(composant => ({
                    _id: composant.product._id,
                    name: composant.product.name,
                    stock_reel: composant.product.stock_reel,
                    stock: composant.product.stock,
                    cost: composant.product.cost,
                    use: composant.product.use,
                    image: composant.product.image,
                    ref: composant.product.ref,
                    cat: composant.product.cat,
                    oldname: composant.product.oldname,
                    status: composant.product.status,
                    quantity: composant.quantity,
                  }));

                  const allItemsAvailable = transformedComposants.every(item => item.quantity !== 0);
                  const status = allItemsAvailable ? 'available' : 'unavailable';

                  const existingKit = await PhotovoltaicKit.findOne({ name });

                  if (existingKit) {
                    existingKit.type_alim_elec = powerType;
                    existingKit.puissance = parseInt(powerKit);
                    existingKit.puissance_panneau = parseInt(panelPower);
                    existingKit.nb_panneaux_micro_onduleur = parseInt(panelsPerInverter);
                    existingKit.description = description;
                    existingKit.totalPrice = totalPrice;
                    existingKit.composants = transformedComposants;
                    existingKit.status = status;

                    const updatedKit = await existingKit.save();
                    createdOrUpdatedKits.push(updatedKit);
                    console.log("Updated existing kit:", updatedKit);
                  } else {
                    const newKit = new PhotovoltaicKit({
                      _id: new mongoose.Types.ObjectId().toString(),
                      name,
                      type_alim_elec: powerType,
                      puissance: parseInt(powerKit),
                      puissance_panneau: parseInt(panelPower),
                      nb_panneaux_micro_onduleur: parseInt(panelsPerInverter),
                      description,
                      totalPrice,
                      composants: transformedComposants,
                      status,
                    });

                    const savedKit = await newKit.save();
                    createdOrUpdatedKits.push(savedKit);
                    console.log("Created new kit:", savedKit);
                  }
                }
              }
            }
          }
        }
      }

      res.status(200).json({ success: true, data: createdOrUpdatedKits });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, error: error.errors });
      } else {
        console.error('Error submitting form:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
      }
    }
  } else {
    res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }
}
