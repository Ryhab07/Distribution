import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const getCategoryData = async (category: string, page: number, limit: number) => {
    try {
        // Construct the file path based on the category
        const filePath = path.join(process.cwd(), 'savedProducts', `${category}_Products.json`);
        // Read data from JSON file
        const jsonData = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(jsonData);

        // Check if 'products' property exists and is an array
        if (!Array.isArray(data.products)) {
            throw new Error('Products data is not in the expected format.');
        }

        // Extract the products array
        const products = data.products;

        // Pagination logic
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const paginatedProducts = products.slice(startIndex, endIndex);

        // Construct response object with paginated products and itemCount
        const responseData = {
            itemCount: data.itemCount,
            products: paginatedProducts
        };

        return responseData;
    } catch (error) {
        throw new Error(`Error reading JSON file: ${error.message}`);
    }
};




const createCategoryEndpoint = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { category, page , limit } = req.query;

        if (!category) {
            throw new Error('Category parameter is required.');
        }

        const data = await getCategoryData(category as string, parseInt(page as string), parseInt(limit as string));

        if (!data) {
            return res.status(404).json({ error: 'Category data not found' });
        }

        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export default createCategoryEndpoint;
