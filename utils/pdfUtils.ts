const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
export const generateAndSavePDF = async () => {
    const content = document.getElementById("pdf-content");
  
    if (content) {
      try {
        const { default: html2pdf } = await import("html2pdf.js");
  
        const pdfBlob = await html2pdf(content).outputPdf();
  
        // Convert the Blob to base64
        const blobData = await new Response(pdfBlob).arrayBuffer();
        const base64String = btoa(new Uint8Array(blobData).reduce((data, byte) => data + String.fromCharCode(byte), ''));
  
        const response = await fetch(`${apiUrl}/pdf/save-pdf`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ pdfBase64: base64String }),
        });
  
        if (response.ok) {
          console.log("PDF saved successfully on the server!");
        } else {
          console.error("Failed to save the PDF on the server");
        }
      } catch (error) {
        console.error("Error while generating or saving the PDF:", error);
      }
    }
  };
  