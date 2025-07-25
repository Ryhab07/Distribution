"use client";
import { useState, useEffect, useRef } from "react";
import Breadcrumb from "@/components/reusable/BreadCrumb";
import BannerTitle from "@/components/reusable/BannerTitle";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowDownToLine} from "lucide-react";
//import Image from "next/image";
import { writeFile, utils } from "xlsx";
import ModificationModal from "@/components/reusable/ModificationModal";
import { SavMachinesFormModificationAdmin } from "@/components/auth/sav-machine-modification-admin";
import SavPDFPage from "@/components/pdf/Sav/PDFPage";
import { GenericDeleteAlertDialog } from "@/components/reusable/DeletePopup";

interface CardProps {
  [key: string]: any;

  onSelectCard: (id: string) => void; // New prop
}

const Page = () => {
  const [imageSrc, setImageSrc] = useState("");
  const searchParams = useSearchParams();
  const [filteredUserData, setFilteredUserData] = useState<CardProps[]>([]);
  const [userData, setUserData] = useState<CardProps[]>([]);
  const pdfRef = useRef<HTMLDivElement>(null);
  const id = searchParams?.get("search");
  console.log("filteredUserData", filteredUserData);
  const [showDiv, setShowDiv] = useState<boolean>(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch(
        `/api/machines/fetchMachines?page=1&id=${id}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      const data = await response.json();
      setUserData(data.pieces);
      setFilteredUserData(data.pieces);
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

    const [html2canvas, jsPDF] = await Promise.all([
      import("html2canvas"),
      import("jspdf"),
    ]);

    const pdf = new jsPDF.default("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const canvas = await html2canvas.default(pdfRef.current);
    const imgData = canvas.toDataURL("image/png");

    const imgProps = pdf.getImageProperties(imgData);
    const imgWidth = pdfWidth - 40; // Adjusted width for a narrower PDF (20mm padding on each side)
    const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

    const position = 8; // Initial top padding
    pdf.addImage(imgData, "PNG", 20, position, imgWidth, imgHeight);

    const contentHeight = imgHeight; // Image height + padding
    const pagesRequired = Math.ceil(contentHeight / pdfHeight);

    // If there are additional pages needed for the content
    for (let i = 1; i < pagesRequired; i++) {
      pdf.addPage();
      pdf.addImage(
        imgData,
        "PNG",
        20,
        -i * pdfHeight + position,
        imgWidth,
        imgHeight
      );
    }

    // Add the observation section on a new page
    const observation = userData.map((user) => user.observation).join("\n\n");

    pdf.setFontSize(14);
    pdf.text(observation, pdfWidth / 2, 20, {
      align: "center",
      maxWidth: pdfWidth - 40,
    });

    pdf.save(
      `sav-retour-machine-${formatDate(userData[0]?.created_at)}-${
        userData[0]?.marque
      }-${userData[0]?.modele}-${userData[0]?.categorieArticle}.pdf`
    );
  };*/

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

    // Calculate x position to center the image with padding
    const xPos = 2; // Left padding
    const yPos = 10; // Initial top padding

    const contentHeight = adjustedImgHeight + 20; // Image height + padding
    const pagesRequired = Math.ceil(contentHeight / pdfHeight);

    // Loop to add content to each required page
    for (let i = 0; i < pagesRequired; i++) {
      if (i > 0) pdf.addPage(); // Add a new page if not the first page
      pdf.addImage(
        imgData,
        "PNG",
        xPos,
        -i * pdfHeight + yPos,
        imgWidth,
        adjustedImgHeight
      );

      // Add footer only on the last page
      if (i === pagesRequired - 1) {
        pdf.setFontSize(6); // Set font size to 8px for footer
        pdf.text(
          "econegoce.com - Société par actions simplifiée Capital social de 500 000 € - N° SIRET : 84927879100017 - N° identif. intracomm. : FR47849278791 - 4690Z",
          pdfWidth / 2,
          pdfHeight - 10,
          { align: "center" }
        );
      }
    }

    pdf.save(
      `sav-retour-machine-${formatDate(userData[0]?.created_at)}-${
        userData[0]?.marque
      }-${userData[0]?.modele}-${userData[0]?.categorieArticle}.pdf`
    );

    // Hide the div after PDF generation
    setShowDiv(false);
  };

  const exportToExcel = () => {
    const data = userData.map((user) => ({
      "DATE DE LA DEMANDE": formatDate(user.created_at),
      INSTALLATEUR: user.installateur,
      CLIENT: user.client,
      "CAUSE SAV": user.causeSAV,
      MARQUE: user.marque,
      "N° ARTICLE": user.articleNumber,
      MODELE: user.modele,
      "CATEGORIE ARTICLE": user.categorieArticle,
      "N° SERIE": user.serieNumber,
      QUANTITE: user.quantite,
      "N° BL": user.numeroBlOuFacture,
      ACCORD: user.accord,
      "DATE RETOUR DEPOT": formatDate(user.dateRetourFournisseur),
      "DATE DEMANDE AVOIR FOURNISSEUR": formatDate(
        user.dateDemandeAvoirFournisseur
      ),
      "DATE RECEPTION AVOIR FOURNISSEUR": formatDate(
        user.dateReceptionAvoirFournisseur
      ),
      "STATUT FOURNISSEUR": user.statutFournisseur,
      "AVOIR FOURNISSEUR": user.avoirFournisseurNumber,
      "DATE AVOIR INSTALLATEUR": formatDate(user.dateAvoirInstallateur),
      "N° AVOIR INSTALLATEUR": user.avoirInstallateurNumber,
      "NOUVEAU N° BL": user.nouveauBlNumber,
      "DATE RETOUR FOURNISSEUR": formatDate(user.dateRetourFournisseur),
      "PRIX ACHAT": user.prixAchat,
      "PRIX VENTE": user.prixVente,
    }));

    const ws = utils.json_to_sheet(data);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Feuil1");
    writeFile(
      wb,
      `sav-retour-machine-${formatDate(userData[0]?.created_at)}-${
        userData[0]?.marque
      }-${userData[0]?.modele}-${userData[0]?.categorieArticle}.xlsx`
    );
  };

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await fetch("/api/images", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch image");
        }
        const imageData = await response.blob();
        setImageSrc(URL.createObjectURL(imageData));
      } catch (error) {
        console.error("Error fetching image:", error);
      }
    };

    fetchImage();

    return () => {
      // Clean up when component unmounts
      URL.revokeObjectURL(imageSrc);
    };
  }, []);

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
        `${process.env.NEXT_PUBLIC_API_URL}/machines/delete`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ _id: id }), // Send ID in the body as JSON
        }
      );

      if (response.ok) {
        window.location.href = "/admin/sav/liste-sav-machine";
      }

      if (!response.ok) {
        throw new Error("Failed to delete piece");
      }
    } catch (error) {
      console.error("Error deleting piece:", error);
      // Optionally, handle error (e.g., show an error message)
    }
  };

  // Component to handle the image and fallback behavior
  /*const ImageWithFallback = ({ imagePath, altText }) => {
    const [hasError, setHasError] = useState(false);

    return hasError ? (
      <div className="text-red-500">
        L&lsquo;image que vous avez téléchargée est trop volumineuse.
      </div>
    ) : (
      <Image
        src={imagePath}
        width={200}
        height={200}
        alt={altText}
        onError={() => setHasError(true)} // Set the error flag to true
      />
    );
  };*/

  return (
    <div className="min-h-screen flex-col justify-between lg:pt-[70px] pt-[60px] ">
      <BannerTitle tile={"DETAIL RETOUR MACHINE"} paragraph={""} />
      <Breadcrumb
        paths={[
          { name: "Accueil", url: "/admin/mon-compte" },
          { name: "sav", url: "/admin/sav" },
          {
            name: "Liste de Retour Machine",
            url: "/admin/sav/liste-sav-machine",
          },
          {
            name: "Détail Retour Machine",
            url: "#",
          },
        ]}
      />
      <div className="lg:pt-10 p-10 max-w-[1280px] mx-auto   mt-10  mb-10">
        <div className="flex lg:flex-row flex-col justify-between gap-4 ">
          <div className="flex justify-start lg:flex-row flex-col gap-4 ">
            {userData[0] !== undefined && (
              <h4 className="items-center">
                Ticket ouvert depuis le {formatDate(userData[0]?.created_at)} (
                {calculateDaysBetween(userData[0]?.created_at)} jours) -{" "}
                {userData[0]?.status}
              </h4>
            )}
          </div>

          <div className="flex lg:flex-row flex-col justify-end gap-4 items-center">
            <Button
              className="bg-[#3e9f36] w-full lg:w-auto "
              onClick={downloadPDF}
            >
              <ArrowDownToLine />
            </Button>
            <Button
              className="bg-[#3e9f36] w-full lg:w-auto"
              onClick={exportToExcel}
            >
              Exporter vers Excel
            </Button>
            <ModificationModal
              title="Modifier les informations"
              description="Apportez des modifications à vos informations ici. Cliquez sur enregistrer lorsque vous avez terminé."
              buttonText="Modifier"
              id={id} // Ensure id is passed correctly
            >
              <SavMachinesFormModificationAdmin id={id} />
            </ModificationModal>
            <div className="!mt-[-2px]">
                        <GenericDeleteAlertDialog
                          id={id}
                          type="machine"
                          onDelete={handleDelete}
                        />
                        </div>
          </div>
        </div>

        {userData.map((user) => (
          <div
            key={user._id}
            //ref={pdfRef}
            className="border border-gray-300 mt-10 rounded-md lg:p-10 p-4"
          >
            <div className="border-b border-gray-200 w-full pb-4 flex flex-wrap">
              <div className="font-bold lg:border-r lg:border-gray-200 lg:pl-2 pl-0 lg:w-1/2 w-full pb-6">
                Photos et documents :{" "}
              </div>
              <div className="flex flex-col pl-6 pr-2">
                {user.picture2.map((picture, index) => {
                  console.log("Picture filename:", picture);
                  const documentName = `Document BL ou Facture ${index + 1}`;
                  const imagePath = `/api/uploads/${encodeURIComponent(
                    picture
                  )}`;

                  return (
                    <a
                      key={index}
                      href={imagePath}
                      className="m-2 text-black hover:underline flex gap-4"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {documentName}
                    </a>
                  );
                })}
                {user.picture1.map((picture, index) => {
                  console.log("Picture filename:", picture);
                  const documentName = `Photo de la machine ${index + 1}`;
                  const imagePath = `/api/uploads/${encodeURIComponent(
                    picture
                  )}`;

                  return (
                    <a
                      key={index}
                      href={imagePath}
                      className="m-2 text-black hover:underline flex gap-4"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {documentName}
                    </a>
                  );
                })}
              </div>
            </div>
            <div className="flex justify-start lg:flex-row flex-col mt-1 items-center border-b-[#d1d5db] border-b p-4">
              <div className="font-bold lg:border-r lg:border-gray-200 lg:pl-2 lg:w-1/2 w-full pb-6 ">
                Numéro de retour RV:{" "}
              </div>
              <div className="py-2 lg:pl-8 pr-2 lg:w-1/2 w-full pb-6 ">
                {user.numeroBlOuFacture}
              </div>
            </div>
            <div className="flex justify-start lg:flex-row flex-col mt-2 items-center  border-b-[#d1d5db] border-b p-2">
              <div className="font-bold lg:border-r lg:border-gray-200 lg:pl-2 pl-0 lg:w-1/2 w-full pb-6">
                DATE DE LA DEMANDE:{" "}
              </div>
              <div className="lg:py-2 lg:pl-8 lg:pr-2 lg:w-1/2 w-full pb-6 ">
                {formatDate(user.created_at)}
              </div>
            </div>
            <div className="flex justify-start lg:flex-row flex-col mt-2 items-center  border-b-[#d1d5db] border-b p-2">
              <div className="font-bold lg:border-r lg:border-gray-200 lg:pl-2 pl-0 lg:w-1/2 w-full pb-6 uppercase">
                Adresse Retrait:{" "}
              </div>
              <div className=" lg:py-2 lg:pl-8 lg:pr-2 lg:w-1/2 w-full pb-6 ">
                {user.adresseRetrait ? user.adresseRetrait : ""}
              </div>
            </div>
            <div className="flex justify-start lg:flex-row flex-col mt-1 items-center border-b-[#d1d5db] border-b p-2 text-left">
              <div className="font-bold lg:border-r-2 lg:border-gray-200 lg:pl-2 pl-0 lg:w-1/2 w-full pb-6">
                INSTALLATEUR:{" "}
              </div>
              <div className=" lg:py-2 lg:pl-8 lg:pr-2 lg:w-1/2 w-full pb-6">
                {user.installateur}
              </div>
            </div>
            <div className="flex justify-start lg:flex-row flex-col mt-1 items-center border-b-[#d1d5db] border-b p-2">
              <div className="font-bold lg:border-r lg:border-gray-200 lg:pl-2 pl-0 lg:w-1/2 w-full pb-6 ">
                CLIENT:{" "}
              </div>
              <div className=" lg:py-2 lg:pl-8 lg:pr-2 lg:w-1/2 w-full pb-6 ">
                {user.client}
              </div>
            </div>
            <div className="flex justify-start lg:flex-row flex-col mt-1 items-center border-b-[#d1d5db] border-b p-2">
              <div className="font-bold lg:border-r lg:border-gray-200 lg:pl-2 pl-0 lg:w-1/2 w-full pb-6 ">
                CAUSE SAV :{" "}
              </div>
              <div className=" lg:py-2 lg:pl-8 lg:pr-2 lg:w-1/2 w-full pb-6 ">
                {user.causeSAV}
              </div>
            </div>
            <div className="flex justify-start lg:flex-row flex-col mt-1 items-center border-b-[#d1d5db] border-b p-2">
              <div className="font-bold lg:border-r lg:border-gray-200 lg:pl-2 pl-0 lg:w-1/2 w-full pb-6 ">
                MARQUE:{" "}
              </div>
              <div className=" lg:py-2 lg:pl-8 lg:pr-2 lg:w-1/2 w-full pb-6 ">
                {user.marque}
              </div>
            </div>
            <div className="flex justify-start lg:flex-row flex-col mt-1 items-center border-b-[#d1d5db] border-b p-2">
              <div className="font-bold lg:border-r lg:border-gray-200 lg:pl-2 pl-0 lg:w-1/2 w-full pb-6 ">
                N° ARTICLE :{" "}
              </div>
              <div className=" lg:py-2 lg:pl-8 lg:pr-2 lg:w-1/2 w-full pb-6 ">
                {user.articleNumber}
              </div>
            </div>
            <div className="flex justify-start lg:flex-row flex-col mt-1 items-center border-b-[#d1d5db] border-b p-2">
              <div className="font-bold lg:border-r lg:border-gray-200 lg:pl-2 pl-0 lg:w-1/2 w-full pb-6 ">
                MODELE:{" "}
              </div>
              <div className=" lg:py-2 lg:pl-8 lg:pr-2 lg:w-1/2 w-full pb-6 ">
                {user.modele}
              </div>
            </div>
            <div className="flex justify-start lg:flex-row flex-col mt-1 items-center border-b-[#d1d5db] border-b p-2">
              <div className="font-bold lg:border-r lg:border-gray-200 lg:pl-2 pl-0 lg:w-1/2 w-full pb-6 ">
                CATEGORIE ARTICLE :{" "}
              </div>
              <div className=" lg:py-2 lg:pl-8 lg:pr-2 lg:w-1/2 w-full pb-6 ">
                {user.categorieArticle}
              </div>
            </div>
            <div className="flex justify-start lg:flex-row flex-col mt-1 items-center border-b-[#d1d5db] border-b p-2">
              <div className="font-bold lg:border-r lg:border-gray-200 lg:pl-2 pl-0 lg:w-1/2 w-full pb-6 ">
                N° SERIE :{" "}
              </div>
              <div className=" lg:py-2 lg:pl-8 lg:pr-2 lg:w-1/2 w-full pb-6 ">
                {user.serieNumber}
              </div>
            </div>
            <div className="flex justify-start lg:flex-row flex-col mt-1 items-center border-b-[#d1d5db] border-b p-2">
              <div className="font-bold lg:border-r lg:border-gray-200 lg:pl-2 pl-0 lg:w-1/2 w-full pb-6 ">
                QUANTITE:{" "}
              </div>
              <div className=" lg:py-2 lg:pl-8 lg:pr-2 lg:w-1/2 w-full pb-6 ">
                {user.quantite}
              </div>
            </div>
            <div className="flex justify-start lg:flex-row flex-col mt-1 items-center border-b-[#d1d5db] border-b p-2">
              <div className="font-bold lg:border-r lg:border-gray-200 lg:pl-2 pl-0 lg:w-1/2 w-full pb-6 ">
                N° BL :{" "}
              </div>
              <div className=" lg:py-2 lg:pl-8 lg:pr-2 lg:w-1/2 w-full pb-6 ">
                {user.numeroBlOuFacture}
              </div>
            </div>

            <div className="flex justify-start lg:flex-row flex-col mt-1 items-center border-b-[#d1d5db] border-b p-2">
              <div className="font-bold lg:border-r lg:border-gray-200 lg:pl-2 pl-0 lg:w-1/2 w-full pb-6 ">
                ACCORD:{" "}
              </div>
              <div className=" lg:py-2 lg:pl-8 lg:pr-2 lg:w-1/2 w-full pb-6 ">
                {user.accord}
              </div>
            </div>
            <div className="flex justify-start lg:flex-row flex-col mt-1 items-center border-b-[#d1d5db] border-b p-2">
              <div className="font-bold lg:border-r lg:border-gray-200 lg:pl-2 pl-0 lg:w-1/2 w-full pb-6 ">
                DATE RETOUR DEPOT :{" "}
              </div>
              <div className=" lg:py-2 lg:pl-8 lg:pr-2 lg:w-1/2 w-full pb-6 ">
                {user.dateRetourDepot && user.dateRetourDepot !== "Invalid Date"
                  ? formatDate(user.dateRetourDepot)
                  : ""}
              </div>
            </div>
            <div className="flex justify-start lg:flex-row flex-col mt-1 items-center border-b-[#d1d5db] border-b p-2">
              <div className="font-bold lg:border-r lg:border-gray-200 lg:pl-2 pl-0 lg:w-1/2 w-full pb-6 ">
                DATE DEMANDE AVOIR FOURNISSEUR :
              </div>
              <div className=" lg:py-2 lg:pl-8 lg:pr-2 lg:w-1/2 w-full pb-6 ">
                {user.dateDemandeAvoirFournisseur !== "" &&
                user.dateDemandeAvoirFournisseur !== "Invalid Date"
                  ? formatDate(user.dateDemandeAvoirFournisseur)
                  : " "}
              </div>
            </div>
            <div className="flex justify-start lg:flex-row flex-col mt-1 items-center border-b-[#d1d5db] border-b p-2">
              <div className="font-bold lg:border-r lg:border-gray-200 lg:pl-2 pl-0 lg:w-1/2 w-full pb-6 ">
                DATE RECEPTION AVOIR FOURNISSEUR :{" "}
              </div>
              <div className=" lg:py-2 lg:pl-8 lg:pr-2 lg:w-1/2 w-full pb-6 ">
                {user.dateReceptionAvoirFournisseur !== "" &&
                user.dateReceptionAvoirFournisseur !== "Invalid Date"
                  ? formatDate(user.dateReceptionAvoirFournisseur)
                  : " "}
              </div>
            </div>
            <div className="flex justify-start lg:flex-row flex-col mt-1 items-center border-b-[#d1d5db] border-b p-2">
              <div className="font-bold lg:border-r lg:border-gray-200 lg:pl-2 pl-0 lg:w-1/2 w-full pb-6 ">
                STATUT FOURNISSEUR :{" "}
              </div>
              <div className=" lg:py-2 lg:pl-8 lg:pr-2 lg:w-1/2 w-full pb-6 ">
                {user.statutFournisseur}
              </div>
            </div>
            <div className="flex justify-start lg:flex-row flex-col mt-1 items-center border-b-[#d1d5db] border-b p-2">
              <div className="font-bold lg:border-r lg:border-gray-200 lg:pl-2 pl-0 lg:w-1/2 w-full pb-6 ">
                N° AVOIR FOURNISSEUR :{" "}
              </div>
              <div className=" lg:py-2 lg:pl-8 lg:pr-2 lg:w-1/2 w-full pb-6 ">
                {user.avoirFournisseurNumber}
              </div>
            </div>
            <div className="flex justify-start lg:flex-row flex-col mt-1 items-center border-b-[#d1d5db] border-b p-2">
              <div className="font-bold lg:border-r lg:border-gray-200 lg:pl-2 pl-0 lg:w-1/2 w-full pb-6 ">
                DATE AVOIR INSTALLATEUR :{" "}
              </div>
              <div className=" lg:py-2 lg:pl-8 lg:pr-2 lg:w-1/2 w-full pb-6 ">
                {user.dateAvoirInstallateur !== "" &&
                user.dateAvoirInstallateur !== "Invalid Date"
                  ? formatDate(user.dateAvoirInstallateur)
                  : " "}
              </div>
            </div>
            <div className="flex justify-start lg:flex-row flex-col mt-1 items-center border-b-[#d1d5db] border-b p-2">
              <div className="font-bold lg:border-r lg:border-gray-200 lg:pl-2 pl-0 lg:w-1/2 w-full pb-6 ">
                N° AVOIR INSTALLATEUR :{" "}
              </div>
              <div className=" lg:py-2 lg:pl-8 lg:pr-2 lg:w-1/2 w-full pb-6 ">
                {user.avoirInstallateurNumber}
              </div>
            </div>
            <div className="flex justify-start lg:flex-row flex-col mt-1 items-center border-b-[#d1d5db] border-b p-2">
              <div className="font-bold lg:border-r lg:border-gray-200 lg:pl-2 pl-0 lg:w-1/2 w-full pb-6 ">
                NOUVEAU N° BL :{" "}
              </div>
              <div className=" lg:py-2 lg:pl-8 lg:pr-2 lg:w-1/2 w-full pb-6 ">
                {user.nouveauBlNumber}
              </div>
            </div>
            <div className="flex justify-start lg:flex-row flex-col mt-1 items-center border-b-[#d1d5db] border-b p-2">
              <div className="font-bold lg:border-r lg:border-gray-200 lg:pl-2 pl-0 lg:w-1/2 w-full pb-6 ">
                DATE RETOUR FOURNISSEUR :{" "}
              </div>
              <div className=" lg:py-2 lg:pl-8 lg:pr-2 lg:w-1/2 w-full pb-6 ">
                {user.dateRetourFournisseur !== "" &&
                user.dateRetourFournisseur !== "Invalid Date"
                  ? formatDate(user.dateRetourFournisseur)
                  : " "}
              </div>
            </div>
            <div className="flex justify-start lg:flex-row flex-col mt-1 items-center border-b-[#d1d5db] border-b p-2">
              <div className="font-bold lg:border-r lg:border-gray-200 lg:pl-2 pl-0 lg:w-1/2 w-full pb-6 ">
                PRIX D&apos;ACHAT HT :{" "}
              </div>
              <div className=" lg:py-2 lg:pl-8 lg:pr-2 lg:w-1/2 w-full pb-6 ">
                {user.prixAchat}
              </div>
            </div>
            <div className="flex justify-start lg:flex-row flex-col mt-1 items-center border-b-[#d1d5db] border-b  p-2">
              <div className="font-bold lg:border-r lg:border-gray-200 lg:pl-2 pl-0 lg:w-1/2 w-full pb-6 ">
                PRIX DE VENTE :{" "}
              </div>
              <div className=" lg:py-2 lg:pl-8 lg:pr-2 lg:w-1/2 w-full pb-6 ">
                {user.prixVente}
              </div>
            </div>
            <div className="flex justify-start lg:flex-row flex-col mt-2 items-center border-b-[#d1d5db] border-b  p-2">
              <div className="font-bold lg:border-r lg:border-gray-200 lg:pl-2 pl-0 lg:w-1/2 w-full pb-6 uppercase">
              Observation:{" "}
              </div>
              <div className="lg:py-2 lg:pl-8 lg:pr-2 lg:w-1/2 w-full pb-6 ">
                {user.observation}
              </div>
            </div>
            <div className="flex justify-start lg:flex-row flex-col mt-2 items-center   p-2">
              <div className="font-bold lg:border-r lg:border-gray-200 lg:pl-2 pl-0 lg:w-1/2 w-full pb-6 uppercase">
              Numéro Ticket Zendesk:{" "}
              </div>
              <div className="lg:py-2 lg:pl-8 lg:pr-2 lg:w-1/2 w-full pb-6 ">
                {user.zendesk}
              </div>
            </div>
            {/*<div className="flex justify-start lg:flex-row flex-col mt-1 items-center border-t-[#d1d5db] border-t p-4">
              <div className="font-bold lg:border-r lg:border-gray-200 lg:pl-2 pl-0 lg:w-1/2 w-full pb-6 ">
                Statut:{" "}
              </div>
              <div className=" lg:py-2 lg:pl-8 lg:pr-2 lg:w-1/2 w-full pb-6 ">
                {user.status}
              </div>
            </div>*/}
          </div>
        ))}

        <div
          className={`mt-4 rounded-md bg-white ${showDiv ? "" : "hidden"}`}
          ref={pdfRef}
        >
          <SavPDFPage data={userData[0]} type="SAV MACHINE" />
        </div>
      </div>
    </div>
  );
};

export default Page;
