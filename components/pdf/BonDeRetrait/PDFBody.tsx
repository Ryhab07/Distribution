import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { CartItem } from "@/redux/store/cartSlice";
import React, { useEffect } from "react";

interface PDFBodyProps {
  onTableHeight: (height: number) => void;
}

const minTableHeight = 440;
const rowHeight = 40;

const calculateTableHeight = (items: CartItem[]) => {
  let totalRows = items.length;
  items.forEach((item) => {
    if (item.composants && item.composants.length > 0) {
      totalRows += item.composants.filter(
        (composant: any) => composant.quantity !== 0
      ).length;
    }
  });

  const contentHeight = totalRows * rowHeight;
  const remainingHeight = Math.max(0, minTableHeight - contentHeight - 20);
  const fillerRows = Math.ceil(remainingHeight / rowHeight);
  const fillerRowHeight = remainingHeight / (fillerRows || 1);

  return {
    contentHeight,
    fillerRows,
    fillerRowHeight,
  };
};

export function PDFBody({ onTableHeight }: PDFBodyProps) {
  const cartItems = useSelector((state: RootState) => state.cart.items); //récupère les éléments du panier
  const { contentHeight, fillerRows, fillerRowHeight } =
    calculateTableHeight(cartItems);
  const responsiveTableHeight = Math.max(minTableHeight, contentHeight);

  useEffect(() => {
    onTableHeight(responsiveTableHeight);
  }, [responsiveTableHeight, onTableHeight]);

  return (
    <div className="relative bg-[#FAFAFA] shadow-md rounded-lg overflow-hidden border border-[#ccc] mt-0">
      <Table style={{ height: `${responsiveTableHeight}px` }}> {/*hauteur dynamique*/}
        <TableHeader>
  <TableRow className="bg-[#215d74] text-white text-[10px] font-medium leading-tight !py-1 h-[40px]">
    <TableHead className="font-bold text-white text-center border-r border-white w-[13px] px-1 py-[3px]">
      REF
    </TableHead>
    <TableHead className="font-bold text-white text-center border-r border-white w-[320px] px-1 py-[3px]">
      DESCRIPTION
    </TableHead>
    <TableHead className="font-bold text-white text-center border-r border-white w-[13px] px-1 py-[3px]">
      QUANTITÉ
    </TableHead>
    <TableHead className="font-bold text-white text-center border-r border-white w-[13px] px-1 py-[3px]">
      UNITÉ
    </TableHead>
    <TableHead className="font-bold text-white text-center border-white px-1 py-[3px] w-[60px] leading-tight">
  <div className="flex flex-col items-center">
    <span>CODE</span>
    <span>MAGASIN</span>
  </div>
</TableHead>
  </TableRow>
</TableHeader>

        <TableBody>
          {cartItems.length > 0 ? (
            cartItems.map((item: CartItem) => (
              <React.Fragment key={item.id}>
                <TableRow className="text-[10px] border-b border-[#ddd]">
                  <TableCell className="text-center font-semibold">{item.id.substring(0, 10)}</TableCell>
                  <TableCell className="font-semibold">{item.name}-{item.id.substring(3,10)}</TableCell>
                  <TableCell className="text-center">{item.quantity}</TableCell>
                  <TableCell className="text-center">PIECES</TableCell>
                  <TableCell className="text-center">TREMBLAY W</TableCell>
                </TableRow>
                {item.composants?.map(
                  (composant: any, index: number) =>
                    composant.quantity !== 0 && (
                      <TableRow key={index} className="text-[9px] border-b border-[#f0f0f0]">
                        <TableCell className="text-center">{(composant.id || composant._id).substring(0, 50)}</TableCell>
                        <TableCell>* {composant.name}</TableCell>
                        <TableCell className="text-center">{composant.quantity}</TableCell>
                        <TableCell className="text-center">PIECES</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    )
                )}
              </React.Fragment>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                Le panier est vide.
              </TableCell>
            </TableRow>
          )}
          {fillerRows > 0 &&
            Array.from({ length: fillerRows }).map((_, index) => (
              <TableRow
                key={`filler-${index}`}
                style={{ height: `${fillerRowHeight}px` }}
                className="border-b border-[#f5f5f5]"
              >
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}
