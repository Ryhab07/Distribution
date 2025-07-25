import React, { useRef, useState, useEffect, useLayoutEffect } from "react";
import { PDFBody } from "./PDFBody";
import { PDFInstalleur } from "../PDFInstalleur";
import { PDFUpperFooter } from "./PDFUpperFooter";
import PDFNewHeader from "./PDFNewHeader";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import PDFUpperHeader from "./PDFUpperHeader";


interface PDFPageProps {
  installateur: string;
  chantier: string;
  lastOrderData: any;
}

const RetraitPDFPage: React.FC<PDFPageProps> = ({ lastOrderData }) => {
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
  const pageHeight = 1120; // Height of a single page in pixels

  useLayoutEffect(() => {
    const updateHeights = () => {
      if (upperPDFRef.current) setUpperPDF(upperPDFRef.current.offsetHeight);
      if (FooterPDFRef.current) setFooterPDF(FooterPDFRef.current.offsetHeight);
      if (PostTableRef.current) setPostTable(PostTableRef.current.offsetHeight);
      if (headerRef.current) setHeader(headerRef.current.offsetHeight);
      if (contentRef.current) setContent(contentRef.current.offsetHeight);
      if (upperHeaderPDFRef.current) setUpperHeaderPDF(upperHeaderPDFRef.current.offsetHeight);
      if (installateurRef.current) setInstallateurPDF(installateurRef.current.offsetHeight);
    };

    updateHeights();
    window.addEventListener('resize', updateHeights);
    return () => window.removeEventListener('resize', updateHeights);
  }, []);

  const fullContent = upperPDF + footerPDF;
  const numberOfPages = Math.ceil(fullContent / pageHeight);
  const pageForPostTable = Math.ceil((Header + upperHeaderPDF + content) / pageHeight);
  const pageForUpperInstallateur = Math.ceil((content - installateurPDF + Header + upperHeaderPDF) / pageHeight);

  const upperfits = pageHeight * pageForUpperInstallateur - upperPDF > installateurPDF;
  const fits = !upperfits ? true : pageHeight * pageForPostTable - upperPDF > PostTable;

  const remainingSpaceOnLastPage = pageHeight - ((Header + upperHeaderPDF + content + PostTable) % pageHeight);
  const emptyDivHeight = remainingSpaceOnLastPage > footerPDF ? (remainingSpaceOnLastPage - footerPDF - 50) : 0;

  const handleTableHeight = (height: number) => {
    setTableHeight(height);
  };

  function countCartItems(cart) {
    let kitCount = 0;
    let itemCount = 0;

    cart.forEach((item) => {
      if (item.composants && item.composants.length > 0) {
        kitCount += item.quantity;
      } else {
        itemCount += item.quantity;
      }
    });

    return { kitCount, itemCount };
  }

  const result = countCartItems(cartItems);
  const shouldRenderEmptySpace = result.itemCount > 19 || result.kitCount >= 1;
  const renderSpacer = emptyDivHeight > 0 && shouldRenderEmptySpace;

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
      shouldRenderEmptySpace,
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
          <div ref={contentRef} className="pt-2 pb-2 px-4">
           <PDFBody onTableHeight={handleTableHeight} />
           <div
              className={`flex mt-[2px]`}
              ref={installateurRef}>
            <PDFInstalleur />
            </div>

           <div style={{ pageBreakBefore: 'always', breakBefore: 'page' }} />
          </div>
        </div>

        <div
          ref={PostTableRef}
          id={numberOfPages === 1 ? "" : !fits && numberOfPages !== 1 ? "page2el" : ""}
        >
          <div className="p-4 mt-[-30px]">
            <div>
              <PDFUpperFooter />
            </div>
          </div>

        </div>
      </div>

      {renderSpacer && (
        <div
          style={{
            height: `${emptyDivHeight}px`,
            backgroundColor: "transparent",
          }}
        >
          <p className="text-transparent">Spacer</p>
        </div>
      )}

  
    </div>
  );
};

export default RetraitPDFPage;