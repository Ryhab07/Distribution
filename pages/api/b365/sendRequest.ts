const sendRequest = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/b365/fetchProductsToJson`);
      console.log("fired the /d365/fetchProductsToJson")
      if (response.ok) {
        const data = await response.json();
        console.log('Request successful:', data);
      } else {
        console.error('Failed to send request:', response.status);
      }
    } catch (error) {
      console.error('Error sending request:', error);
    }
  };
  
  export default sendRequest;