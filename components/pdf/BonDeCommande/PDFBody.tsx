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
  onTableHeight: (height: number) => void; // Define the function prop type
}

const minTableHeight = 440; // Minimum table height in pixels
const rowHeight = 40; // Height of a single row in pixels

const calculateTableHeight = (items: CartItem[]) => {
  let totalRows = items.length; // Main items count
  items.forEach((item) => {
    if (item.composants && item.composants.length > 0) {
      totalRows += item.composants.filter(
        (composant: any) => composant.quantity !== 0
      ).length;
    }
  });

  const contentHeight = totalRows * rowHeight;
  const remainingHeight = Math.max(0, minTableHeight - contentHeight -20); // Remaining space
  console.log("remaining height: " + remainingHeight)
  const fillerRows = Math.ceil(remainingHeight / rowHeight); // Number of filler rows
  const fillerRowHeight = remainingHeight / (fillerRows || 1); // Divide space for filler rows

  return {
    contentHeight,
    fillerRows,
    fillerRowHeight,
  };
};

export function PDFBody({ onTableHeight }: PDFBodyProps) {
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const { contentHeight, fillerRows, fillerRowHeight } =
    calculateTableHeight(cartItems);

  const responsiveTableHeight = Math.max(minTableHeight, contentHeight);

  console.log("contentHeight", contentHeight)

  useEffect(() => {
    onTableHeight(responsiveTableHeight); // Notify parent about table height
  }, [responsiveTableHeight, onTableHeight]);

  return (
    <div className="relative bg-[#FBFBFB]">
      <Table
        className="w-full border-collapse border border-[#dfdfdf]"
        style={
          { height: `${responsiveTableHeight}px` }
        }
      >
        <TableHeader>
          <TableRow className=" border-b border-[#dfdfdf] !h-[30px] items-center bg-[#fab516]">
            <TableHead className="text-white text-[11px] text-center items-center border-r border-[#dfdfdf] w-[12px] py-[3px] px-1">
              REF
            </TableHead>
            <TableHead className="text-white text-[11px] border-r w-[320px] text-center items-center border-[#dfdfdf] py-[3px] px-1">
              Description
            </TableHead>
            <TableHead className="text-white text-[10px]  border-r text-center items-center border-[#dfdfdf] w-[12px] py-[3px] px-1">
              Quantité
            </TableHead>
            <TableHead className="text-white text-[11px]  border-r text-center items-center border-[#dfdfdf] w-[12px] py-[3px] px-1">
              Unité
            </TableHead>
            <TableHead className="text-white text-[10px]  !w-[20px] text-center items-center py-[3px] px-1">
              Code magasin
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cartItems.length > 0 ? (
            cartItems.map((item: CartItem) => (
              <React.Fragment key={item.id}>
                <TableRow className="!p-0 !leading-3 !h-[5px] border-[#dfdfdf] border-b-0">
                  <TableCell className="font-[600] text-[9px] border-r text-center border-[#dfdfdf] border-b-0  w-[12px] px-2">
                    {item.id.substring(0, 10)}
                  </TableCell>
                  <TableCell className="font-[600] text-[11px] border-r border-[#dfdfdf] border-b-0 w-[320px] px-2">
                    {item.name}
                  </TableCell>
                  <TableCell className="font-[400] text-[12px] text-center border-r border-[#dfdfdf] border-b-0 px-2">
                    {item.quantity}
                  </TableCell>
                  <TableCell className="font-[400] text-[11px] text-center border-r border-[#dfdfdf] border-b-0 w-[12px] px-2">
                    PIECES
                  </TableCell>
                  <TableCell className="font-[400] text-[10px] text-center !w-[20px] px-2">
                    TREMBLAY W
                  </TableCell>
                </TableRow>
                {item.composants?.map(
                  (composant: any, index: number) =>
                    composant.quantity !== 0 && (
                      <TableRow key={index} className="h-[5px] border-[#dfdfdf] border-b-0">
                        <TableCell className="font-[400] text-[9px] text-center border-r border-[#dfdfdf] border-b-0 w-[12px] px-0">
                        {(composant.id || composant._id).substring(0, 50)}
                        </TableCell>
                        <TableCell className="font-[400] text-[10px] border-r border-[#dfdfdf] border-b-0 w-[320px] px-2">
                          * {composant.name}
                        </TableCell>
                        <TableCell className="font-[400] text-[10px] text-center border-r border-[#dfdfdf] border-b-0 px-2">
                          {composant.quantity}
                        </TableCell>
                        <TableCell className="font-[400] text-[10px] text-center border-r border-[#dfdfdf] border-b-0 w-[12px] px-2">
                          PIECES
                        </TableCell>
                        <TableCell className="font-[400] text-[10px] text-center !w-[20px] px-2"></TableCell>
                      </TableRow>
                    )
                )}
              </React.Fragment>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4">
                Le panier est vide.
              </TableCell>
            </TableRow>
          )}
          {fillerRows > 0  &&
            Array.from({ length: fillerRows }).map((_, index) => (
              <TableRow
                key={`filler-${index}`}
                className="border-r border-[#dfdfdf] border-b-0"
                style={{ height: `${fillerRowHeight}px` }}
              >
                <TableCell  className="border-r border-[#dfdfdf] border-b-0 w-[12px]"></TableCell>
                <TableCell  className="border-r border-[#dfdfdf] border-b-0 w-[320px]"></TableCell>
                <TableCell  className="border-r border-[#dfdfdf] border-b-0 w-[12px]"></TableCell>
                <TableCell  className="border-r border-[#dfdfdf] border-b-0 !w-[20px]"></TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}