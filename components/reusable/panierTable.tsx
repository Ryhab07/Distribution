"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import {
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
} from "@/redux/store/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { CartItem } from "@/redux/store/cartSlice";
import Image from "next/image";

export function PanierTable({ salesData375, salesData500 }) {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const handleIncrement = (productId: string) => () => {
    // Dispatch the increaseQuantity action with the product ID
    dispatch(increaseQuantity(productId));
  };

  /*const handleIncrement = (productId: string, poductName: string) => () => {

    if (poductName.toLowerCase().includes("kit")) {
      console.log("entered kit")
      // Dispatch the increaseKitQuantity action with the product name
      dispatch(increaseKitQuantity(productId));
    } else {
      // Dispatch the increaseQuantity action with the product ID
      dispatch(increaseQuantity(productId));
    }
    dispatch(increaseQuantity(productId));
  };*/

  const handleDecrement = (productId: string) => () => {
    // Dispatch the decreaseQuantity action with the product ID
    dispatch(decreaseQuantity(productId));
  };

  const handleRemoveItem = (productId: string) => () => {
    dispatch(removeFromCart(productId));
  };

  return (
    <Table className="bg-[#FBFBFB] !border-[#DFDFDF]">
      <TableHeader className="h-[20px]">
        <TableRow className="h-[20px]">
          <TableHead className="text-black p-4  relative  border-black  ">
            Photo du Produit
          </TableHead>
          <TableHead className="text-black  p-4 border-b !border-[#DFDFDF]">
            Nom du Produit
          </TableHead>
          <TableHead className="text-black lg:w-[800px] w-[1200px] p-4 border-b !border-[#DFDFDF]">
            Description
          </TableHead>

          <TableHead className="text-black p-4 border-b !border-[#DFDFDF]">
            Prix (HT)
          </TableHead>
          <TableHead className="text-black p-4 border-b !border-[#DFDFDF]">
            Prix avec remise
          </TableHead>
          <TableHead className="text-black text-left p-4 border-b !border-[#DFDFDF]">
            Quantitée
          </TableHead>
          <TableHead className="text-black text-left p-4 border-b !border-[#DFDFDF]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="border-t-[#DFDFDF]">
        {Array.isArray(cartItems) ? (
          cartItems.map((item: CartItem) => (
            <TableRow key={item.id}>
              <TableCell className="w-[400px]">
                <Image
                  className=""
                  src={item.image}
                  alt="image-de-produit"
                  width={100}
                  height={10}
                />
              </TableCell>
              <TableCell className=" w-[600px] font-bold">
                {item.name === "Kit Photovoltaïque Personnalisé" && item.ref ? (
                    `Kit Photovoltaïque Personnalisé – ${item.ref.substring(3,10)}`) : item.name.includes("Kit Photovoltaïque") && item.kitPuissance ? (
                    `Kit Photovoltaïque ${item.kitPuissance}Wc`) : (item.name)}
                {item.name.includes("Coffret AC Personnalisé") && (
                  <>
                    {" "}
                    - {item.option2 && <span>{item.option2}</span>} -
                    {item.puissance && (
                      <span>
                        {" "}
                        {item.puissance.toLowerCase().includes("kw")
                          ? item.puissance
                          : item.puissance + " KW"}
                      </span>
                    )}
                  </>
                )}
                {item.name.toLowerCase().includes("micro-onduleur") && (
                  <>
                    {" "}
                    - {item.option1 && <span>{item.option1}</span>}
                    {item.option2 && <span>{item.option2}</span>}{" "}
                  </>
                )}
              </TableCell>
              <TableCell className="lg:w-[800px] w-[1200px]">
                {item.desc}
              </TableCell>
              <TableCell className="font-bold w-[200px]">
                {item.name.includes("Coffret AC Personnalisé") ? (
                  <span>Sur Devis</span>
                ) : (
                  `${
                    item.name.includes("Kit")
                      ? item.price.toFixed(0)
                      : item.price
                  } €`
                )}
              </TableCell>
              <TableCell className="font-bold w-[200px]">
                {item.name.includes("Kit") &&
                  (salesData375 !== 0 || salesData500 !== 0) && (
                    <span>
                      {typeof item.kitPuissance === "number" && (
                        <span>
                          {salesData375 && item.kitPuissance === 375
                            ? (item.price * salesData375).toFixed(0)
                            : salesData500 && item.kitPuissance === 500
                            ? (item.price * salesData500).toFixed(0)
                            : item.price.toFixed(2)}{" "}
                          €
                        </span>
                      )}
                    </span>
                  )}
              </TableCell>

              <TableCell className="text-left">
                <div className="flex justify-center  w-[80px] border !border-[#DFDFDF]">
                  <div className="w-[80%] p-2 flex justify-center">
                    {item.quantity}
                  </div>
                  <div className="w-[40%]  p-1">
                    <ChevronUp
                      onClick={handleIncrement(item.id)}
                      className="ml-2 h-4 w-4 shrink-0 opacity-50 cursor-pointer"
                    />
                    <ChevronDown
                      onClick={handleDecrement(item.id)}
                      className="ml-2 h-4 w-4 shrink-0 opacity-50 cursor-pointer"
                    />
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Trash2
                  className="text-red-500 h-[20px] w-[20px] cursor-pointer"
                  onClick={handleRemoveItem(item.id)}
                />
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={5} className="text-center">
              Le panier est vide.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
      {/*<TableFooter>
        <TableRow>
          <TableCell colSpan={5} className="text-right">
            <div className="mx-auto">
              <HoverButton color="#FAB516" directTo={`/pdf`}>
                <ArrowRightCircle className="h-[20px] w-[20px]"/>
                    Valider la commande
              </HoverButton>
            </div>
          </TableCell>
        </TableRow>
        </TableFooter>*/}
    </Table>
  );
}
