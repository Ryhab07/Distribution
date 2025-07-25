import { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";
import connectDB from "@/lib/db";
import InterventionModel from "@/models/intervention";

// Helper function to format dates as "Day Mon DD YYYY"
function formatDate(dateStr: string): string | null {
  try {
    const date = new Date(dateStr);
    const options = {
      weekday: 'short', // e.g., "Fri"
      month: 'short',   // e.g., "Mar"
      day: '2-digit',   // e.g., "10"
      year: 'numeric',  // e.g., "2023"
    };
    // Format the date to match the format in the database
    //return date.toLocaleDateString('en-US', options).replace(/,/g, '') + ' 00:00:00 GMT+0100 (CET)';
    return date.toLocaleDateString('en-US', options).replace(/,/g, '') ;
  } catch (error) {
    return null;
  }
}



async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();
  console.log("Connected to MongoDB");

  const {
    page = 1,
    limit,
    createdAt,
    societe,
    marque,
    client,
    dateDinterventionPrevut,
    dateDeLaDemande,
    id,
  } = req.query;

  // Log all query parameters
  console.log("Query parameters:", { page, limit, createdAt, societe, marque, client, dateDinterventionPrevut, dateDeLaDemande, id });

  const filter: any = {};

  // Handle createdAt filter
  if (createdAt) {
    const [day, month, year] = (createdAt as string).split("/");
    const isoDate = `${year}-${month}-${day}T00:00:00.000Z`;
    const nextDay = new Date(isoDate);
    nextDay.setDate(nextDay.getDate() + 1);
    filter.created_at = {
      $gte: new Date(isoDate),
      $lt: nextDay,
    };
    console.log("Filter for created_at:", filter.created_at);
  }

  // Handle dateDeLaDemande filter
  if (dateDeLaDemande) {
    const [day, month, year] = (dateDeLaDemande as string).split("/");
    const isoDate = `${year}-${month}-${day}`;
    
    // Format the date to match the format in the database
    const formattedDate = formatDate(`${isoDate}T00:00:00Z`);
    console.log("formatDate", formattedDate)

    filter.dateDeLaDemande = { $regex: formattedDate };

    console.log("Filter for dateDeLaDemande:", filter.dateDeLaDemande);
  } else {
    console.log("dateDeLaDemande parameter is missing or empty.");
  }

  // Add other filters
  if (societe) filter.societe = societe;
  if (marque) filter.marque = marque;
  if (client) filter.client = client;
  if (dateDinterventionPrevut) filter.dateDinterventionPrevut = dateDinterventionPrevut;
  if (id) filter._id = new ObjectId(id as string);

  try {
    const query = InterventionModel.find(filter).skip((Number(page) - 1) * (Number(limit) || 0));

    if (limit) {
      query.limit(Number(limit));
    }

    const interventions = await query.exec();

    // Log the filter and results for debugging
    console.log("Filter applied:", filter);
    interventions.forEach(intervention => {
      console.log("Date from the database:", intervention.dateDeLaDemande);
    });

    const totalCount = await InterventionModel.countDocuments(filter).exec();

    res.status(200).json({
      interventions,
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
