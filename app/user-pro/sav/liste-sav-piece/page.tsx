"use client";
import { useState, useEffect } from "react";
import Breadcrumb from "@/components/reusable/BreadCrumb";
import BannerTitle from "@/components/reusable/BannerTitle";
import PaginationCategory from "@/components/reusable/Pagination";
import FilterBar from "@/components/reusable/FilterBar";
import PieceCard from "@/components/reusable/pieceCard";
import PieceSearchBox from "@/components/reusable/pieceSearchBox";
import PieceCardCol from "@/components/reusable/PieceCardCol";
import { FilterCombobox } from "@/components/reusable/filtersCombobox";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon, FileUp } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
//import AddButton from "@/components/reusable/AddButton";
import { utils, writeFile } from "xlsx";

interface CardProps {
  _id: string;
  created_at: string;
  societe: string;
  client: string;
  marque: string;
  articleName: string;
  serieNumber: string;
  type: string;
  onSelectCard: (id: string) => void; // New prop
}

const Page = () => {
  const [filteredUserData, setFilteredUserData] = useState<CardProps[]>([]);
  const [userData, setUserData] = useState<CardProps[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [affichage, setAffichage] = useState<string>("grid");
  const [uniqueSocietes, setUniqueSocietes] = useState<string[]>([]);
  const [uniqueMarques, setUniqueMarques] = useState<string[]>([]);
  const [uniqueSerieNumbers, setUniqueSerieNumbers] = useState<string[]>([]);
  const [uniqueDates, setUniqueDates] = useState<string[]>([]);
  const [societe, setSociete] = useState("");
  const [marque, setMarque] = useState("");
  const [serieNumber, setSerieNumber] = useState("");
  const limit = 12;
  const [selectedDate, setSelectedDate] = useState("");
  const [dataToExport, setDataToExport] = useState("");
  const [count, setCount] = useState(0);
  console.log("uniqueDates", uniqueDates);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const formattedDate = date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      setSelectedDate(formattedDate); // format date to dd/mm/yyyy
    } else {
      setSelectedDate("");
    }
  };

  console.log("selectedId", selectedId);

  useEffect(() => {
    fetchUserData();
  }, [societe, marque, serieNumber, selectedDate]);

  

  const fetchUserData = async () => {
    try {
      const response = await fetch(
        `/api/pieces/fetchPieces?createdAt=${selectedDate}&societe=${societe}&marque=${marque}&serieNumber=${serieNumber}`
      );
  
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
  
      const data = await response.json();
      console.log("Total pieces fetched:", data.pieces.length);
  
      const entreprise = (sessionStorage.getItem("entreprise") || "").trim().toLowerCase();
      console.log("Entreprise to match:", entreprise);
  
      // Split entreprise into individual words
      const entrepriseWords = entreprise.split(" ").filter(word => word.length > 0);
      console.log("Entreprise words:", entrepriseWords);
  
      // Set to track unique marque values
      const uniqueMarques = new Set();
  
      // Filter data based on the marque and entreprise words
      const filteredData = data.pieces.filter((piece) => {
        // Check if marque is defined
        if (!piece.marque) {
          console.warn("Skipping piece with undefined 'marque':", piece);
          return false; // Skip this piece
        }
  
        const marqueLower = piece.marque.trim().toLowerCase();
        const isMatch = entrepriseWords.every(word => marqueLower.includes(word));
  
        // Add the unique marque to the set and log it
        if (!uniqueMarques.has(marqueLower)) {
          uniqueMarques.add(marqueLower);
          console.log("Unique marque added:", piece.marque);
        }
  
        console.log("marqueLower:", marqueLower, "isMatch:", isMatch);
  
        return isMatch;
      });
  
      console.log("Filtered data count:", filteredData.length);
  
      if (filteredData.length > 0) {
        console.log("Filtered data pieces:", filteredData);
      } else {
        console.log("No matches found in filtered data.");
      }
  
      setUserData(filteredData.reverse());
      setCount(filteredData.length);
      setFilteredUserData(filteredData);
      extractUniqueValues(filteredData);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  console.log("count", count)
  
  

  const fetchdataToExport = async () => {
    try {
      // Fetch data from the API
      const response = await fetch(`/api/pieces/fetchPieces`);
  
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
  
      // Parse the JSON data
      const data = await response.json();
  
      // Log the entire pieces array to verify its contents
      console.log("Fetched pieces:", data.pieces);
  
      // Retrieve and normalize the entreprise value from sessionStorage
      const entreprise = (sessionStorage.getItem("entreprise") || "").trim().toLowerCase();
      console.log("Entreprise to match:", entreprise);
  
      // Split entreprise into individual words
      const entrepriseWords = entreprise.split(" ").filter(word => word.length > 0);
      console.log("Entreprise words:", entrepriseWords);
  
      // Set to track unique marque values
      const uniqueMarques = new Set();
  
      // Filter pieces based on whether marque includes all words in entreprise
      const filteredPieces = data.pieces.filter(piece => {
        if (!piece.marque) {
          // Log and skip pieces with undefined 'marque'
          console.log("Skipping piece with undefined 'marque':", piece);
          return false; // Skip this piece
        }
  
        // Normalize the marque value to lowercase
        const marqueLower = piece.marque.trim().toLowerCase();
        console.log("marqueLower:", marqueLower);
  
        // Check if marque includes all words in entreprise
        const isMatch = entrepriseWords.every(word => marqueLower.includes(word));
  
        // Add the unique marque to the set and log it
        if (!uniqueMarques.has(marqueLower)) {
          uniqueMarques.add(marqueLower);
          console.log("Unique marque added:", piece.marque);
        }
  
        // Log matching pieces
        if (isMatch) {
          console.log("Matching piece:", piece);
        }
  
        return isMatch;
      });
  
      // Log the count and details of filtered pieces
      console.log("Filtered pieces count for export:", filteredPieces.length);
  
      if (filteredPieces.length > 0) {
        console.log("Filtered pieces for export:", filteredPieces);
      } else {
        console.log("No matches found in filtered data.");
      }
  
      // Reverse the filtered pieces and update the state
      setDataToExport(filteredPieces.reverse());
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  
  
  
  
  
  

  useEffect(() => {
    fetchdataToExport();
  }, []);

  const exportToExcel = () => {
    const formatDate = (dateString) => {
      if (!dateString) return "";
      const date = new Date(dateString);
      return date.toLocaleDateString();
    };

    const userData = dataToExport;

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
    }));

    const ws = utils.json_to_sheet(data);

    // Set column widths
    const columnWidths = [
      { wch: 15 }, // DATE DE LA DEMANDE
      { wch: 25 }, // SOCIETE
      { wch: 25 }, // CLIENT
      { wch: 15 }, // MARQUE
      { wch: 20 }, // NUMERO DE SERIE
      { wch: 20 }, // NUMERO DE COMMANDE
      { wch: 40 }, // NOM DE LA PIECE
      { wch: 20 }, // REFERENCE
      { wch: 20 }, // STOCK DISPO TREMBLAY
      { wch: 20 }, // DATE DE LA COMMANDE
      { wch: 20 }, // LIEU DE RECEPTION
      { wch: 25 }, // DATE DE LIVRAISON PREVU
      { wch: 25 }, // PERSONNE QUI PASSE COMMANDE
      { wch: 25 }, // DATE DE RECEPTION DEPOT
      { wch: 25 }, // DATE EXPEDITION ou ENLEVEMENT
      { wch: 25 }, // DATE RECEPTION PIECE DEFECTUEUSE
      { wch: 25 }, // DATE EXPEDITION DE LA PIECE DEFECTUEUSE
      { wch: 25 }, // NUMERO DU DEVIS ECONEGOCE
      { wch: 20 }, // DATE DU REGLEMENT
      { wch: 25 }, // FACTURE PIECE FOURNISSEUR
      { wch: 25 }, // AVOIR PIECE FOURNISSEUR
      { wch: 30 }, // FACTURE PIECE CLIENT ECONEGOCE
      { wch: 25 }, // REPONSE D EXPERTISE
      { wch: 25 }, // AVOIR PIECE CLIENT ECONEGOCE
      { wch: 25 }, // DOSSIER CLOTURE
      { wch: 25 }, // N° COMMANDE FOURNISSEUR
      { wch: 30 }, // FACTURE FOURNISSEUR D’ORIGINE
      { wch: 20 }, // N° BL
      { wch: 20 }, // DATE DU BL
      { wch: 25 }, // FACTURE PIECE CLIENT
      { wch: 25 }, // REPONSE D’EXPERTISE
      { wch: 25 }, // AVOIR PIECE CLIENT
      { wch: 50 }, // OBSERVATION
    ];
    ws["!cols"] = columnWidths;

    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Feuil1");

    // Get current date and format it
    const currentDate = new Date();
    const formattedDate = currentDate
      .toLocaleDateString("fr-FR")
      .split("/")
      .join("-");

    const fileName = `Liste-SAV-PIECES-DETACHEES-export-${formattedDate}.xlsx`;
    writeFile(wb, fileName);
  };

  const handleFilter = (filteredData: CardProps[]) => {
    setFilteredUserData(filteredData.length > 0 ? filteredData : userData);
  };

  const extractUniqueValues = (data: CardProps[]) => {
    const societes = new Set<string>();
    const marques = new Set<string>();
    const serieNumbers = new Set<string>();
    const uniqueDates = new Set<string>();

    data.forEach((item) => {
      societes.add(item.societe);
      marques.add(item.marque);
      serieNumbers.add(item.serieNumber);
      uniqueDates.add(item.created_at);
    });

    setUniqueSocietes(Array.from(societes));
    setUniqueMarques(Array.from(marques));
    setUniqueSerieNumbers(Array.from(serieNumbers));
    setUniqueDates(Array.from(uniqueDates));
  };

  const handleCardSelect = (id: string) => {
    setSelectedId(id);
    window.location.href = `/collaborateur/sav/sav-piece-detail?search=${id}`;
  };

  console.log("selectedDate", selectedDate);

  // Calculate the index of the first and last user to be displayed on the current page
  const startIndex = (currentPage - 1) * limit;
  const endIndex = startIndex + limit;

  // Slice the filteredUserData array to display only the users for the current page
  const usersToShow = filteredUserData.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen flex-col justify-between lg:pt-[70px] pt-[60px] ">
      <BannerTitle
        tile={"Liste de Suivi des Pièces Détachées"}
        paragraph={""}
      />
      <Breadcrumb
        paths={[
          { name: "Accueil", url: "/user-pro/sav" },
          {
            name: "Liste de Suivi des Pièces Détachées",
            url: "/user-pro/sav/liste-sav-piece",
          },

        
        ]}
      />
      <div className="lg:pt-20 p-10 max-w-[1280px] mx-auto">
        <div className="flex justify-end gap-10">
          {/*<AddButton
            title="AJOUTER PIECE SAV"
            destination="/collaborateur/sav/sav-piece"
          />*/}
          <Button
            className="bg-[#ffffff] border border-[#75b85f] text-[#75b85f] hover:bg-[#75b85f] hover:text-[#ffffff] p-6 rounded-sm"
            onClick={exportToExcel}
          >
            <FileUp className="mr-4" />
            Exporter vers Excel
          </Button>
        </div>
        <PieceSearchBox userData={userData} onFilter={handleFilter} />
        <FilterBar setAffichage={setAffichage} affichage={affichage} count={count}/>
        <div className="mt-10 flex justify-start gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[240px] pl-3 text-left font-normal text-muted-foreground"
                )}
              >
                <span>Date</span>

                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate ? new Date(selectedDate) : undefined}
                onSelect={handleDateSelect}
                disabled={(date) =>
                  date > new Date() || date < new Date("1900-01-01")
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {/*<FilterCombobox data={uniqueDates} word="Date" onSelect={(selectedValue) => setSelectedDate(selectedValue)} date={true}/>*/}
          <FilterCombobox
            data={uniqueSocietes}
            word="Société"
            onSelect={(selectedValue) => setSociete(selectedValue)}
            date={false}
          />
          <FilterCombobox
            data={uniqueMarques}
            word="MARQUE"
            onSelect={(selectedValue) => setMarque(selectedValue)}
            date={false}
          />
          <FilterCombobox
            data={uniqueSerieNumbers}
            word="N° SERIE"
            onSelect={(selectedValue) => setSerieNumber(selectedValue)}
            date={false}
          />
        </div>
        <>
          {affichage === "grid" ? (
            <div className="mt-10 flex justify-start gap-4 flex-wrap">
              {usersToShow.map((user) => (
                <PieceCard
                  key={user._id}
                  created_at={user.created_at}
                  _id={user._id}
                  societe={user.societe}
                  client={user.client}
                  marque={user.marque}
                  articleName={user.articleName}
                  serieNumber={user.serieNumber}
                  onSelectCard={handleCardSelect}
                  type=""
                />
              ))}
            </div>
          ) : (
            <div className="mt-10">
              {usersToShow.map((user) => (
                <PieceCardCol
                  key={user._id}
                  created_at={user.created_at}
                  _id={user._id}
                  societe={user.societe}
                  client={user.client}
                  marque={user.marque}
                  articleName={user.articleName}
                  serieNumber={user.serieNumber}
                  onSelectCard={handleCardSelect}
                  type=""
                />
              ))}
            </div>
          )}
        </>
        {filteredUserData.length > limit && (
          <div className="mt-10 ">
            <PaginationCategory
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              count={filteredUserData.length}
              limit={limit}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
