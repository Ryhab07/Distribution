import fs from 'fs';
import path from 'path';
import { NextApiResponse } from 'next';
import { NextApiRequest } from 'next';

interface TokenData {
    access_token: string;
    expires_in: number; // Token expiration time in seconds
}

interface ExtendedTokenData extends TokenData {
    expirationTime: number;
}

let tokenData: ExtendedTokenData | null = null;

const getToken = async () => {
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

        const tokenData = await response.json() as TokenData;
        console.log("token data: ", tokenData)
        const expiresIn = tokenData.expires_in || 3600; 
        const expirationTime = Date.now() + expiresIn * 1000; 
        return { ...tokenData, expirationTime };
    } catch (error) {
        console.error('Error fetching token:', error);
        throw new Error('Failed to fetch token');
    }
};

const fetchData = async (req?: NextApiRequest | null, res?: NextApiResponse | null) => {
    try {
        if (!tokenData || tokenData.expirationTime <= Date.now()) {
            tokenData = await getToken();
        }

        const { access_token } = tokenData!;

        const apiUrl = 'https://api.businesscentral.dynamics.com/v2.0/605e3e13-d9e7-4e42-8604-0ff9e3ab907a/Sandbox/ODataV4/Company(\'ECO%20NEGOCE\')/articlesListe';

        const response = await fetch(apiUrl, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });

        if (response.status === 401) {
            console.log("Data Fetched from source not successful ERROR 401")
            tokenData = await getToken();
            const { access_token } = tokenData!;
            const retryResponse = await fetch(apiUrl, {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            });

            if (!retryResponse.ok) {
                throw new Error(`Failed to fetch data from the API after token refresh. Status: ${retryResponse.status}`);
            }

            const data = await retryResponse.json();
            console.log("Data Fetched from source successfully")
            groupAndSaveData(data);
            if (res) {
                res.status(200).json({ message: "Data fetched and processed successfully" });
            }
        } else if (!response.ok) {
            throw new Error(`Failed to fetch data from the API. Status: ${response.status}`);
        } else {
            const data = await response.json();
            groupAndSaveData(data);
            if (res) {
                res.status(200).json({ message: "Data fetched and processed successfully" });
            }
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        throw new Error('Internal Server Error');
    }
};

const updateProducts = async (req?: NextApiRequest | null, res?: NextApiResponse | null) => {
    try {
        await fetchData(req, res);

        const logFileName = 'updateLog.txt';
        const logData = `Data Updated at ${new Date().toLocaleString()}\n`;
        const logInfo = 'Updated files: AllProducts.json, groupedProducts.json, groupedCategories.json\n';
        fs.appendFileSync(path.join('savedProducts', logFileName), logData);
        fs.appendFileSync(path.join('savedProducts', logFileName), logInfo);

        console.log("Data fetched and processed successfully");
        return { message: "Data fetched and processed successfully" };
    } catch (error) {
        console.error('Error updating products:', error);
        throw new Error('Internal Server Error');
    }
};

const groupAndSaveData = (data: any) => {
    const groupedProducts = groupProducts(data.value);
    const groupedCategories = extractCategories(data.value);
    const allProductsFileName = 'AllProducts.json';
    const groupedProductsFileName = 'groupedProducts.json';
    const groupedCategoriesFileName = 'groupedCategories.json';

    const totalProductsCount = data.value.length;

    data.totalProductsCount = totalProductsCount;

    fs.writeFileSync(path.join('savedProducts', allProductsFileName), JSON.stringify(data.value, null, 2));
    console.log("finished writing allProductsFileName")

    fs.writeFileSync(path.join('savedProducts', groupedProductsFileName), JSON.stringify(groupedProducts, null, 2));
    console.log("finished writing groupedProductsFileName")

    fs.writeFileSync(path.join('savedProducts', groupedCategoriesFileName), JSON.stringify(groupedCategories, null, 2));
    console.log("finished writing groupedCategoriesFileName")

    Object.keys(groupedProducts).forEach((parentCategory) => {
        Object.keys(groupedProducts[parentCategory]).forEach((subcategory) => {
            const subcategoryFileName = `${subcategory}_Products.json`;
            const productsInSubcategory = groupedProducts[parentCategory][subcategory];

            const itemCount = productsInSubcategory.length;

            const productsWithCount = {
                itemCount,
                products: productsInSubcategory
            };

            fs.writeFileSync(path.join('savedProducts', subcategoryFileName), JSON.stringify(productsWithCount, null, 2));
        });
    });

    console.log("Save each subcategory (Item_Category_Code) to a separate JSON file");
};

const groupProducts = (products: any[]) => {
    const groupedProducts: Record<string, Record<string, any[]>> = {};

    products.forEach((product) => {
        const { Parent_Category, Item_Category_Code } = product;

        if (!groupedProducts[Parent_Category]) {
            groupedProducts[Parent_Category] = {};
        }

        if (!groupedProducts[Parent_Category][Item_Category_Code]) {
            groupedProducts[Parent_Category][Item_Category_Code] = [];
        }

        groupedProducts[Parent_Category][Item_Category_Code].push(product);
    });

    return groupedProducts;
};

const extractCategories = (products: any[]) => {
    const groupedCategories: Record<string, string[]> = {};

    products.forEach((product) => {
        const { Parent_Category, Item_Category_Code } = product;

        if (!groupedCategories[Parent_Category]) {
            groupedCategories[Parent_Category] = [];
        }

        if (!groupedCategories[Parent_Category].includes(Item_Category_Code)) {
            groupedCategories[Parent_Category].push(Item_Category_Code);
        }
    });

    return groupedCategories;
};

updateProducts();

setInterval(updateProducts, 2 * 60 * 60 * 1000); // Repeat every 2 hours

export default fetchData;
