// utils/priceUtils.ts

import { calculateComponentQuantities } from './kitUtils';

// Define a type for products
interface Product {
  _id: string;
  cost: number;
}

// Implement the function to find product cost by ID
function findProductCostById(productId: string, products: Product[]): number {
  const product = products.find(product => product._id === productId);
  return product ? product.cost : 0; 
}

// Define the function to calculate kit prices
export function calculateKitPrices(products: Product[], kits): { kitId: string, totalPrice: number }[] {
  return kits.map(kit => {
    console.log("Kit:", kit.name); // Log the kit object
    console.log("Composants:", kit.composants); // Log the composants array
    const quantities = calculateComponentQuantities(kit);
    let totalCost = 0;
  
    if (kit.composants) { // Check if kit.composants is not null or undefined
      kit.composants.forEach(component => {
        console.log(`component._id: ${component._id}, component._name: ${component.name}`)
        if (component._id) {
          const componentCost = findProductCostById(component._id, products);
          const quantity = quantities[component._id] || 0; 
          totalCost += componentCost * quantity;
        } else {
          console.error('Component _id is undefined or null:', component);
        }
      });
    } else {
      console.error('Composants array is undefined or null in kit:', kit);
    }
  
    return {
      kitId: kit._id,
      totalPrice: totalCost
    };
  });
}
