export const getUserInfoCommande = async (userId: string) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
      const response = await fetch(`${apiUrl}/admin/user-info/${userId}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error retrieving user info:", error);
      return null; // Return null if an error occurs
    }
  };
  