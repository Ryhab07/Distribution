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
import { CalendarIcon, FileUp, XIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import AddButton from "@/components/reusable/AddButton";
import { utils, writeFile } from "xlsx";
import { fr } from "date-fns/locale";

interface CardProps {
  _id: string;
  created_at: string;
  societe: string;
  client: string;
  marque: string;
  articleName: string;
  serieNumber: string;
  reference: string;
  type: string;
  numeroBlOuFacture: string;
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
  const [uniqueReferences, setUniqueReferences] = useState<string[]>([]);
  const [uniqueSerieNumbers, setUniqueSerieNumbers] = useState<string[]>([]);
  const [uniqueDates, setUniqueDates] = useState<string[]>([]);
  const [societe, setSociete] = useState("");
  const [marque, setMarque] = useState("");
  const [count, setCount] = useState(0);
  const [serieNumber, setSerieNumber] = useState("");
  const [reference, setReference] = useState("");
  const limit = 12;
  const [selectedDate, setSelectedDate] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [dataToExport, setDataToExport] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  console.log("uniqueDates", uniqueDates);
  console.log("count", count);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const formattedDate = date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      setSelectedDate(formattedDate); // format date to dd/mm/yyyy
      setIsOpen(false);
    } else {
      setSelectedDate("");
      setIsOpen(false);
    }
  };

  const resetDate = () => {
    setSelectedDate(""); // Reset the state to undefined
    setIsOpen(false);
  };

  console.log("selectedId", selectedId);

  useEffect(() => {
    fetchUserData();
  }, [societe, marque, serieNumber, selectedDate, reference]);

  const fetchUserData = async () => {
    try {
      const response = await fetch(
        `/api/pieces/fetchPieces?createdAt=${selectedDate}&societe=${societe}&marque=${marque}&serieNumber=${serieNumber}&reference=${reference}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      const data = await response.json();
      setCount(data);
      setUserData(data.pieces.reverse());
      setFilteredUserData(data.pieces);
      // Calculate total pages based on filtered data
      const totalPages = Math.ceil(data.pieces.length / limit);

      // If the current page exceeds the available pages, reset to the last page
      if (currentPage > totalPages) {
        setCurrentPage(totalPages);
      }

      // If there's only one page, stay on the current page
      if (totalPages === 1 && currentPage !== 1) {
        setCurrentPage(1);
      }
      extractUniqueValues(data.pieces);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  console.log("count", count);

  const fetchdataToExport = async () => {
    try {
      const response = await fetch(`/api/pieces/fetchPieces`);

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      const data = await response.json();
      setDataToExport(data.pieces.reverse());
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
      "NOM DE LA PIECE": user.articleName || "",
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
    if (filteredData.length > 0) {
      setFilteredUserData(filteredData); // Update with filtered data
      setMessage(null); // Clear the message
    } else {
      setFilteredUserData(userData); // Reset to all data
      setMessage("Aucune information trouvée"); // Set the message
    }
  };

  const extractUniqueValues = (data: CardProps[]) => {
    const societes = new Set<string>();
    const marques = new Set<string>();
    const serieNumbers = new Set<string>();
    const uniqueDates = new Set<string>();
    const references = new Set<string>();

    // Populate the sets with data, using "Autres" as the default value for empty fields
    data.forEach((item) => {
      societes.add(item.societe || "Autres");
      marques.add(item.marque || "Autres");
      references.add(item.reference || "Autres");
      serieNumbers.add(item.serieNumber || "Autres");
      uniqueDates.add(item.created_at || "Autres");
    });

    // Convert sets to arrays and sort them
    const sortArray = (arr: string[]) => {
      return arr.sort((a, b) => {
        // Ensure "Autres" is always at the end
        if (a === "Autres") return 1;
        if (b === "Autres") return -1;
        return a.localeCompare(b);
      });
    };

    // Set the sorted arrays to state
    setUniqueSocietes(sortArray(Array.from(societes)));
    setUniqueMarques(sortArray(Array.from(marques)));
    setUniqueReferences(sortArray(Array.from(references)));
    setUniqueSerieNumbers(sortArray(Array.from(serieNumbers)));
    setUniqueDates(sortArray(Array.from(uniqueDates)));
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
          { name: "Accueil", url: "/collaborateur/mon-compte" },
          { name: "sav", url: "/collaborateur/sav" },
          {
            name: "Liste de Suivi des Pièces Détachées",
            url: "/collaborateur/sav/liste-sav-piece",
          },
        ]}
      />
      <div className="lg:pt-20 p-10 max-w-[1280px] mx-auto">
        <div className="flex lg:flex-row flex-col justify-end lg:gap-10 gap-4">
          <AddButton
            title="AJOUTER PIECE SAV"
            destination="/collaborateur/sav/sav-piece"
          />
          <Button
            className="bg-[#ffffff] border border-[#75b85f] text-[#75b85f] hover:bg-[#75b85f] hover:text-[#ffffff] p-6 rounded-sm"
            onClick={exportToExcel}
          >
            <FileUp className="mr-4" />
            Exporter vers Excel
          </Button>
        </div>
        <PieceSearchBox userData={userData} onFilter={handleFilter} />
        <FilterBar
          setAffichage={setAffichage}
          affichage={affichage}
          count={!message ? filteredUserData.length : 0}
        />
        <div className="mt-10 flex lg:flex-row flex-col justify-start gap-4 ">
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "lg:lg:w-[240px] w-full pl-3 text-left font-normal text-muted-foreground"
                )}
              >
                <span>{selectedDate ? selectedDate : "Date"}</span>

                {/* X icon to reset the filter */}
                {selectedDate && (
                  <span
                    className="ml-2 cursor-pointer text-red-500"
                    onClick={() => {
                      setSelectedDate(""); // Reset the selected date
                      resetDate(); // Optional: reset the calendar state if necessary
                    }}
                  >
                    <XIcon className="h-4 w-4" />
                  </span>
                )}

                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="lg:w-auto w-full p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate ? new Date(selectedDate) : undefined}
                onSelect={handleDateSelect}
                disabled={(date) =>
                  date > new Date() || date < new Date("1900-01-01")
                }
                initialFocus
                locale={fr}
              />
            </PopoverContent>
          </Popover>
          {/*<FilterCombobox data={uniqueDates} word="Date" onSelect={(selectedValue) => setSelectedDate(selectedValue)} date={true}/>*/}
          <FilterCombobox
            data={uniqueSocietes}
            word="Société"
            onSelect={(selectedValue) => setSociete(selectedValue)}
            date={false}
            height="400px"
          />
          <FilterCombobox
            data={uniqueMarques}
            word="MARQUE"
            onSelect={(selectedValue) => setMarque(selectedValue)}
            date={false}
            height="400px"
          />
          <FilterCombobox
            data={uniqueSerieNumbers}
            word="N° SERIE"
            onSelect={(selectedValue) => setSerieNumber(selectedValue)}
            date={false}
            height="400px"
          />
          <FilterCombobox
            data={uniqueReferences}
            word="REFERENCE"
            onSelect={(selectedValue) => setReference(selectedValue)}
            date={false}
            height="400px"
          />
        </div>
        <>
          {affichage === "grid" ? (
            <div className="mt-10 flex lg:flex-row flex-col justify-start gap-4 flex-wrap">
              {message ? (
                <p className="text-black text-start w-full">{message}</p>
              ) : usersToShow.length > 0 ? (
                usersToShow.map((user) => (
                  <PieceCard
                    key={user._id}
                    created_at={user.created_at}
                    _id={user._id}
                    societe={user.societe}
                    client={user.client}
                    marque={user.marque}
                    articleName={user.articleName}
                    serieNumber={user.serieNumber}
                    numeroBlOuFacture={user.numeroBlOuFacture}
                    onSelectCard={handleCardSelect}
                    type=""
                  />
                ))
              ) : (
                <p className="text-center w-full text-gray-500">
                  Aucune information trouvée
                </p>
              )}
            </div>
          ) : (
            <div className="mt-10">
              {message ? (
                <p className="text-black text-start w-full">{message}</p>
              ) : usersToShow.length > 0 ? (
                usersToShow.map((user) => (
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
                ))
              ) : (
                <p className="text-center w-full text-gray-500">
                  Aucune information trouvée
                </p>
              )}
            </div>
          )}
        </>
        {filteredUserData.length > limit &&
          usersToShow.length > 0 &&
          filteredUserData.length > 0 &&
          !message && (
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
