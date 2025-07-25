import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const getProductData = async (productNO: string) => {
    try {
        // Construct the file path for AllProducts.json
        const filePath = path.join(process.cwd(), 'savedProducts', 'AllProducts.json');
        // Read data from JSON file
        const jsonData = fs.readFileSync(filePath, 'utf-8');
        const allProducts = JSON.parse(jsonData);

        // Find the product by its product number
        const product = allProducts.find((product: any) => product.No === productNO);


        if (!product) {
            throw new Error('Product not found');
        }

        return product;
    } catch (error) {
        throw new Error(`Error reading JSON file: ${error.message}`);
    }
};

const getProductByNOEndpoint = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { productNO } = req.query;
        console.log("productNO", productNO)

        if (!productNO) {
            throw new Error('Product number parameter is required.');
        }

        const productData = await getProductData(productNO as string);

        res.status(200).json(productData);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(404).json({ error: error.message });
    }
};

export default getProductByNOEndpoint;
