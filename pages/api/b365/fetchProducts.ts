// Import necessary modules
import { NextApiRequest, NextApiResponse } from 'next';

// Define cache to store fetched products
let productsCache: any[] = [];

// Function to fetch all products
const fetchAllProducts = async (req?: NextApiRequest, res?: NextApiResponse) => {
  const authToken = `eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6ImtXYmthYTZxczh3c1RuQndpaU5ZT2hIYm5BdyIsImtpZCI6ImtXYmthYTZxczh3c1RuQndpaU5ZT2hIYm5BdyJ9.eyJhdWQiOiJodHRwczovL2FwaS5idXNpbmVzc2NlbnRyYWwuZHluYW1pY3MuY29tIiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvNjA1ZTNlMTMtZDllNy00ZTQyLTg2MDQtMGZmOWUzYWI5MDdhLyIsImlhdCI6MTcwNzIyMDQ0OSwibmJmIjoxNzA3MjIwNDQ5LCJleHAiOjE3MDcyMjQzNDksImFpbyI6IkUyVmdZRmg1NDhlR3YrZkYzekUwLzdlclU5MVRDZ0E9IiwiYXBwaWQiOiI2ZmE1MTA0YS0zNjhmLTQ1ODgtYmY5Zi0wZTg3YTU0ZTNjNmIiLCJhcHBpZGFjciI6IjEiLCJpZHAiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC82MDVlM2UxMy1kOWU3LTRlNDItODYwNC0wZmY5ZTNhYjkwN2EvIiwiaWR0eXAiOiJhcHAiLCJvaWQiOiI3YjA2MDNmMC1kYmJiLTQ4ZDctOGRhZS05NmJhYzhmZDdiYWIiLCJyaCI6IjAuQVhrQUV6NWVZT2ZaUWs2R0JBXzU0NnVRZWozdmJabHNzMU5CaGdlbV9Ud0J1Sjk1QUFBLiIsInJvbGVzIjpbIkF1dG9tYXRpb24uUmVhZFdyaXRlLkFsbCIsImFwcF9hY2Nlc3MiLCJBZG1pbkNlbnRlci5SZWFkV3JpdGUuQWxsIiwiQVBJLlJlYWRXcml0ZS5BbGwiXSwic3ViIjoiN2IwNjAzZjAtZGJiYi00OGQ3LThkYWUtOTZiYWM4ZmQ3YmFiIiwidGlkIjoiNjA1ZTNlMTMtZDllNy00ZTQyLTg2MDQtMGZmOWUzYWI5MDdhIiwidXRpIjoiWXV5MFdUVnBnMFdqWEN1dzBsd2RBQSIsInZlciI6IjEuMCJ9.MNbVsI5XR5D6ll_LRGgxJ6i4DRxnAykv6rWCasakdNRYLlW165IoKuTa-w8KEN6BvZxW5Kv2xULnAzXCufAm1CyoogvykrbMrzApP5zrRsX60frY8ArsDT9H0I3_qqmvk1PtoVB6w47_39QaSndSrYO-KcOPu1bi5Oiw095CDL7lNRV_Yif2_MO3br8KWRWH50LCtrXVW4ivgz2ohc_LjBH9DvURPknp5EtD9iPJXdjCc8zE2Bqyv07Dt0li5Gw_qOelADnkcu5HHNyFJ9BAuBR7LxV0IM_YQEd-na3seFC_OkVA_VUBXJ-KuvDbEek-w5pg37xCK3iB7dFyB2R3YA`; // Replace with your actual auth token
  const apiUrl = 'https://api.businesscentral.dynamics.com/v2.0/605e3e13-d9e7-4e42-8604-0ff9e3ab907a/Sandbox/ODataV4/Company(\'ECO%20NEGOCE\')/articlesListe';

  try {
    // Check if products are already in cache
    if (!Array.isArray(productsCache) || productsCache.length === 0) {
      // Fetch data from the API
      const response = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      // Check if the request was successful
      if (!response.ok) {
        throw new Error(`Failed to fetch data from the API. Status: ${response.status}`);
      }

      // Parse the JSON response and update the cache
      const fetchedData = await response.json();

      // Ensure fetchedData has a 'value' property containing an array
      if (!fetchedData || !fetchedData.value || !Array.isArray(fetchedData.value)) {
        throw new Error('Fetched data format is not as expected.');
      }

      productsCache = fetchedData.value;
    }

    // Process the data as needed (pagination logic)
    const pageSize: number = (req && req.query.pageSize) ? parseInt(req.query.pageSize as string, 10) : 1000; 
    const page: number = (req && req.query.page) ? parseInt(req.query.page as string, 10) : 1; 

    const startIndex: number = (page - 1) * pageSize;
    const endIndex: number = startIndex + pageSize;

    // Log cache information
    console.log('Cache length:', productsCache.length);
    console.log('startIndex:', startIndex, 'endIndex:', endIndex);

    const paginatedProducts = productsCache.slice(startIndex, endIndex);

    // If res is provided, return the paginated products as JSON
    if (res) {
      res.status(200).json({ products: paginatedProducts });
    }

    // If res is not provided, return the paginated products
    return paginatedProducts;
  } catch (error) {
    console.error('Error fetching data:', error.message);

    // If res is provided, return an error response
    if (res) {
      res.status(500).json({ error: 'Internal Server Error' });
    }

    // If res is not provided, throw the error
    throw error;
  }
};

export default fetchAllProducts;
