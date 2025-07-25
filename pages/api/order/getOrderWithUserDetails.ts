import OrderModel from "@/models/order";
import UserModel from "@/models/user";

// Fetch orders and replace userId/createdBy with user details
async function getOrdersWithUserDetails() {
  try {
    // Step 1: Get all orders
    const orders = await OrderModel.find({}).lean();

    // Step 2: Extract unique user IDs
    const userIds = [
      ...new Set(orders.flatMap(order => [order.userId, order.createdBy])),
    ];

    // Step 3: Fetch user details by unique IDs
    const users = await UserModel.find({ _id: { $in: userIds } })
      .select("name lastname")
      .lean();

    // Step 4: Map user details by ID, with fallback for missing name or lastname
    const userMap = users.reduce((acc, user) => {
      acc[user._id.toString()] = {
        name: user.name ?? "Unknown Name", // Default if name is missing
        lastname: user.lastname ?? "Unknown Lastname", // Default if lastname is missing
      };
      return acc;
    }, {} as Record<string, { name: string; lastname: string }>);

    // Step 5: Replace userId and createdBy in orders
    const formattedOrders = orders.map(order => ({
      ...order,
      userId: userMap[order.userId?.toString()] || null,
      createdBy: userMap[order.createdBy?.toString()] || null,
    }));

    return formattedOrders;
  } catch (error) {
    console.error("Error fetching orders with user details:", error);
    throw error;
  }
}

// Example API call to use the function (avoids unused-variable warning)
async function fetchOrders() {
  try {
    const ordersWithDetails = await getOrdersWithUserDetails();
    console.log(ordersWithDetails);
    // If this is an API route, you'd return or send the response here
  } catch (error) {
    console.error("Error in fetchOrders:", error);
  }
}

fetchOrders();
