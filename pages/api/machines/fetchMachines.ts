import { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";
import connectDB from "@/lib/db";
import SavMachineModel from "@/models/machine";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Connect to MongoDB
  await connectDB();

  // Extract query parameters
  const {
    page = 1,
    limit,
    createdAt,
    installateur,
    marque,
    serieNumber,
    id,
    categorieArticle,
  } = req.query;

  // Construct the filter object
  const filter: any = {};

  // Filter by created_at
  if (createdAt) {
    const [day, month, year] = (createdAt as string).split("/");
    
    // Create a string in the format of the desired date string (e.g., "Mon Dec 16 2024")
    const dateObj = new Date(Number(year), Number(month) - 1, Number(day));
    const dateString = dateObj.toDateString(); // "Mon Dec 16 2024"
  
    // Create a regex pattern to match dates starting with "Mon Dec 16 2024"
    const regexPattern = `^${dateString}`;
  
    // Use regex to filter created_at based on the pattern
    filter.created_at = {
      $regex: regexPattern, // Match the start of the created_at string with the pattern
    };
  
    console.log("Filter for created_at:", filter.created_at);
  }

  // Add filters for other parameters
  if (installateur) filter.installateur = installateur;
  if (marque) filter.marque = marque;
  if (serieNumber) filter.serieNumber = serieNumber;
  if (categorieArticle) filter.categorieArticle = categorieArticle;
  if (id) filter._id = new ObjectId(id as string);

  try {
    // Query the database
    const query = SavMachineModel.find(filter).skip(
      (Number(page) - 1) * (Number(limit) || 0)
    );

    // Apply limit if provided
    if (limit) {
      query.limit(Number(limit));
    }

    // Execute query
    const pieces = await query.exec();

    // Get the total count of documents
    const totalCount = await SavMachineModel.countDocuments(filter).exec();

    // Debugging: log retrieved records and filter
    console.log("Retrieved records:", pieces);
    console.log("Constructed filter:", filter);

    // Send response
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
