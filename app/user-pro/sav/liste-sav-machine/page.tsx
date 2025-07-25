"use client";
import { useState, useEffect } from "react";
import Breadcrumb from "@/components/reusable/BreadCrumb";
import BannerTitle from "@/components/reusable/BannerTitle";
import PaginationCategory from "@/components/reusable/Pagination";
import FilterBar from "@/components/reusable/FilterBar";
import MachineCard from "@/components/reusable/machineCard";
import MachineCardCol from "@/components/reusable/machineCardCol";
import MachineSearchBox from "@/components/reusable/machineSearchBox";
import { FilterCombobox } from "@/components/reusable/filtersCombobox";
import { Popover } from "@radix-ui/react-popover";
import { PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, FileUp } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
//import AddButton from "@/components/reusable/AddButton";
import { utils, writeFile } from "xlsx";

interface CardProps {
  _id: string;
  created_at: string;
  installateur: string;
  causeSAV: string;
  marque: string;
  categorieArticle: string;
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
  const [uniqueDates, setUniqueDates] = useState<string[]>([]);
  const [uniqueSerieNumbers, setUniqueSerieNumbers] = useState<string[]>([]);
  const [uniqueCategorieArticle, setUniqueCategorieArticle] = useState<
    string[]
  >([]);
  const limit = 12;
  const [count, setCount] = useState(0);
  const [installateur, setInstallateur] = useState("");
  const [marque, setMarque] = useState("");
  const [serieNumber, setSerieNumber] = useState("");
  const [category, setCategory] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [dataToExport, setDataToExport] = useState("");

  console.log("dataToExport", dataToExport);
  console.log("uniqueDates", uniqueDates);

  useEffect(() => {
    fetchUserData();
  }, [installateur, marque, serieNumber, category, selectedDate]);

