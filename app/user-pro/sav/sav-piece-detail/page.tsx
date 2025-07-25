"use client";
import { useState, useEffect, useRef } from "react";
import Breadcrumb from "@/components/reusable/BreadCrumb";
import BannerTitle from "@/components/reusable/BannerTitle";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowDownToLine, Trash } from "lucide-react";
import { writeFile, utils } from "xlsx";
import ModificationModal from "@/components/reusable/ModificationModal";
import { SavPieceFormModificationAdmin } from "@/components/auth/sav-piece-modification-admin";
import SavPDFPage from "@/components/pdf/Sav/PDFPage";

interface CardProps {
  _id: string;
  created_at: string;
  societe: string;
  client: string;
  marque: string;
  serieNumber: string;
  numeroCommande: string;
  articleName: string;
  reference: string;
  stockDispoTremblay: string;
  dateCommande: string;
  lieuDuReception: string;
  personneQuiPasseCommande: string;
  dateLivraisonPrevue: string;
  dateReceptionDepot: string;
  dateExpedition: string;
  dateReceptionPieceDef: string;
  dateExpeditionPieceDef: string;
  numeroDevisEconegoce: string;
  dateReglement: string;
  facturePieceFournisseur: string;
  avoirPieceFournisseur: string;
  facturePieceClientEconegoce: string;
  reponseExpertise: string;
  avoirPieceClientEconegoce: string;
  dossierCloture: string;
  observation: string;
  Quantite: number;
  Prix: number;
  adresseRetrait: string;
  onSelectCard: (id: string) => void; // New prop
}

