const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

interface RequestOptions {
  method?: string;
  body?: any;
  headers?: Record<string, string>;
}

interface RequestResult {
  data: any;
  redirectTo?: string;
}


async function request(
  /**
   * Makes an API request using the fetch function.
   *
   * @param {NextRouter} router - The Next.js router object.
   * @param {string} endpoint - The API endpoint to make the request to.
   * @param {RequestOptions} options - Optional request options such as method, body, and headers.
   * @param {string} redirectPropName - Optional prop name for redirection link.
   * @returns {Promise<RequestResult>} - A promise that resolves to the request result, including the response data and optional redirection link.
   * @throws {Error} - If there is an HTTP error or an error occurs during the request.
   */

  /**
   * Effectue une requête API en utilisant la fonction fetch.
   *
   * @param {NextRouter} router - L'objet router de Next.js.
   * @param {string} endpoint - L'endpoint de l'API vers lequel effectuer la requête.
   * @param {RequestOptions} options - Options facultatives de la requête telles que la méthode, le corps et les en-têtes.
   * @param {string} redirectPropName - Nom facultatif de la propriété pour le lien de redirection.
   * @returns {Promise<RequestResult>} - Une promesse qui se résout avec le résultat de la requête, comprenant les données de la réponse et éventuellement un lien de redirection.
   * @throws {Error} - Si une erreur HTTP se produit ou une erreur survient pendant la requête.
   */

  endpoint: string,
  options: RequestOptions = {},
  redirectPropName?: string
): Promise<RequestResult> {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  try {
    const response = await fetch(`${apiUrl}/${endpoint}`, {
      method: options.method || "GET",
      body: options.body ? JSON.stringify(options.body) : undefined,
      headers,
    });

    if (!response.ok) {
      let redirectTo: string | undefined;

      if (response.status === 401) {
        redirectTo = '/connexion';
      } else if (response.status === 403) {
        redirectTo = "/forbidden";
      } else if (response.status === 404) {
        redirectTo = "/not-found";
      } else if (response.status === 500) {
        redirectTo = "/server-error";
      } else {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }


      // Return the redirection information
      return {
        data: null,
        redirectTo,
      };
    }

    const data = await response.json();
    window.location.href = `${redirectPropName}`;

    // Return the data without handling redirection here
    return {
      data,
    };
  } catch (error) {
    console.error("API Request Error:", error.message);
    throw error;
  }
}

export { request };