  const fetchUserData = async () => {
    try {
      const response = await fetch(
        `/api/machines/fetchMachines?page=1&createdAt=${selectedDate}&installateur=${installateur}&marque=${marque}&serieNumber=${serieNumber}&categorieArticle=${category}`
      );
  
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
  
      const data = await response.json();
      console.log("Total machines fetched:", data.pieces.length);
  
      const entreprise = (sessionStorage.getItem("entreprise") || "")
        .trim()
        .toLowerCase();
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
  
  

  const fetchdataToExport = async () => {
    try {
      const response = await fetch(`/api/machines/fetchMachines`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
  
      const data = await response.json();
      console.log("Fetched machines:", data.pieces);
  
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
          console.log("Skipping piece with undefined 'marque':", piece);
          return false; // Skip this piece
        }
  
        const marqueLower = piece.marque.trim().toLowerCase();
        console.log("marqueLower:", marqueLower);
  
        // Check if marque includes all words in entreprise
        const isMatch = entrepriseWords.every(word => marqueLower.includes(word));
  
        if (!uniqueMarques.has(marqueLower)) {
          uniqueMarques.add(marqueLower);
          console.log("Unique marque added:", piece.marque);
        }
  
        if (isMatch) {
          console.log("Matching piece:", piece);
        }
  
        return isMatch;
      });
  
      console.log("Filtered pieces count for export:", filteredPieces.length);
  
      if (filteredPieces.length > 0) {
        console.log("Filtered pieces for export:", filteredPieces);
      } else {
        console.log("No matches found in filtered data.");
      }
  
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
      "INSTALLATEUR": user.installateur,
      "CLIENT": user.client,
      "CAUSE SAV": user.causeSAV,
      "MARQUE": user.marque,
      "N° ARTICLE": user.articleNumber,
      "MODELE": user.modele,
      "CATEGORIE ARTICLE": user.categorieArticle,
      "N° SERIE": user.serieNumber,
      "QUANTITE": user.quantite,
      "N° BL": user.numeroBlOuFacture,
      "ACCORD": user.accord,
      "DATE RETOUR DEPOT": formatDate(user.dateRetourFournisseur),
      "DATE DEMANDE AVOIR FOURNISSEUR": formatDate(user.dateDemandeAvoirFournisseur),
      "DATE RECEPTION AVOIR FOURNISSEUR": formatDate(user.dateReceptionAvoirFournisseur),
      "STATUT FOURNISSEUR":  user.statutFournisseur,
      "AVOIR FOURNISSEUR": user.avoirFournisseurNumber,
      "DATE AVOIR INSTALLATEUR": formatDate(user.dateAvoirInstallateur),
      "N° AVOIR INSTALLATEUR": user.avoirInstallateurNumber,
      "NOUVEAU N° BL": user.nouveauBlNumber,
      "DATE RETOUR FOURNISSEUR": formatDate(user.dateRetourFournisseur),
      "PRIX ACHAT": user.prixAchat,
      "PRIX VENTE": user.prixVente,
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
    ws['!cols'] = columnWidths;
  
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Feuil1");
  
    // Get current date and format it
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('fr-FR').split('/').join('-');
  
    const fileName = `Liste-SAV-Machine-export-${formattedDate}.xlsx`;
    writeFile(wb, fileName);
  };

  const handleFilter = (filteredData: CardProps[]) => {
    setFilteredUserData(filteredData.length > 0 ? filteredData : userData);
  };

  const handleCardSelect = (id: string) => {
    setSelectedId(id);
    window.location.href = `/collaborateur/sav/sav-piece-machine?search=${id}`;
  };

  console.log("filteredUserData.length", filteredUserData.length);

  const extractUniqueValues = (data: CardProps[]) => {
    const installateur = new Set<string>();
    const marques = new Set<string>();
    const categorieArticle = new Set<string>();
    const serieNumbers = new Set<string>();
    const uniqueDates = new Set<string>(); // New set for unique dates

    data.forEach((item) => {
      console.log("item.installateur", item.created_at);
      installateur.add(item.installateur);
      marques.add(item.marque);
      categorieArticle.add(item.categorieArticle);
      serieNumbers.add(item.serieNumber);
      uniqueDates.add(item.created_at); // Format the date using formatDate function
    });

    setUniqueSocietes(Array.from(installateur));
    setUniqueMarques(Array.from(marques));
    setUniqueSerieNumbers(Array.from(serieNumbers));
    setUniqueCategorieArticle(Array.from(categorieArticle));
    setUniqueDates(Array.from(uniqueDates));
  };

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

  console.log("selected", selectedId);

  // Calculate the index of the first and last user to be displayed on the current page
  const startIndex = (currentPage - 1) * limit;
  const endIndex = startIndex + limit;

  // Slice the filteredUserData array to display only the users for the current page
  const usersToShow = filteredUserData.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen flex-col justify-between lg:pt-[70px] pt-[60px]">
      <BannerTitle tile={"Liste de Retour Machine "} paragraph={""} />
      <Breadcrumb
        paths={[
          { name: "Accueil", url: "/user-pro/sav" },
          {
            name: "Liste de Retour Machine",
            url: "/user-pro/sav/liste-sav-machine",
          },
        ]}
      />
      <div className="lg:pt-20 p-10 max-w-[1280px] mx-auto">
        <div className="flex justify-end gap-10">
          {/*<AddButton
            title="AJOUTER MACHINE SAV"
            destination="/collaborateur/sav/sav-machine"
          />*/}
          <Button className="bg-[#ffffff] border border-[#75b85f] text-[#75b85f] hover:bg-[#75b85f] hover:text-[#ffffff] p-6 rounded-sm" onClick={exportToExcel}>
            <FileUp className="mr-4"/>
            Exporter vers Excel
          </Button>
        </div>
        <MachineSearchBox userData={userData} onFilter={handleFilter} />
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
            onSelect={(selectedValue) => setInstallateur(selectedValue)}
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
          <FilterCombobox
            data={uniqueCategorieArticle}
            word="CATEGORIE ARTICLE"
            onSelect={(selectedValue) => setCategory(selectedValue)}
            date={false}
          />
        </div>
        <>
          {affichage === "grid" ? (
            <div className="mt-10 flex justify-start gap-4 flex-wrap">
              {usersToShow.map((user) => (
                <MachineCard
                  key={user._id}
                  created_at={user.created_at}
                  _id={user._id}
                  installateur={user.installateur}
                  causeSAV={user.causeSAV}
                  marque={user.marque}
                  categorieArticle={user.categorieArticle}
                  serieNumber={user.serieNumber}
                  onSelectCard={handleCardSelect}
                  type=""
                />
              ))}
            </div>
          ) : (
            <div className="mt-10">
              {usersToShow.map((user) => (
                <MachineCardCol
                  key={user._id}
                  created_at={user.created_at}
                  _id={user._id}
                  installateur={user.installateur}
                  causeSAV={user.causeSAV}
                  marque={user.marque}
                  categorieArticle={user.categorieArticle}
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
