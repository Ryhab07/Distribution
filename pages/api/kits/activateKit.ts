import { NextApiRequest, NextApiResponse } from "next";
import connectDB from "@/lib/db";
import PhotovoltaicKit from "@/models/PhotovoltaicKit";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  // Get kitId from the query string, not the body
  const { kitId } = req.query;

  try {
    switch (req.method) {
      case "PATCH":
        if (req.query.action === "activate") {
          // Activate kit
          const activatedKit = await PhotovoltaicKit.findByIdAndUpdate(
            kitId,
            { status: "available" },
            { new: true }
          );

          if (!activatedKit) {
            return res.status(404).json({ success: false, error: "Kit not found" });
          }

          return res.status(200).json({ success: true, data: activatedKit });
        } else if (req.query.action === "deactivate") {
          // Deactivate kit
          const deactivatedKit = await PhotovoltaicKit.findByIdAndUpdate(
            kitId,
            { status: "unavailable" },
            { new: true }
          );

          if (!deactivatedKit) {
            return res.status(404).json({ success: false, error: "Kit not found" });
          }

          return res.status(200).json({ success: true, data: deactivatedKit });
        }
        break;

      case "DELETE":
        // Delete kit
        const deletedKit = await PhotovoltaicKit.findByIdAndDelete(kitId);

        if (!deletedKit) {
          return res.status(404).json({ success: false, error: "Kit not found" });
        }

        return res.status(200).json({ success: true, message: "Kit deleted successfully" });

      default:
        return res.status(405).json({ success: false, error: "Method Not Allowed" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
}

export default handler;
