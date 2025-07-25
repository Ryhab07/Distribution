const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

interface GetLastOrderResponse {}

export const getLastOrder = async (
  userId: string
): Promise<GetLastOrderResponse> => {
  try {
    const response = await fetch(
      `${apiUrl}/order/getLastOrder?userId=${userId}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch last order. Status: ${response.status}`);
    }

    const data: GetLastOrderResponse = await response.json();

    // Handle the response data as needed
    console.log("Last order fetched:", data);
    return data;
  } catch (error) {
    // Handle errors
    console.error("Error fetching last order:", error.message);
    throw error;
  }
};
