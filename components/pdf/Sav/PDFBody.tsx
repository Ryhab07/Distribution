import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import React from "react";

export function PDFBody({ data }) {
  console.log("data?.length", data?.length);
  console.log("data", data);
  console.log("Type of data:", typeof data);

  if (data != null) {
    console.log("data length", typeof data);
  } else {
    console.log("data is null or undefined");
  }

  return (
    <div className="">
      <Table className="bg-[#FBFBFB] h-[950px]">
        <TableHeader>
          <TableRow className="border-b-[#dfdfdf]">
            <TableHead className="text-black text-[14px] text-center border-r border-[#dfdfdf] w-[14px] !h-[20px] !py-[20px] !px-1">
              Référence
            </TableHead>
            <TableHead className="text-black text-[14px] border-r w-[350px] border-[#dfdfdf] !h-[20px] !py-[20px] !px-1">
              Designation
            </TableHead>
            <TableHead className="text-black text-[16px] text-center border-r border-[#dfdfdf] w-[12px] !h-[20px] !py-[20px] !px-1">
              Quantitée
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="align-top ">
          {data != null ? (
            <React.Fragment key={data?.id}>
              {/* Render main product */}
              <TableRow className="border-b-[0px] !pt-0 !pb-0 !h-[-30px] align-top">
                <TableCell className="font-[600] text-[20px] text-center border-[#dfdfdf] border-r w-[12px] !px-2 align-top">
                  {data?.articleNumber || data?.reference}
                </TableCell>
                <TableCell className="font-[600] text-[25px] border-r w-[350px] border-[#dfdfdf] !px-2 align-top">
                  {data?.modele || data?.articleName} - {data?.marque}
                  {data?.modele?.toLowerCase().includes("Micro-onduleur") && (
                    <>
                      -{data?.option1 && <span>{data?.option1}</span>}
                      {data?.option2 && <span>{data?.option2}</span>}
                    </>
                  )}
                </TableCell>
                <TableCell className="font-[600] text-[20px] border-r text-center border-[#dfdfdf] !px-2 align-top">
                  {data?.Quantite || data?.quantite ||"-"}
                </TableCell>
              </TableRow>
              {data?.composants &&
                data?.composants.map(
                  (composant: any, index: number) =>
                    composant.quantity !== 0 && (
                      <TableRow
                        key={index}
                        className="border-b-[0px] h-[-20px] align-top"
                      >
                        <TableCell className="font-[400] text-[14px] text-center border-[#dfdfdf] border-r w-[20px] !p-0 align-top">
                          {composant.id.substring(0, 50)}
                        </TableCell>
                        <TableCell className="font-[400] text-[16px] border-r w-[350px] border-[#dfdfdf] !px-2 align-top">
                          * {composant.name}{" "}
                          {composant.name.includes("Crochets") && (
                            <>{data?.option1 && <span>{data?.option1}</span>}</>
                          )}
                        </TableCell>
                        <TableCell className="font-[400] text-[16px] text-center w-[12px] !px-2 align-top"></TableCell>
                      </TableRow>
                    )
                )}
            </React.Fragment>
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="text-center align-top !pt-2">
                Le panier est vide.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
