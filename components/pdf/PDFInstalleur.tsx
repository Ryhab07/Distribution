import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CartItem } from "@/redux/store/cartSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import React from "react";
export function PDFInstalleur() {
  const cartItems = useSelector((state: RootState) => state.cart.items);

  return (
    <div className="w-full flex justify-center mt-4 mb-2">
      <div className="bg-[#FAFAFA] rounded-lg border border-[#ccc] overflow-hidden w-[600px]">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="bg-[#215d74] text-white text-[10px] font-medium h-[40px]">
              <TableCell className="text-white text-center font-bold w-1/2 border-r border-white">
                RÉFÉRENCE PRODUIT
              </TableCell>
              <TableCell className="text-white text-center font-bold w-1/2">
                RÉFÉRENCE CHANTIER
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.isArray(cartItems) ? (
              cartItems.filter(item => item.chantier !== '').length > 0 ? (
                cartItems.map((item: CartItem) => (
                  item.chantier && (
                    <TableRow key={item.id} className="text-[10px] border-b border-[#ddd]">
                      <TableCell className="text-center font-semibold py-2">{item.ref}</TableCell>
                      <TableCell className="text-center font-semibold py-2">{item.chantier}</TableCell>
                    </TableRow>
                  )
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} className="text-center text-[12px]">-</TableCell>
                </TableRow>
              )
            ) : (
              <TableRow>
                <TableCell colSpan={2} className="text-center">Le panier est vide.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
