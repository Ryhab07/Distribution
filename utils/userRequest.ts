const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export const getUserInfo = async () => {
    try {
      // Retrieve userId from sessionStorage or cookies
      const userId = sessionStorage.getItem('id') || getCookie('id');
  
      if (!userId) {
        throw new Error('Identifiant d\'utilisateur non trouvé.');
      }
  
      const response = await fetch(`${apiUrl}/admin/user-info/${userId}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération des informations utilisateur:', error);
      throw new Error('Erreur lors de la récupération des informations utilisateur.');
    }
  };
  
  // Helper function to get a cookie value
  const getCookie = (name: string) => {
    const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
    return match ? match[2] : null;
  };
  