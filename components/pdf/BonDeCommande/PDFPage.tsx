// PDFPage.tsx
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { PDFBody } from "./PDFBody";
import { PDFResume } from "./PDFResume";
import { PDFInstalleur } from "../PDFInstalleur";
//import BarcodeComponent from "../Barcode";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import PDFNewHeader from "../BonDeRetrait/PDFNewHeader";
import PDFNewFooter from "../BonDeRetrait/PDFNewFooter";
import PDFUpperHeader from "./PDFUpperHeader";

interface PDFPageProps {
  installateur: string;
  chantier: string;
  lastOrderData: any;
  TVA: string;
  totalTTC: string;
  totalPreTax: string;
  PostDiscount: string;
  totalSales: string;
  sales: string;
}

const PDFPage: React.FC<PDFPageProps> = ({
  lastOrderData,
  TVA,
  totalTTC,
  totalPreTax,
  PostDiscount,
  totalSales,
  sales,
}) => {
  const [tableHeight, setTableHeight] = useState<number | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const upperPDFRef = useRef<HTMLDivElement>(null);
  const FooterPDFRef = useRef<HTMLDivElement>(null);
  const PostTableRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const installateurRef = useRef<HTMLDivElement>(null);
  const upperHeaderPDFRef = useRef<HTMLDivElement>(null);
  const [upperPDF, setUpperPDF] = useState<number>(0);
  const [footerPDF, setFooterPDF] = useState<number>(0);
  const [PostTable, setPostTable] = useState<number>(0);
  const [Header, setHeader] = useState<number>(0);
  const [content, setContent] = useState<number>(0);
  const [upperHeaderPDF, setUpperHeaderPDF] = useState<number>(0);
  const [installateurPDF, setInstallateurPDF] = useState<number>(0);
  const pageHeight = 1120;

  // Generate data for the single barcode representing all items
  const barcodeData: string = cartItems
    .map((item) => {
      if (item.composants && item.composants.length > 0) {
        // If item has components
        const componentsData = item.composants
          .map((component) => `${component.name}: ${component.quantity}`)
          .join(", ");
        return `${item.name}, Quantity: ${item.quantity}, Components: ${componentsData}`;
      } else {
        // If item does not have components
        return `${item.name}, Quantity: ${item.quantity}`;
      }
    })
    .join(" | "); // Use '|' to separate items in the barcode

  console.log("barcodeData PDF PAge", barcodeData);

  useLayoutEffect(() => {
    if (upperPDFRef.current) {
      setUpperPDF(upperPDFRef.current.offsetHeight);
    }
    if (FooterPDFRef.current) {
      setFooterPDF(FooterPDFRef.current.offsetHeight);
    }
    if (PostTableRef.current) {
      setPostTable(PostTableRef.current.offsetHeight);
    }
    if (headerRef.current) {
      setHeader(headerRef.current.offsetHeight);
    }
    if (contentRef.current) {
      setContent(contentRef.current.offsetHeight);
    }
    if (upperHeaderPDFRef.current) {
      setUpperHeaderPDF(upperHeaderPDFRef.current.offsetHeight);
    }
    if (installateurRef.current) {
      setInstallateurPDF(installateurRef.current.offsetHeight);
    }
  }, []);

  const fullContent = upperPDF + footerPDF;

  const numberOfPages = Math.ceil(fullContent / pageHeight);
  const pageForPostTable = Math.ceil(
    (content - installateurPDF + Header + upperHeaderPDF) / pageHeight
  );
  const pageForUpperInstallateur = Math.ceil(
    (content - installateurPDF + Header + upperHeaderPDF) / pageHeight
  );



  const fits = pageHeight * pageForPostTable - upperPDF > PostTable;

  const upperfits =  !fits ? true : pageHeight * pageForUpperInstallateur - upperPDF > installateurPDF;    

  const emptyDivHeight = !fits
    ? numberOfPages * pageHeight - (fullContent + footerPDF + 30)
    : !upperfits
    ? numberOfPages * pageHeight - (fullContent + footerPDF + 150)
    : numberOfPages * pageHeight - (fullContent + footerPDF);

  const handleTableHeight = (height: number) => {
    setTableHeight(height);
  };

  function countCartItems(cart) {
    let kitCount = 0;
    let itemCount = 0;

    cart.forEach((item) => {
      if (item.composants && item.composants.length > 0) {
        // If it's a kit, count it as a kit
        kitCount += item.quantity;

        // Skip counting the components in itemCount
        // Only the kit itself is counted, not its components
      } else {
        // If it's not a kit, count it as an individual item
        itemCount += item.quantity;
      }
    });

    return { kitCount, itemCount };
  }

  const result = countCartItems(cartItems);

  const shouldRenderEmptySpace = result.itemCount > 19 || result.kitCount > 1;

  useEffect(() => {
    console.log({
      numberOfPages,
      fullContent,
      emptyDivHeight,
      upperPDF,
      footerPDF,
      PostTable,
      Header,
      upperHeaderPDF,
      fits,
      upperfits,
      tableHeight,
      result,
    });
  }, [
    numberOfPages,
    fullContent,
    emptyDivHeight,
    upperPDF,
    footerPDF,
    PostTable,
    Header,
    upperHeaderPDF,
    fits,
    upperfits,
    tableHeight,
    result,
  ]);

  console.log(
    "yes or no",
    result.itemCount > 19 ||
      result.kitCount > 1 ||
      (result.itemCount > 0 && result.kitCount > 1)
  );

  return (
    <div className="flex flex-col min-h-screen">
      <div ref={upperPDFRef}>
        <div className="flex-1">
          <div ref={headerRef}>
            <PDFNewHeader />
          </div>
          <div ref={upperHeaderPDFRef}>
            <PDFUpperHeader
              confirmation={lastOrderData.lastOrder?.retraitDeCommande}
              date={lastOrderData.lastOrder?.issueDate}
            />
          </div>
          <div ref={contentRef} className="p-4 mt-[-20px]">
            <PDFBody onTableHeight={handleTableHeight} />
            <div className="flex justify-end  p-4 w-full ">
            <div
              className="mt-[-10px]"
              ref={PostTableRef}
              id={
                // First check if result.itemCount or result.kitCount meet the condition
                (result.itemCount > 19 ||
                  result.kitCount > 1 ||
                  (result.itemCount > 0 && result.kitCount > 1)) &&
                numberOfPages === 1
                  ? "page2ele"
                  : !fits && numberOfPages !== 1
                  ? "page2el"
                  : ""
              }
            >
                <PDFResume
                  TVA={TVA}
                  totalTTC={totalTTC}
                  totalPreTax={totalPreTax}
                  totalSales={totalSales}
                  PostDiscount={PostDiscount}
                  sales={sales}
                />
              </div>
            </div>
            {/* Condition to not render the page2el or emptyDivHeight if there are 19 items or 1 kit */}
            <div
              className={`flex `}
              id={
                // First check if result.itemCount or result.kitCount meet the condition
                (result.itemCount > 19 ||
                  result.kitCount > 1 ||
                  (result.itemCount > 0 && result.kitCount > 1)) &&
                numberOfPages === 1
                  ? "page2el"
                  : !upperfits && numberOfPages !== 1
                  ? "page2el"
                  : ""
              }
              ref={installateurRef}
            >
              <PDFInstalleur />
            </div>
          </div>
        </div>

        <div
          ref={PostTableRef}
          id={
            // First check if result.itemCount or result.kitCount meet the condition
            (result.itemCount > 19 ||
              result.kitCount > 1 ||
              (result.itemCount > 0 && result.kitCount > 1)) &&
            numberOfPages === 1
              ? "page2ele"
              : !fits && numberOfPages !== 1
              ? "page2el"
              : ""
          }
        >
          <div className="w-full flex justify-start px-10  mb-8">
            <h1 className="font-bold text-[8px]">
              JURIDICTION COMPETENTE Tout différend qui ne pourrait être réglé à
              l’amiable, les Tribunaux du ressort du Siège Social de la société
              ECO NEGOCE, seront seuls compétents pour connaître de cette
              contestation ou de ce différend.
            </h1>
          </div>
        </div>
      </div>

      {/* Empty div with adjusted condition */}
      {shouldRenderEmptySpace && (
        <div
          style={{
            height: `${emptyDivHeight}px`,
            backgroundColor: "transparent",
          }}
        >
          <p className="text-transparent">Empty Space</p>
        </div>
      )}

      <div ref={FooterPDFRef}>
        <PDFNewFooter />
      </div>
    </div>
  );
};

export default PDFPage;
