import { calculateComponentQuantities } from './kitUtils';
import { calculateKitPrices } from './priceUtils';

interface Product {
  _id: string;
  cost: number;
}

interface Kit {
  _id: string;
  name: string;
  composants: { _id: string }[];
  puissance: number;
  puissance_panneau: number;
  nb_panneaux_micro_onduleur: number;
}

export async function getKitsWithPricesAndQuantities(products: Product[], kits: Kit[]): Promise<{ kit: Kit, totalPrice: number, quantities: any, name: string, id: string }[]> {
  // Calculate prices for each kit
  const prices = calculateKitPrices(products, kits);
  // Calculate quantities for each kit
  const quantities = kits.map(kit => {
    return {
      kit,
      quantities: calculateComponentQuantities(kit)
    };
  });

  // Combine prices and quantities
  const kitsWithPricesAndQuantities = prices.map(price => {
    const kitWithQuantities = quantities.find(q => q.kit._id === price.kitId);
    if (!kitWithQuantities) {
      return null; // If kit with quantities is not found, return null
    }
    return {
      kit: kitWithQuantities.kit,
      name: kitWithQuantities.kit.name, 
      id: kitWithQuantities.kit._id,
      totalPrice: calculateKitTotalPrice(kitWithQuantities.kit, products),
      quantities: kitWithQuantities.quantities
    };
  }).filter(kit => kit !== null) as { kit: Kit, totalPrice: number, quantities: any, name: string, id: string }[];

  return kitsWithPricesAndQuantities;
}

// Function to calculate the total price of a kit

function calculateKitTotalPrice(kit: Kit | undefined, products: Product[]): number {
  if (!kit) {
    console.error('Kit is undefined or null:', kit);
    return 0; // Return 0 if kit is undefined or null
  }

  let totalPrice = 0;

  console.log("kit.kit", kit)

  // Iterate over each component in the kit and calculate the price
  kit?.composants.forEach(component => {
    if (component && component._id) {
      const product = products.find(p => p._id === component._id);
      if (product) {
        totalPrice += product.cost;
      }
    } else {
      console.error('Component or _id is undefined in kit:', kit);
    }
  });

  return totalPrice;
}
