// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
"use client";
import React, { useEffect, useState } from "react";
import PDFPage from "./PDFPage";
import { Button } from "@/components/ui/button";
import RetraitPDFPage from "../BonDeRetrait/PDFPage";

const PDFGenerator: React.FC = () => {
  const [lastOrderData, setLastOrderData] = useState<LastOrderResponse>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [lastOrderRefrence, setLastOrderRefrence] = useState("");
  const [lastOrderId, setLastOrderID] = useState("");
  const role = sessionStorage.getItem("role");

  console.log("loading", loading);

  const TVA = localStorage.getItem("TVA");
  const totalTTC = localStorage.getItem("newTTC");
  const totalPreTax = localStorage.getItem("totalPreTax");
  const totalSales = localStorage.getItem("totalSales");
  const PostDiscount = localStorage.getItem("PostDiscount");
  const sales = sessionStorage.getItem("sales");
  let cartitem = localStorage.getItem("cartItems");
  const name = sessionStorage.getItem("name");
  const lastname = sessionStorage.getItem("lastname");
  const clientName = sessionStorage.getItem("clientName");
  const clientLastName = sessionStorage.getItem("clientLastName");
  const clientEmail = sessionStorage.getItem("clientEmail");
 
  if (cartitem) {
    try {
      cartitem = JSON.parse(cartitem); // Change cartItems to cartitem
      if (!Array.isArray(cartitem)) {
        // If cart items is not an array, convert it to an array
        cartitem = [cartitem];
      }
    } catch (error) {
      console.error("Error parsing cart items:", error);
      // Handle parsing error if needed
    }
  }

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
      console.log("data", data);
      setLastOrderData(data);
      role !== "picker"
        ? setLastOrderRefrence(data?.lastOrder?.confirmationCommande)
        : setLastOrderRefrence(data?.lastOrder?.confirmationCommande);
      setLastOrderID(data?.lastOrder?._id);
      console.log("setLastOrderData", setLastOrderData);
      //cleanupLocalStorage();
      //await generatePDF();
    } catch (error) {
      console.error("Error fetching last order:", error);
      setLastOrderData({ error: "Failed to fetch last order" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLastOrder();
  }, []);

  const opt = {
    margin: [0.2, 0, 0.2, 0],
    image: { type: "jpeg", quality: 1 },
    pagebreak: { avoid: "avoid-all", mode: "css", after: "#pdf-content", before: "#page2el" },
    html2canvas: { scale: 2, useCORS: true, dpi: 192, letterRendering: true },
    jsPDF: {
      unit: "in",
      format: "a4",
      orientation: "portrait",
      putTotalPages: true,
    },
  };
  

  const style = document.createElement("style");
  style.textContent = `
      .pdf-content:not(:first-child) {
        margin-top: 10px;
      }

      .page2el {
        page-break-before: always;
      }
    `;
  document.head.appendChild(style);

  const generatePDF = async () => {
    /*const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "/api";*/
    const content1 = document.getElementById("pdf-content");
    const content2 = document.getElementById("pdf-content2");

    if (content1 && content2) {
      try {
        const { default: html2pdf } = await import("html2pdf.js");

        // Generate the PDFs for both contents
        const pdfPromise1 = html2pdf().set(opt).from(content1).outputPdf();
        const pdfPromise2 = html2pdf().set(opt).from(content2).outputPdf();

        // Wait for both PDFs to be generated
        const [pdfBlob1, pdfBlob2] = await Promise.all([
          pdfPromise1,
          pdfPromise2,
        ]);

        // Convert PDF blobs to base64 strings
        const arrayBuffer1 = await new Response(pdfBlob1).arrayBuffer();
        const base64String1 = btoa(new TextDecoder().decode(arrayBuffer1));

        const arrayBuffer2 = await new Response(pdfBlob2).arrayBuffer();
        const base64String2 = btoa(new TextDecoder().decode(arrayBuffer2));

        // Open both PDFs in new tabs
        //window.open(`data:application/pdf;base64,${base64String1}`, "_blank");
        //window.open(`data:application/pdf;base64,${base64String2}`, "_blank");

        console.log("lastOrderRefrence", lastOrderRefrence);

        const requestBody = {
          pdfBase64_1: base64String1,
          pdfBase64_2: base64String2,
          emailAddress: role !== "picker" ? sessionStorage.getItem("email"): clientEmail,
          directory1: "ConfirmationEmail",
          directory2: "BonDeRetrait",
          refcommande: lastOrderRefrence,
          cartitem: cartitem,
          name: role !== "picker" ? name : clientName,
          lastname: role !== "picker" ? lastname : clientLastName,
        };

        

        // Send both PDFs in a single request
        const response = await fetch(`/api/pdf/save-pdf`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });

        if (response.ok) {
          console.log("PDFs saved successfully on the server!");
        } else {
          console.error("Failed to save the PDFs on the server");
        }
      } catch (error) {
        console.error("Error while generating or saving the PDFs:", error);
      }
    }
  };

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

  useEffect(() => {
    if (lastOrderRefrence !== "" && cartitem) {
      const cleanupLocalStorage = async () => {
        //await fetchLastOrder();
        await generatePDF();
        await modifyOrder();
        localStorage.removeItem("cartItems");
        localStorage.removeItem("totalTTC");
        sessionStorage.removeItem("newTTC");
        localStorage.removeItem("totalPreTax");
        localStorage.removeItem("TVA");
        localStorage.removeItem("totalSales");
        localStorage.removeItem("PostDiscount");
        sessionStorage.removeItem("sales");
        sessionStorage.removeItem("valide");
        sessionStorage.removeItem("clientName");
        sessionStorage.removeItem("clientLastName");
        sessionStorage.removeItem("clientEmail");

       window.location.href = "/mon-compte/mes-bons-de-livraison";
      };

      cleanupLocalStorage();
    }
  }, [lastOrderRefrence]);


  useEffect(() => {
    console.log("PDFGenerator component mounted on the client side.");
  }, []);

  return (
    <div className="lg:pt-10 pt-10 flex flex-col justify-between">
      <div className="mt-10 mb-10">
        <div className="flex justify-center mt-4  mb-4">
          <Button onClick={generatePDF}>Générer des PDFs</Button>
        </div>
      </div>
      <div className="flex justify-center gap-4 mb-10 flex-wrap">
        <div id="pdf-content" className=" w-[21cm]">
          <PDFPage
            lastOrderData={lastOrderData}
            TVA={TVA}
            totalTTC={totalTTC}
            totalPreTax={totalPreTax}
            totalSales={totalSales}
            PostDiscount={PostDiscount}
            sales={sales}
          />
        </div>
        <div id="pdf-content2" className=" w-[21cm]">
          <RetraitPDFPage
            lastOrderData={lastOrderData}
            TVA={TVA}
            totalTTC={totalTTC}
            totalPreTax={totalPreTax}
            totalSales={totalSales}
            PostDiscount={PostDiscount}
            sales={sales}
          />
        </div>
      </div>
    </div>
  );
};

export default PDFGenerator;