"use client";
import { useState, useEffect } from "react";
import Breadcrumb from "@/components/reusable/BreadCrumb";
import BannerTitle from "@/components/reusable/BannerTitle";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { writeFile, utils } from "xlsx";
import ModificationModal from "@/components/reusable/ModificationModal";
import { SavInterventionFormModificationAdmin } from "@/components/auth/sav-intervention-modification-admin";
//import SavPDFPage from "@/components/pdf/Sav/PDFPage";

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
  nDeTicket: string;
  dateLivraisonPrevue: string;
  dateDinterventionPrevut: string;
  dateDeLaDemande: string;
  dateExpedition: string;
  dateReceptionPieceDef: string;
  dateExpeditionPieceDef: string;
  numeroDevisEconegoce: string;
  dateDuRapport: string;
  facturePieceFournisseur: string;
  devisFournisseur: string;
  facturePieceClientEconegoce: string;
  dateReglement: string;
  factureEconegoce: string;
  avoirPieceFournisseur: string;
  dateReceptionDepot: string;
  reponseExpertise: string;
  avoirPieceClientEconegoce: string;
  dossierCloture: string;
  devisEconegoce: string;
  Quantite: number;
  Prix: number;
  status: string;
  observation: string;
  factureFournisseur: any;
  bonDeCommandeEconegoce: any;
  onSelectCard: (id: string) => void; // New prop
}

