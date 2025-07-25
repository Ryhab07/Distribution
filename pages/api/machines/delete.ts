import { NextApiRequest, NextApiResponse } from "next";
import connectDB from "@/lib/db";
import SavMachineModel from "@/models/machine";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Connect to MongoDB using the db.ts file
  await connectDB();

  if (req.method === "DELETE") {
    try {
      const { _id } = req.body; // Extract _id from request body

      // Implement deletion logic
      const deletedPiece = await SavMachineModel.findByIdAndDelete(_id);

      if (!deletedPiece) {
        return res.status(404).json({ error: "Piece not found" });
      }

      res.status(200).json({ success: "Piece deleted successfully" });
    } catch (error) {
      console.error("Error deleting piece:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    // Response for other than DELETE method
    res.status(405).json({ error: "Method Not Allowed" });
  }
}

export default handler;
