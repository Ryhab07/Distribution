'use client'
import { CartItem } from "@/redux/store/cartSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import BarcodeComponent from "@/components/pdf/Barcode";

const Page = () => {
  const cartItems: CartItem[] = useSelector(
    (state: RootState) => state.cart.items
  );

  console.log("cartItems", cartItems);

  // Construct barcodeData
  /*const barcodeData: string = cartItems
    .map((item) => {
      // Construct string for item and its quantity
      let itemData = `${item.name} : ${item.quantity}`;

      // If item has components, add them to the string
      if (item.composants && item.composants.length > 0) {
        const componentsData = item.composants
          .map((component) => `${component.name}: ${component.quantity}`)
          .join(", ");
        itemData += `,  ${componentsData}`;
      }

      return itemData;
    })
    .join(" | ");*/

    const barcodeData: string = "Hello, world"

  console.log("barcodeData", barcodeData);
  console.log("barcodeData length", barcodeData.length);



  return (
    <div className="max-h-screen p-10">
 
      <BarcodeComponent barcodeData={barcodeData} />
    </div>
  );
};

export default Page;
