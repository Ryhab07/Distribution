// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
"use client";
import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import PDFPage from "./PDFPage";
import RetraitPDFPage from "../BonDeRetrait/PDFPage";
import { Button } from "@/components/ui/button";
import { PDFFooter } from "../PDFFooter";

const PDFGeneratorReactPrint: React.FC = () => {
  const [lastOrderData, setLastOrderData] = useState<LastOrderResponse>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [lastOrderRefrence, setLastOrderRefrence] = useState("");
  const [lastOrderId, setLastOrderID] = useState("");
  const role = sessionStorage.getItem("role");

  const TVA = localStorage.getItem("TVA");
  const totalTTC = localStorage.getItem("newTTC");
  const totalPreTax = localStorage.getItem("totalPreTax");
  const totalSales = localStorage.getItem("totalSales");
  const PostDiscount = localStorage.getItem("PostDiscount");
  const sales = sessionStorage.getItem("sales");

  let cartitem = localStorage.getItem("cartItems");
  if (cartitem) {
    try {
      cartitem = JSON.parse(cartitem);
      if (!Array.isArray(cartitem)) {
        cartitem = [cartitem];
      }
    } catch (error) {
      console.error("Error parsing cart items:", error);
    }
  }

  console.log("loading", loading);

  const fetchLastOrder = async () => {
    try {
      const userId = sessionStorage.getItem("id");
      const response = await fetch(
        role !== "picker"
          ? `/api/order/getLastOrder?userId=${userId}`
          : `/api/order/getLastOrder?createdBy=${userId}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch last order");
      }

      const data: LastOrderResponse = await response.json();
      setLastOrderData(data);
      setLastOrderRefrence(data?.lastOrder?.confirmationCommande);
      setLastOrderID(data?.lastOrder?._id);
    } catch (error) {
      console.error("Error fetching last order:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLastOrder();
  }, []);

  const contentRef1 = useRef<HTMLDivElement>(null);
  const contentRef2 = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => contentRef1.current,
    documentTitle: "PDF Document",
    onAfterPrint: () => {
      console.log("Print complete for first content.");
    },
  });

  const handlePrintSecond = useReactToPrint({
    content: () => contentRef2.current,
    documentTitle: "Retrait PDF",
    onAfterPrint: () => {
      console.log("Print complete for second content.");
    },
  });

  useEffect(() => {
    if (lastOrderRefrence !== "" && cartitem) {
      const cleanupLocalStorage = async () => {
        await modifyOrder();
        localStorage.clear();
        sessionStorage.clear();
      };

      cleanupLocalStorage();
    }
  }, [lastOrderRefrence]);

  const modifyOrder = async () => {
    try {
      const response = await fetch("/api/order/modifyOrder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          _id: lastOrderId,
          bonDeCommande: `/pdfs/ConfirmationEmail/${lastOrderRefrence}_BC.pdf`,
          bonDeRetrait: `/pdfs/BonDeRetrait/${lastOrderRefrence}_BR.pdf`,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to modify order. Status: ${response.status}`);
      }

      const data: ModifyOrderResponse = await response.json();
      return data;
    } catch (error) {
      console.error("Error modifying order:", error);
      return { error: "Internal server error." };
    }
  };

  const Footer = () => (
    <div style={{ height: "100px", marginTop: "20px" }}>
      <div style={{ width: "100%", display: "flex", justifyContent: "start", marginBottom: "10px" }}>
        <h1 style={{ fontWeight: "bold", fontSize: "10px" }}>
          JURIDICTION COMPETENTE Tout différend qui ne pourrait être réglé à
          l’amiable, les Tribunaux du ressort du Siège Social de la société ECO
          NEGOCE, seront seuls compétents pour connaître de cette contestation
          ou de ce différend.
        </h1>
      </div>
      <div style={{ width: "100%", display: "flex", justifyContent: "center", marginBottom: "10px" }}>
        <h1 style={{ fontSize: "8px" }}>
          econegoce.com - Société par actions simplifiée Capital social de 500
          000 € - N° SIRET : 84927879100017 - N° identif. intracomm. :
          FR47849278791 - 4690Z
        </h1>
      </div>
    </div>
  );

  return (
    <div
      style={{
        paddingTop: "10px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        margin: 0,  // Remove margin on the sides
      }}
    >
      <div style={{ margin: "10px 0" }}>
        <div style={{ display: "flex", justifyContent: "center", margin: "4px" }}>
          <Button onClick={handlePrint}>Print First PDF</Button>
          <Button onClick={handlePrintSecond}>Print Second PDF</Button>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "16px",
          marginBottom: "10px",
          flexWrap: "wrap",
          padding: 0,  // Remove padding on the sides
        }}
      >
        {/* First Page with Footer */}
        <div
          id="pdf-content"
          ref={contentRef1}
          style={{
            width: "21cm",
            backgroundColor: "#fff",
            padding: "10px",
            marginTop: "30px",
            pageBreakInside: "avoid",
            paddingTop: "0px", // No padding for the first page
            margin: 0, // Remove margin on the sides
          }}
        >
          <PDFPage
            lastOrderData={lastOrderData}
            TVA={TVA}
            totalTTC={totalTTC}
            totalPreTax={totalPreTax}
            totalSales={totalSales}
            PostDiscount={PostDiscount}
            sales={sales}
          />
          <Footer />
        </div>

        {/* Second Page with Footer */}
        <div
          id="pdf-content2"
          ref={contentRef2}
          style={{
            width: "21cm",
            backgroundColor: "#fff",
            padding: "10px",
            pageBreakInside: "avoid",
            paddingTop: "20px", // Add padding for other pages
            margin: 0, // Remove margin on the sides
          }}
        >
          <RetraitPDFPage
            lastOrderData={lastOrderData}
            TVA={TVA}
            totalTTC={totalTTC}
            totalPreTax={totalPreTax}
            totalSales={totalSales}
            PostDiscount={PostDiscount}
            sales={sales}
          />
          <PDFFooter />
        </div>
      </div>
    </div>
  );
};

export default PDFGeneratorReactPrint;
