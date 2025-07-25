import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
  id: string;
  name: string;
  ref?: string;
  price: number;
  stock: number;
  image: string;
  quantity: number;
  typeStock: string;
  option1: string | null;
  option2: string | null;
  sales: number;
  composants?: any[];
  puissance?: string | null;
  kitPuissance?: number;
  installateur?: string;
  chantier?: string;
  desc?: string;
  creatorID?: string;
}

export interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: (() => {
    if (typeof window !== "undefined") {
      try {
        return JSON.parse(localStorage.getItem("cartItems") || "[]");
      } catch (error) {
        return [];
      }
    }
    return [];
  })(),
};

export const calculateItemTotal = (item: CartItem): number => {
  return item.quantity * item.price;
};

export const calculateOverallTotal = (items: CartItem[]): number => {
  const itemsTotal = items.reduce(
    (total, item) => total + calculateItemTotal(item),
    0
  );

  const taxRate = 0.2; // Example tax rate
  const salesPercentage = parseFloat(sessionStorage.getItem("sales") || "0");
  const sales = (itemsTotal * salesPercentage) / 100
  const tax = (itemsTotal - sales) * taxRate;
  const itemTotalPostSales = itemsTotal - sales
  return itemTotalPostSales + tax;
};


export const calculateTax = (items: CartItem[]): number => {
  const itemsTotal = items.reduce(
    (total, item) => total + calculateItemTotal(item),
    0
  );

  console.log("itemsTotal", itemsTotal)

  const taxRate = 0.2;
  return itemsTotal + taxRate;
}

export const calculateOverallTotalPreTax = (items: CartItem[]): number => {
  const itemsTotal = items.reduce(
    (total, item) => total + calculateItemTotal(item),
    0
  );
  return itemsTotal;
};

export const calculateSalesForItem = (item: CartItem): number => {
  const salesPercentage = parseFloat(sessionStorage.getItem("sales") || "0");
  return (item.price * item.quantity * salesPercentage) / 100;
};

export const calculateSalesForItem375 = (item: CartItem): number => {
  const salesPercentage = parseFloat(sessionStorage.getItem("sales375") || "0");


  const sales = (item.price * item.quantity * salesPercentage);

  const kitPuissance = item.kitPuissance || "0"; 

  return kitPuissance === 375 ? sales : 0;
};


export const calculateSalesForItem500 = (item: CartItem): number => {
  const salesPercentage = parseFloat(sessionStorage.getItem("sales500") || "0");
  console.log("salesPercentage 500", salesPercentage)

  const sales = (item.price * item.quantity * salesPercentage);
  console.log("Sales for item 500:", sales);
  

  const kitPuissance = item.kitPuissance || "0";

  return kitPuissance === 500 ? sales : 0;
};


const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const { id, name, quantity, price, stock, desc, image, typeStock, option1, option2, puissance, installateur, chantier, ref, creatorID } = action.payload;
      const existingItem = state.items.find((item) => item.id === id);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        const sales = calculateSalesForItem(action.payload);

        state.items.push({ id, name, quantity, price, stock, desc, image, typeStock, option1, option2, sales, puissance, installateur, chantier, ref, creatorID });
      }

      localStorage.setItem("cartItems", JSON.stringify(state.items));
    },


    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      localStorage.setItem("cartItems", JSON.stringify(state.items));
    },

    
    /*increaseQuantity: (state, action: PayloadAction<string>) => {
      const item = state.items.find((item) => item.id === action.payload);
      if (item) {
        item.quantity += 1;
      }
      localStorage.setItem("cartItems", JSON.stringify(state.items));
    },*/

    increaseQuantity: (state, action: PayloadAction<string>) => {
      const itemId = action.payload;
      const itemIndex = state.items.findIndex((item) => item.id === itemId);
      
      if (itemIndex !== -1) {
        const item = state.items[itemIndex];
        //const initialKitQuantity = 1; // Initial quantity of the kit
        const newKitQuantity = item.quantity + 1; 
        //const kitQuantityIncrease = newKitQuantity / initialKitQuantity; // Increase in kit quantity
    
        item.quantity = newKitQuantity;
    
        // If the item is a kit, update the quantities of its components
        if (item.composants) {
          item.composants.forEach((composant) => {
            if (!composant.initialQuantity) {
              // Store the initial quantity when the kit quantity is 1
              composant.initialQuantity = composant.quantity;
            }
            // Update the composant quantity based on the initial quantity and new kit quantity
            composant.quantity = composant.initialQuantity * newKitQuantity;
          });
        }
        
        // Update the state with the modified item
        state.items[itemIndex] = item;
        
        // Update localStorage
        localStorage.setItem("cartItems", JSON.stringify(state.items));
      }
    },
    
    decreaseQuantity: (state, action: PayloadAction<string>) => {
      const itemId = action.payload;
      const itemIndex = state.items.findIndex((item) => item.id === itemId);
      
      if (itemIndex !== -1) {
        const item = state.items[itemIndex];
        //const initialKitQuantity = 1; // Initial quantity of the kit
        const newKitQuantity = item.quantity - 1; // Increase the kit quantity by 1
        //const kitQuantityIncrease = newKitQuantity / initialKitQuantity; // Increase in kit quantity
    
        item.quantity = newKitQuantity;
        console.log("item.quantity ", item.quantity)
    
        // If the item is a kit, update the quantities of its components
        if (item.composants) {
          item.composants.forEach((composant) => {
            if (!composant.initialQuantity) {
              // Store the initial quantity when the kit quantity is 1
              composant.initialQuantity = composant.quantity;
            }
            // Update the composant quantity based on the initial quantity and new kit quantity
            composant.quantity = composant.initialQuantity / newKitQuantity;
          });
        }
        
        // Update the state with the modified item
        state.items[itemIndex] = item;
        
        // Update localStorage
        localStorage.setItem("cartItems", JSON.stringify(state.items));
      }
    },
    
    
    
    
    
    /*decreaseQuantity: (state, action: PayloadAction<string>) => {
      const item = state.items.find((item) => item.id === action.payload);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      }
      localStorage.setItem("cartItems", JSON.stringify(state.items));
    },*/

    
    removeAllItems: (state) => {
      state.items = [];
      localStorage.removeItem("cartItems");
    },


addKitToCart: (state, action: PayloadAction<{ desc: string, ref: string; installateur: string; chantier: string; kitPuissance: number; kitName: string; totalPrice: number; quantity: number; composants: any[]; id: string; image: string; option1: string; option2: string; creatorID: string; }>) => {
  const { desc, ref, kitName, totalPrice, quantity, composants, id, image, option1, option2, kitPuissance, installateur, chantier, creatorID } = action.payload;
  console.log("action.payload", action.payload);
  const existingItem = state.items.find((item) => item.id === kitName);
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    state.items.push({ 
      id: id, 
      name: kitName, 
      quantity: quantity, 
      price: totalPrice, 
      stock: 0, 
      image: image, 
      desc: desc, 
      typeStock: "", 
      option1: option1, 
      option2: option2, 
      sales: 0,
      composants: composants,
      kitPuissance: kitPuissance,
      installateur: installateur,
      chantier: chantier,
      ref: ref,
      creatorID: creatorID,

    });
    localStorage.setItem("cartItems", JSON.stringify(state.items));
  }
}
    
  },
});

export const {
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  removeAllItems,
  addKitToCart,
} = cartSlice.actions;

export default cartSlice.reducer;
