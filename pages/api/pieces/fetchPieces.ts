import { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb"; // Correctly import ObjectId
import connectDB from "@/lib/db";
import PieceModel from "@/models/piece";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Connect to MongoDB using the db.ts file
  await connectDB();

  const { page = 1, limit, createdAt, societe, marque, numeroCommande, serieNumber, reference, id } = req.query;

  console.log("reference", reference)

  // Construct the filter object based on provided query parameters
  const filter: any = {};
  if (createdAt) {
    // Convert dd/mm/yyyy to yyyy-mm-dd format
    const [day, month, year] = (createdAt as string).split('/');
    const isoDate = `${year}-${month}-${day}T00:00:00.000Z`;
    const nextDay = new Date(isoDate);
    nextDay.setDate(nextDay.getDate() + 1); // Increment to the next day
    filter.created_at = {
      $gte: new Date(isoDate), // Greater than or equal to the provided date
      $lt: nextDay, // Less than the next day
    };
    console.log("Filter for created_at:", filter.created_at);
  }
  
  if (societe) filter.societe = societe;
  if (marque) filter.marque = marque;
  if (numeroCommande) filter.numeroCommande = numeroCommande;
  if (serieNumber) filter.serieNumber = serieNumber;
  if (reference) filter.reference = reference;
  if (id) filter._id = new ObjectId(id as string);

  try {
    const query = PieceModel.find(filter)
      .skip((Number(page) - 1) * (Number(limit) || 0));

    if (limit) {
      query.limit(Number(limit));
    }

    const pieces = await query.exec();

    const totalCount = await PieceModel.countDocuments(filter).exec();

    res.status(200).json({
      pieces,
      totalCount,
      totalPages: limit ? Math.ceil(totalCount / Number(limit)) : 1,
      currentPage: Number(page),
    });
  } catch (error) {
    console.error("Error fetching pieces:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export default handler;