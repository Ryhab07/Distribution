// api.ts
const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

interface CreateOrderRequest {
  installateur: string;
  refChantier: string;
  userId: string;
  composer: boolean;
  createdBy: string;
}

interface CreateOrderResponse {

}

export const createOrder = async (
  { installateur, refChantier, userId, composer, createdBy }: CreateOrderRequest
): Promise<CreateOrderResponse> => {
  try {
    // Log the body content before sending the request
    console.log('Request Body:', {
      installateur,
      refChantier,
      userId,
      composer,
      createdBy
    });

    const response = await fetch(`${apiUrl}/order/createOrder`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      
      body: JSON.stringify({
        installateur,
        refChantier,
        userId,
        composer,
        createdBy
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to create order. Status: ${response.status}`);
    }

    const data: CreateOrderResponse = await response.json();

    // Handle the response data as needed
    console.log('Order created:', data);
    return data;
  } catch (error) {
    // Handle errors
    console.error('Error creating order:', error.message);
    throw error;
  }
};