const Page = () => {
  const searchParams = useSearchParams();
  const [userData, setUserData] = useState<CardProps[]>([]);
  //const pdfRef = useRef<HTMLDivElement>(null);
  const id = searchParams?.get("search");
  //const [showDiv, setShowDiv] = useState<boolean>(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch(
        `/api/intervention/fetchPieces?page=1&id=${id}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      const data = await response.json();
      console.log("data.pieces", data.interventions);
      setUserData(data.interventions);
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

  /*const downloadPDF = async () => {
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
  
    // Calculate x position to center the image with padding
    const xPos = 2; // Left padding
    const yPos = 10; // Initial top padding
  
    pdf.addImage(imgData, "PNG", xPos, yPos, imgWidth, adjustedImgHeight);
  
    const contentHeight = adjustedImgHeight + 20; // Image height + padding
    const pagesRequired = Math.ceil(contentHeight / pdfHeight);
  
    // If there are additional pages needed for the content
    for (let i = 1; i < pagesRequired; i++) {
      pdf.addPage();
      pdf.addImage(
        imgData,
        "PNG",
        xPos,
        -i * pdfHeight + yPos,
        imgWidth,
        adjustedImgHeight
      );
    }
  
    // Add the observation section on a new page if there are observations
    {/*const observation = userData.map((user) => user.observation).join("\n\n");
    if (observation.trim()) {
      pdf.addPage();
      pdf.setFontSize(14);
      pdf.text(observation, pdfWidth / 2, 20, {
        align: "center",
        maxWidth: pdfWidth - 40,
      });
    }
  
    pdf.save(
      `sav-piece-${formatDate(userData[0]?.created_at)}-${
        userData[0]?.marque
      }-${userData[0]?.articleName}.pdf`
    );
  
    // Hide the div after PDF generation
    setShowDiv(false);
  };*/

  console.log("userData", userData);

  const exportToExcel = () => {
    const data = userData.map((user) => ({
      "DATE DE LA DEMANDE": formatDate(user.dateDeLaDemande),
      "SOCIETE": user.societe,
      "CLIENT": user.client,
      "MARQUE": user.marque,
      "NUMERO DE SERIE": user.serieNumber,
      "N° DE TICKET": user.nDeTicket,
      "N° DEVIS ECONEGOCE": user.devisEconegoce,
      "N°DEVIS FOURNISSEUR": user.devisFournisseur,
      "DATE DE L INTERVENTION PREVUE": formatDate(user.dateDinterventionPrevut),
      "DATE DU RAPPORT": formatDate(user.dateDuRapport),
      "FACTURE  FOURNISSEUR": user.factureFournisseur[0],
      "BON DE COMMANDE ECONEGOCE": user.bonDeCommandeEconegoce,
      "FACTURE ECONEGOCE": user.factureEconegoce,
      "OBSERVATION": user.observation,
    }));

    const ws = utils.json_to_sheet(data);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Feuil1");
    const currentDate = new Date();
    const formattedDate = currentDate
      .toLocaleDateString("fr-FR")
      .split("/")
      .join("-");
    writeFile(
      wb,
      `Liste-intervention-${formattedDate}-${userData[0].societe}-export-.xlsx.xlsx`
    );
  };

  const calculateDaysBetween = (dateString: string) => {
    if (!dateString) return "";
    const dateObject = new Date(dateString);
    const today = new Date();
    const timeDifference = today.getTime() - dateObject.getTime();
    const daysDifference = Math.floor(timeDifference / (1000 * 3600 * 24));
    return daysDifference;
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(
       `${process.env.NEXT_PUBLIC_API_URL}/intervention/delete`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ _id: id }), // Send ID in the body as JSON
        }
      );

      if (response.ok) {
        window.location.href = "/admin/sav/liste-intervention";
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
      <BannerTitle tile={"DETAIL DE L'INTERVENTION"} paragraph={""} />
      <Breadcrumb
        paths={[
          { name: "Accueil", url: "/admin/mon-compte" },
          { name: "sav", url: "/admin/sav" },
          {
            name: "Liste de Suivi des interventions",
            url: "/admin/sav/liste-intervention",
          },
          {
            name: "Détail de l'intervention",
            url: "#",
          },
        ]}
      />
      <div className="lg:pt-10 p-10 max-w-[1280px] mx-auto  mt-10 rounded-md mb-10">
        <div className="flex justify-between gap-4 lg:flex-row flex-col">
          <div className="flex justify-start lg:gap-4 ">
            {userData[0] !== undefined && (
              <h4 className="items-center">
                Demande faite depuis le {formatDate(userData[0]?.created_at)} (
                {calculateDaysBetween(userData[0]?.created_at)} jours)
              </h4>
            )}
          </div>

          <div className="flex justify-end mb-10 gap-4">
            {/*<Button className="bg-[#3e9f36]" onClick={downloadPDF}>
              <ArrowDownToLine />
            </Button>*/}
            <Button className="bg-[#3e9f36]" onClick={exportToExcel}>
              Exporter vers Excel
            </Button>
            <ModificationModal
              title="Modifier les informations"
              description="Apportez des modifications à vos informations ici. Cliquez sur enregistrer lorsque vous avez terminé."
              buttonText="Modifier"
              id={id} // Ensure id is passed correctly
            >
              <SavInterventionFormModificationAdmin id={id} />
            </ModificationModal>
            <Button className="bg-red-500" onClick={handleDelete}>
              <Trash className="text-white h-4 w-4 mr-2" />
              Supprimer
            </Button>
          </div>
        </div>

        {userData.map((user) => (
          <div key={user._id} className="border border-gray-300 p-6 rounded-md">
            <div className="flex justify-start mt-8 items-center border-b-[#d1d5db] border-b lg:p-4">
              <div className="font-bold border-r border-gray-200 pl-2 w-1/2 pb-6 ">
                DATE DE LA DEMANDE:{" "}
              </div>
              <div className="py-2 pl-8 pr-2 w-1/2 pb-6 ">
                {formatDate(user.dateDeLaDemande)}
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
                NUMERO DE TICKET:{" "}
              </div>
              <div className="py-2 pl-8 pr-2 w-1/2 pb-6 ">{user.nDeTicket}</div>
            </div>
            <div className="flex justify-start mt-1 items-center border-b-[#d1d5db] border-b p-4">
              <div className="font-bold border-r border-gray-200 pl-2 w-1/2 pb-6 ">
                DEVIS Econegoce:{" "}
              </div>
              <div className="py-2 pl-8 pr-2 w-1/2 pb-6 ">
                {user.devisEconegoce}
              </div>
            </div>
            <div className="flex justify-start mt-1 items-center border-b-[#d1d5db] border-b p-4">
              <div className="font-bold border-r border-gray-200 pl-2 w-1/2 pb-6 ">
                DEVIS FOURNISSEUR:{" "}
              </div>
              <div className="py-2 pl-8 pr-2 w-1/2 pb-6 ">
                {user.devisFournisseur}
              </div>
            </div>
            <div className="flex justify-start mt-1 items-center border-b-[#d1d5db] border-b p-4">
              <div className="font-bold border-r border-gray-200 pl-2 w-1/2 pb-6 ">
                BON DE COMMANDE ECONGEGOCE:{" "}
              </div>
              <div className="py-2 pl-8 pr-2 w-1/2 pb-6 ">
                {user.bonDeCommandeEconegoce}
              </div>
            </div>
            <div className="flex justify-start mt-1 items-center border-b-[#d1d5db] border-b p-4">
              <div className="font-bold border-r border-gray-200 pl-2 w-1/2 pb-6 ">
                FACTURE FOURNISSEUR:{" "}
              </div>
              <div className="py-2 pl-8 pr-2 w-1/2 pb-6 ">
                {user.factureFournisseur ?  user.factureFournisseur : "-"}
              </div>
            </div>

            <div className="flex justify-start mt-1 items-center border-b-[#d1d5db] border-b p-4">
              <div className="font-bold border-r border-gray-200 pl-2 w-1/2 pb-6 ">
                DATE D&apos;INTERVENTION PREVU:{" "}
              </div>
              <div className="py-2 pl-8 pr-2 w-1/2 pb-6 ">
                {user.dateDinterventionPrevut !== "Invalid Date" &&
                user.dateDinterventionPrevut !== ""
                  ? formatDate(user.dateDinterventionPrevut)
                  : ""}
              </div>
            </div>
            <div className="flex justify-start mt-1 items-center border-b-[#d1d5db] border-b p-4">
              <div className="font-bold border-r border-gray-200 pl-2 w-1/2 pb-6 ">
                DATE DU RAPPORT:{" "}
              </div>
              <div className="py-2 pl-8 pr-2 w-1/2 pb-6 ">
                {user.dateDuRapport !== "Invalid Date" &&
                user.dateDuRapport !== ""
                  ? formatDate(user.dateDuRapport)
                  : ""}
              </div>
            </div>
            <div className="flex justify-start mt-1 items-center border-b-[#d1d5db] border-b p-4">
              <div className="font-bold border-r border-gray-200 pl-2 w-1/2 pb-6 ">
                FACTURE Econegoce:{" "}
              </div>
              <div className="py-2 pl-8 pr-2 w-1/2 pb-6 ">
                {user.factureEconegoce}
              </div>
            </div>
            <div className="flex justify-start mt-1 items-center  p-4">
              <div className="font-bold border-r border-gray-200 pl-2 w-1/2 pb-6 ">
                Observation:{" "}
              </div>
              <div className="py-2 pl-8 pr-2 w-1/2 pb-6 ">
                {user.observation}
              </div>
            </div>
          </div>
        ))}

        {/*<div
          className={`mt-4 rounded-md bg-white ${showDiv ? "" : "hidden"}`}
          ref={pdfRef}
        >
          <SavPDFPage data={userData[0]} type="SAV Piece" />
        </div>*/}
      </div>
    </div>
  );
};

export default Page;
