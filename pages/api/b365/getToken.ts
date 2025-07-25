import { NextApiResponse } from 'next';

const getToken = async (res: NextApiResponse) => {
  try {
    const url = process.env.MICROSOFT_AUTH_URL;
    const clientId = process.env.MICROSOFT_CLIENT_ID;
    const clientSecret = process.env.MICROSOFT_CLIENT_SECRET;
    const grantType = process.env.MICROSOFT_GRANT_TYPE;
    const scope = process.env.MICROSOFT_SCOPE;

    if (!url || !clientId || !clientSecret || !grantType || !scope) {
      throw new Error('Environment variables are not defined');
    }

    const formData = new URLSearchParams();
    formData.append('client_id', clientId);
    formData.append('client_secret', clientSecret);
    formData.append('grant_type', grantType);
    formData.append('scope', scope);

    const response = await fetch(url, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch token. Status: ${response.status}`);
    }

    const tokenData = await response.json();
    console.log("tokenData", tokenData);
    res.status(200).json(tokenData); // Send the token data as a response
  } catch (error) {
    console.error('Error fetching token:', error);
    res.status(500).json({ error: 'Failed to fetch token' }); // Send an error response
  }
};

export default getToken;
