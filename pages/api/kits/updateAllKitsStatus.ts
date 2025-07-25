import connectDB from "@/lib/db";
import PhotovoltaicKit from "@/models/PhotovoltaicKit";

// Function to update all kits status
export async function updateAllKitsStatus() {
  try {
    // Connect to the database
    await connectDB();

    // Update all kits to have the status "available"
    const result = await PhotovoltaicKit.updateMany(
      {}, // No filter to update all kits
      { $set: { status: "available" } } // Set status to "available"
    );

    console.log(`Successfully updated ${result.modifiedCount} kits to 'available'`);
    return {
      success: true,
      message: `Successfully updated ${result.modifiedCount} kits to 'available'`,
    };
  } catch (error) {
    console.error("Error updating kit statuses:", error);
    return {
      success: false,
      error: "Failed to update kits. See logs for details.",
    };
  }
}

// Default API handler function
export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // Call the function to update all kits' statuses
      const result = await updateAllKitsStatus();
      return res.status(200).json(result); // Send the result as JSON response
    } catch (error) {
      return res.status(500).json({ success: false, error: "Internal server error" });
    }
  } else {
    // Handle unsupported methods
    return res.status(405).json({ success: false, error: "Method Not Allowed" });
  }
}