const Page = () => {
  const searchParams = useSearchParams();
  const [userData, setUserData] = useState<CardProps[]>([]);
  const pdfRef = useRef<HTMLDivElement>(null);
  const id = searchParams?.get("search");
  const [showDiv, setShowDiv] = useState<boolean>(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`/api/pieces/fetchPieces?page=1&id=${id}`);

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      const data = await response.json();
      console.log("data.pieces", data.pieces);
      setUserData(data.pieces);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const formatDate = (dateString: string) => {
    const dateObject = new Date(dateString);
    const day = dateObject.getDate().toString().padStart(2, "0");
    const month = (dateObject.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based
    const year = dateObject.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const downloadPDF = async () => {
    if (!pdfRef.current) return;
  
    // Ensure the div is visible before generating the PDF
    setShowDiv(true);
  
    const [html2canvas, jsPDF] = await Promise.all([
      import("html2canvas"),
      import("jspdf"),
    ]);
  
    const pdf = new jsPDF.default("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
  
    // Set the scale to improve the resolution
    const canvas = await html2canvas.default(pdfRef.current, {
      scale: 2,
    });
    const imgData = canvas.toDataURL("image/png");
  
    const imgProps = pdf.getImageProperties(imgData);
    const imgWidth = pdfWidth - 4; // Width of the image with 2mm padding on each side
    const adjustedImgHeight = (imgProps.height * imgWidth) / imgProps.width;
  
    const xPos = 2; // Left padding
    const yPos = 10; // Initial top padding
  
    // Check if content height fits on one page, if not, calculate pages required
    if (adjustedImgHeight > pdfHeight - 20) {
      const pagesRequired = Math.ceil(adjustedImgHeight / (pdfHeight - 20));
  
      for (let i = 0; i < pagesRequired; i++) {
        if (i > 0) pdf.addPage();
        pdf.addImage(
          imgData,
          "PNG",
          xPos,
          -i * (pdfHeight - 20) + yPos,
          imgWidth,
          adjustedImgHeight
        );
  
        // Add footer only on the last page
        if (i === pagesRequired - 1) {
          pdf.setFontSize(6); // Set font size to 8px
          pdf.text(
            "econegoce.com - Société par actions simplifiée Capital social de 500 000 € - N° SIRET : 84927879100017 - N° identif. intracomm. : FR47849278791 - 4690Z",
            pdfWidth / 2,
            pdfHeight - 10,
            { align: "center" }
          );
        }
      }
    } else {
      pdf.addImage(imgData, "PNG", xPos, yPos, imgWidth, adjustedImgHeight);
      
      pdf.setFontSize(6); // Set font size to 8px
      pdf.text(
        "econegoce.com - Société par actions simplifiée Capital social de 500 000 € - N° SIRET : 84927879100017 - N° identif. intracomm. : FR47849278791 - 4690Z",
        pdfWidth / 2,
        pdfHeight - 10,
        { align: "center" }
      );
    }
  
    pdf.save(
      `sav-piece-${formatDate(userData[0]?.created_at)}-${
        userData[0]?.marque
      }-${userData[0]?.articleName}.pdf`
    );
  
    // Hide the div after PDF generation
    setShowDiv(false);
  };
  

  const exportToExcel = () => {
    const data = userData.map((user) => ({
      "DATE DE LA DEMANDE": formatDate(user.created_at),
      SOCIETE: user.societe || "",
      CLIENT: user.client || "",
      MARQUE: user.marque || "",
      "NUMERO DE SERIE": user.serieNumber || "",
      "NUMERO DE COMMANDE": user.numeroCommande || "",
      "NOM DE LA PIECE": user.articleName || "", // Assuming 'articleName' is 'modele'
      REFERENCE: user.reference || "",
      "STOCK DISPO TREMBLAY": user.stockDispoTremblay || "",
      "DATE DE LA COMMANDE": formatDate(user.dateCommande),
      "LIEU DE RECEPTION": user.lieuDuReception || "",
      "DATE DE LIVRAISON PREVU": formatDate(user.dateLivraisonPrevue),
      "PERSONNE QUI PASSE COMMANDE": user.personneQuiPasseCommande || "",
      "DATE DE RECEPTION DEPOT": formatDate(user.dateReceptionDepot),
      "DATE EXPEDITION ou ENLEVEMENT": formatDate(user.dateExpedition),
      "DATE RECEPTION PIECE DEFECTUEUSE": formatDate(
        user.dateReceptionPieceDef
      ),
      "DATE EXPEDITION DE LA PIECE DEFECTUEUSE": formatDate(
        user.dateExpeditionPieceDef
      ),

      "NUMERO DU DEVIS ECONEGOCE": user.numeroDevisEconegoce || "",
      "DATE DU REGLEMENT ": formatDate(user.dateReglement),
      "FACTURE PIECE FOURNISSEUR": user.facturePieceFournisseur[0] || "",
      "AVOIR PIECE FOURNISSEUR": user.avoirPieceFournisseur[0] || "",
      "FACTURE PIECE CLIENT ECONEGOCE":
        user.facturePieceClientEconegoce[0] || "",
      "REPONSE D’EXPERTISE": user.reponseExpertise || "",
      "AVOIR PIECE CLIENT ECONEGOCE": user.avoirPieceClientEconegoce || "",
      "DOSSIER CLOTURE": user.dossierCloture || "",
      "N° COMMANDE FOURNISSEUR": user.numeroCommande || "",
      OBSERVATION: user.observation || "",
      "QUANTITE": user.Quantite || "",
    }));

    const ws = utils.json_to_sheet(data);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Feuil1");
    writeFile(
      wb,
      `sav-piece-${formatDate(userData[0]?.created_at)}-${
        userData[0]?.marque
      }-${userData[0]?.articleName}.xlsx`
    );
  };

  const calculateDaysBetween = (dateString: string) => {
    if (!dateString) return "";
  
    const dateObject = new Date(dateString);
    const today = new Date();
  
    // Normalize both dates to midnight
    dateObject.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
  
    // Calculate the difference in milliseconds
    const timeDifference = today.getTime() - dateObject.getTime();
  
    // Convert milliseconds to days
    const daysDifference = timeDifference / (1000 * 3600 * 24);
  
    return Math.floor(daysDifference);
  };
  

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/pieces/delete`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ _id: id }), // Send ID in the body as JSON
        }
      );

      if (response.ok) {
        window.location.href = "/collaborateur/sav/liste-sav-piece";
      }

      if (!response.ok) {
        throw new Error("Failed to delete piece");
      }
    } catch (error) {
      console.error("Error deleting piece:", error);
      // Optionally, handle error (e.g., show an error message)
    }
  };

  return (
    <div className="min-h-screen flex-col justify-between lg:pt-[70px] pt-[60px] ">
      <BannerTitle tile={"DETAIL SUIVI PIECES DETACHEES"} paragraph={""} />
      <Breadcrumb
        paths={[
          { name: "Accueil", url: "/user-pro/sav" },
          {
            name: "Liste de Suivi des Pièces Détachées",
            url: "/user-pro/sav/liste-sav-piece",
          },
          {
            name: "liste Suivi Pièces Détachées",
            url: "#",
          },
        ]}
      />
      <div className="lg:pt-10 p-10 max-w-[1280px] mx-auto  mt-10 rounded-md mb-10">
        <div className="flex justify-between gap-4 lg:flex-row flex-col">
          <div className="flex justify-start lg:gap-4 ">
            {userData[0] !== undefined && (
              <h4 className="items-center">
                Ticket ouvert depuis le {formatDate(userData[0]?.created_at)} (
                {calculateDaysBetween(userData[0]?.created_at)} jours) -{" "}
                {userData[0]?.status}
              </h4>
            )}
          </div>

          <div className="flex justify-end mb-10 gap-4">
            <Button className="bg-[#3e9f36]" onClick={downloadPDF}>
              <ArrowDownToLine />
            </Button>
            <Button className="bg-[#3e9f36]" onClick={exportToExcel}>
              Exporter vers Excel
            </Button>
            <ModificationModal
              title="Modifier les informations"
              description="Apportez des modifications à vos informations ici. Cliquez sur enregistrer lorsque vous avez terminé."
              buttonText="Modifier"
              id={id} // Ensure id is passed correctly
            >
              <SavPieceFormModificationAdmin id={id} />
            </ModificationModal>
            <Button className="bg-red-500" onClick={handleDelete}>
              <Trash className="text-white h-4 w-4 mr-2" />
              Supprimer
            </Button>
          </div>
        </div>

        {userData.map((user) => (
          <div
            key={user._id}
            //ref={pdfRef}
            className="border border-gray-300 p-6 rounded-md"
          >
            <div className="flex justify-start mt-8 items-center border-b-[#d1d5db] border-b lg:p-4">
              <div className="font-bold border-r border-gray-200 pl-2 w-1/2 pb-6 ">
                DATE DE LA DEMANDE:{" "}
              </div>
              <div className="py-2 pl-8 pr-2 w-1/2 pb-6 ">
                {formatDate(user.created_at)}
              </div>
            </div>
            <div className="flex justify-start mt-2 items-center  border-b-[#d1d5db] border-b p-2">
              <div className="font-bold border-r border-gray-200 pl-2 w-1/2 pb-6 uppercase">
                Adresse Retrait:{" "}
              </div>
              <div className="py-2 pl-8 pr-2 w-1/2 pb-6 ">
                {user.adresseRetrait ? user.adresseRetrait : ""}
              </div>
            </div>
            <div className="flex justify-start mt-1 items-center border-b-[#d1d5db] border-b p-4">
              <div className="font-bold border-r border-gray-200 pl-2 w-1/2 pb-6 ">
                SOCIETE:{" "}
              </div>
              <div className="py-2 pl-8 pr-2 w-1/2 pb-6 ">{user.societe}</div>
            </div>
            <div className="flex justify-start mt-1 items-center border-b-[#d1d5db] border-b p-4">
              <div className="font-bold border-r border-gray-200 pl-2 w-1/2 pb-6 ">
                CLIENT:{" "}
              </div>
              <div className="py-2 pl-8 pr-2 w-1/2 pb-6 ">{user.client}</div>
            </div>
            <div className="flex justify-start mt-1 items-center border-b-[#d1d5db] border-b p-4">
              <div className="font-bold border-r border-gray-200 pl-2 w-1/2 pb-6 ">
                MARQUE:{" "}
              </div>
              <div className="py-2 pl-8 pr-2 w-1/2 pb-6 ">{user.marque}</div>
            </div>
            <div className="flex justify-start mt-1 items-center border-b-[#d1d5db] border-b p-4">
              <div className="font-bold border-r border-gray-200 pl-2 w-1/2 pb-6 ">
                NUMERO DE SERIE:{" "}
              </div>
              <div className="py-2 pl-8 pr-2 w-1/2 pb-6 ">
                {user.serieNumber}
              </div>
            </div>
            <div className="flex justify-start mt-1 items-center border-b-[#d1d5db] border-b p-4">
              <div className="font-bold border-r border-gray-200 pl-2 w-1/2 pb-6 ">
                NUMERO DE COMMANDE:{" "}
              </div>
              <div className="py-2 pl-8 pr-2 w-1/2 pb-6 ">
                {user.numeroCommande}
              </div>
            </div>
            <div className="flex justify-start mt-1 items-center border-b-[#d1d5db] border-b p-4">
              <div className="font-bold border-r border-gray-200 pl-2 w-1/2 pb-6 ">
                NOM DE LA PIECE:{" "}
              </div>
              <div className="py-2 pl-8 pr-2 w-1/2 pb-6 ">
                {user.articleName}
              </div>
            </div>
            <div className="flex justify-start mt-1 items-center border-b-[#d1d5db] border-b p-4">
              <div className="font-bold border-r border-gray-200 pl-2 w-1/2 pb-6 ">
                REFERENCE:{" "}
              </div>
              <div className="py-2 pl-8 pr-2 w-1/2 pb-6 ">{user.reference}</div>
            </div>
            <div className="flex justify-start mt-1 items-center border-b-[#d1d5db] border-b p-4">
              <div className="font-bold border-r border-gray-200 pl-2 w-1/2 pb-6 ">
                STOCK DISPO TREMBLAY:{" "}
              </div>
              <div className="py-2 pl-8 pr-2 w-1/2 pb-6 ">
                {user.stockDispoTremblay}
              </div>
            </div>
            <div className="flex justify-start mt-1 items-center border-b-[#d1d5db] border-b p-4">
              <div className="font-bold border-r border-gray-200 pl-2 w-1/2 pb-6 ">
                DATE DE LA COMMANDE:{" "}
              </div>
              <div className="py-2 pl-8 pr-2 w-1/2 pb-6 ">
                {user.dateCommande !== "Invalid Date" &&  user.dateCommande !== "" ? formatDate(user.dateCommande) : ""}
              </div>
            </div>
            <div className="flex justify-start mt-1 items-center border-b-[#d1d5db] border-b p-4">
              <div className="font-bold border-r border-gray-200 pl-2 w-1/2 pb-6 ">
                LIEU DE RECEPTION:{" "}
              </div>
              <div className="py-2 pl-8 pr-2 w-1/2 pb-6 ">
                {user.lieuDuReception}
              </div>
            </div>
            <div className="flex justify-start mt-1 items-center border-b-[#d1d5db] border-b p-4">
              <div className="font-bold border-r border-gray-200 pl-2 w-1/2 pb-6 ">
                PERSONNE QUI PASSE COMMANDE:{" "}
              </div>
              <div className="py-2 pl-8 pr-2 w-1/2 pb-6 ">
                {user.personneQuiPasseCommande}
              </div>
            </div>
            <div className="flex justify-start mt-1 items-center border-b-[#d1d5db] border-b p-4">
              <div className="font-bold border-r border-gray-200 pl-2 w-1/2 pb-6 ">
                DATE DE LIVRAISON PREVUE:{" "}
              </div>
              <div className="py-2 pl-8 pr-2 w-1/2 pb-6 ">
                {user.dateLivraisonPrevue !== "Invalid Date" &&  user.dateLivraisonPrevue !== "" ? formatDate(user.dateLivraisonPrevue) : ""}
              </div>
            </div>
            <div className="flex justify-start mt-1 items-center border-b-[#d1d5db] border-b p-4">
              <div className="font-bold border-r border-gray-200 pl-2 w-1/2 pb-6 ">
                DATE DE RECEPTION DEPOT:{" "}
              </div>
              <div className="py-2 pl-8 pr-2 w-1/2 pb-6 ">
                  {user.dateReceptionDepot !== "Invalid Date" &&  user.dateReceptionDepot !== "" ? formatDate(user.dateReceptionDepot) : ""}
              </div>
            </div>
            <div className="flex justify-start mt-1 items-center border-b-[#d1d5db] border-b p-4">
              <div className="font-bold border-r border-gray-200 pl-2 w-1/2 pb-6 ">
                DATE EXPEDITION ou ENLEVEMENT:{" "}
              </div>
              <div className="py-2 pl-8 pr-2 w-1/2 pb-6 ">
                {user.dateExpedition !== "Invalid Date" &&  user.dateExpedition !== "" ? formatDate(user.dateExpedition) : ""}
              </div>
            </div>
            <div className="flex justify-start mt-1 items-center border-b-[#d1d5db] border-b p-4">
              <div className="font-bold border-r border-gray-200 pl-2 w-1/2 pb-6 ">
                DATE RECEPTION PIECE DEFECTUEUSE:{" "}
              </div>
              <div className="py-2 pl-8 pr-2 w-1/2 pb-6 ">
                {user.dateReceptionPieceDef !== "Invalid Date" &&  user.dateReceptionPieceDef !== "" ? formatDate(user.dateReceptionPieceDef) : ""}
              </div>
            </div>
            <div className="flex justify-start mt-1 items-center border-b-[#d1d5db] border-b p-4">
              <div className="font-bold border-r border-gray-200 pl-2 w-1/2 pb-6 ">
                DATE EXPEDITION DE LA PIECE DEFECTUEUSE:{" "}
              </div>
              <div className="py-2 pl-8 pr-2 w-1/2 pb-6 ">
                {user.dateExpeditionPieceDef !== "Invalid Date" &&  user.dateExpeditionPieceDef !== "" ? formatDate(user.dateExpeditionPieceDef) : ""}
              </div>
            </div>
            <div className="flex justify-start mt-1 items-center border-b-[#d1d5db] border-b p-4">
              <div className="font-bold border-r border-gray-200 pl-2 w-1/2 pb-6 ">
                NUMERO DU DEVIS ECONEGOCE:{" "}
              </div>
              <div className="py-2 pl-8 pr-2 w-1/2 pb-6 ">
                {user.numeroDevisEconegoce}
              </div>
            </div>
            <div className="flex justify-start mt-1 items-center border-b-[#d1d5db] border-b p-4">
              <div className="font-bold border-r border-gray-200 pl-2 w-1/2 pb-6 ">
                DATE DU REGLEMENT:{" "}
              </div>
              <div className="py-2 pl-8 pr-2 w-1/2 pb-6 ">
                {user.dateReglement !== "Invalid Date" &&  user.dateReglement !== "" ? formatDate(user.dateReglement) : ""}
              </div>
            </div>
            <div className="flex justify-start mt-1 items-center border-b-[#d1d5db] border-b p-4">
              <div className="font-bold border-r border-gray-200 pl-2 w-1/2 pb-6 ">
                FACTURE PIECE FOURNISSEUR:{" "}
              </div>
              <div className="py-2 pl-8 pr-2 w-1/2 pb-6 ">
                {user.facturePieceFournisseur}
              </div>
            </div>
            <div className="flex justify-start mt-1 items-center border-b-[#d1d5db] border-b p-4">
              <div className="font-bold border-r border-gray-200 pl-2 w-1/2 pb-6 ">
                AVOIR PIECE FOURNISSEUR:{" "}
              </div>
              <div className="py-2 pl-8 pr-2 w-1/2 pb-6 ">
                {user.avoirPieceFournisseur}
              </div>
            </div>
            <div className="flex justify-start mt-1 items-center border-b-[#d1d5db] border-b p-4">
              <div className="font-bold border-r border-gray-200 pl-2 w-1/2 pb-6 ">
                FACTURE PIECE CLIENT ECONEGOCE:{" "}
              </div>
              <div className="py-2 pl-8 pr-2 w-1/2 pb-6 ">
                {user.facturePieceClientEconegoce}
              </div>
            </div>
            <div className="flex justify-start mt-1 items-center border-b-[#d1d5db] border-b p-4">
              <div className="font-bold border-r border-gray-200 pl-2 w-1/2 pb-6 ">
                REPONSE D EXPERTISE:{" "}
              </div>
              <div className="py-2 pl-8 pr-2 w-1/2 pb-6 ">
                {user.reponseExpertise}
              </div>
            </div>
            <div className="flex justify-start mt-1 items-center border-b-[#d1d5db] border-b p-4">
              <div className="font-bold border-r border-gray-200 pl-2 w-1/2 pb-6 ">
                AVOIR PIECE CLIENT ECONEGOCE:{" "}
              </div>
              <div className="py-2 pl-8 pr-2 w-1/2 pb-6 ">
                {user.avoirPieceClientEconegoce}
              </div>
            </div>
            <div className="flex justify-start mt-1 items-center border-b-[#d1d5db] border-b p-4">
              <div className="font-bold border-r border-gray-200 pl-2 w-1/2 pb-6 ">
                DOSSIER CLOTURE:{" "}
              </div>
              <div className="py-2 pl-8 pr-2 w-1/2 pb-6 ">
                {user.dossierCloture}
              </div>
            </div>
            
            <div className="flex justify-start mt-1 items-center border-b-[#d1d5db] border-b p-4">
              <div className="font-bold border-r border-gray-200 pl-2 w-1/2 pb-6 ">
                Prix:{" "}
              </div>
              <div className="py-2 pl-8 pr-2 w-1/2 pb-6 ">{user.Prix}</div>
            </div>
            <div className="flex justify-start mt-1 items-center border-b-[#d1d5db] border-b p-4">
              <div className="font-bold border-r border-gray-200 pl-2 w-1/2 pb-6 ">
                Quantité:{" "}
              </div>
              <div className="py-2 pl-8 pr-2 w-1/2 pb-6 ">{user.Quantite}</div>
            </div>            
            <div className="flex justify-start mt-1 items-center border-b-[#d1d5db] border-b p-4">
              <div className="font-bold border-r border-gray-200 pl-2 w-1/2 pb-6 ">
                Statut:{" "}
              </div>
              <div className="py-2 pl-8 pr-2 w-1/2 pb-6 ">{user.status}</div>
            </div>
            <div className="flex justify-start mt-1 items-center p-4">
              <div className="font-bold border-r border-gray-200 pl-2 w-1/2 pb-6 ">
                OBSERVATION:{" "}
              </div>
              <div className="py-2 pl-8 pr-2 w-1/2 pb-6 ">
                {user.observation}
              </div>
            </div>
          </div>
        ))}

          <div className={`mt-4 border p-4 rounded-md bg-white ${showDiv ? "" : "hidden"}`} ref={pdfRef}>
            <SavPDFPage data={userData[0]} type="Piece" />
          </div>





      </div>
    </div>
  );
};

export default Page;
