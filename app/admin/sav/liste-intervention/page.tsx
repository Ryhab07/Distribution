"use client";
import { useState, useEffect } from "react";
import Breadcrumb from "@/components/reusable/BreadCrumb";
import BannerTitle from "@/components/reusable/BannerTitle";
import PaginationCategory from "@/components/reusable/Pagination";
import FilterBar from "@/components/reusable/FilterBar";
//import MachineSearchBox from "@/components/reusable/machineSearchBox";
import { FilterCombobox } from "@/components/reusable/filtersCombobox";
import { Popover } from "@radix-ui/react-popover";
import { PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, FileUp, XIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import AddButton from "@/components/reusable/AddButton";
import { utils, writeFile } from "xlsx";
import InterventionCard from "@/components/reusable/InterventionCard";
import InterventionCardCol from "@/components/reusable/InterventionCardCol";
import { fr } from "date-fns/locale";
import InterventionsSearchBox from "@/components/reusable/interventionsSearchBox";

interface CardProps {
  _id: string;
  created_at: string;
  dateDinterventionPrevut: string;
  societe: string;
  causeSAV: string;
  client: string;
  marque: string;
  categorieArticle: string;
  serieNumber: string;
  type: string;
  dateDeLaDemande: any;
  onSelectCard: (id: string) => void;
}

const Page = () => {
  const limit = 12;
  const [filteredUserData, setFilteredUserData] = useState<CardProps[]>([]);
  const [userData, setUserData] = useState<CardProps[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [affichage, setAffichage] = useState<string>("grid");
  const [uniqueSocietes, setUniqueSocietes] = useState<string[]>([]);
  const [uniqueMarques, setUniqueMarques] = useState<string[]>([]);
  const [uniqueDates, setUniqueDates] = useState<string[]>([]);
  const [uniqueDatesDemande, setUniqueDatesDemande] = useState<string[]>([]);
  const [uniqueSerieNumbers, setUniqueSerieNumbers] = useState<string[]>([]);
  const [uniqueCategorieArticle, setUniqueCategorieArticle] = useState<
    string[]
  >([]);
  const [installateur, setInstallateur] = useState("");
  const [marque, setMarque] = useState("");
  const [societe, setSociete] = useState("");
  const [serieNumber, setSerieNumber] = useState("");
  const [category, setCategory] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedDateDemande, setSelectedDateDemande] = useState("");
  const [dataToExport, setDataToExport] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [count, setCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false); // Popover open state
  console.log("uniqueDatesDemande", uniqueDatesDemande);
  console.log("dataToExport", dataToExport);
  console.log("uniqueDates", uniqueDates);
  console.log("uniqueCategorieArticle", uniqueCategorieArticle);
  console.log("uniqueDates", setCategory);
  console.log("uniqueCategorieArticle", setInstallateur);
  console.log("setSelectedDateDemande", setSelectedDateDemande);

  useEffect(() => {
    fetchUserData();
  }, [
    installateur,
    marque,
    serieNumber,
    category,
    selectedDate,
    selectedDateDemande,
    societe,
  ]);

  const fetchUserData = async () => {
    try {
      const response = await fetch(
        `/api/intervention/fetchPieces?page=1&dateDeLaDemande=${selectedDateDemande}&createdAt=${selectedDate}&installateur=${installateur}&societe=${societe}&marque=${marque}&serieNumber=${serieNumber}&categorieArticle=${category}&client=${serieNumber}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      const data = await response.json();
      setCount(data);
      setUserData(data.interventions.reverse());
      setFilteredUserData(data.interventions);
      // Calculate total pages based on filtered data
      const totalPages = Math.ceil(data.interventions.length / limit);

      // If the current page exceeds the available pages, reset to the last page
      if (currentPage > totalPages) {
        setCurrentPage(totalPages);
      }

      // If there's only one page, stay on the current page
      if (totalPages === 1 && currentPage !== 1) {
        setCurrentPage(1);
      }
      extractUniqueValues(data.interventions);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchdataToExport = async () => {
    try {
      const response = await fetch(`/api/intervention/fetchPieces`);

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      const data = await response.json();
      setDataToExport(data.interventions.reverse());
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
      "DATE DE LA DEMANDE": formatDate(user.dateDeLaDemande),
      SOCIETE: user.societe,
      CLIENT: user.client,
      MARQUE: user.marque,
      "NUMERO DE SERIE": user.serieNumber,
      "N° DE TICKET": user.nDeTicket,
      "N° DEVIS ECONEGOCE": user.devisEconegoce,
      "N°DEVIS FOURNISSEUR": user.devisFournisseur,
      "DATE DE L INTERVENTION PREVUE": formatDate(user.dateDinterventionPrevut),
      "DATE DU RAPPORT": formatDate(user.dateDuRapport),
      "FACTURE  FOURNISSEUR": user.factureFournisseur[0],
      "BON DE COMMANDE ECONEGOCE": user.bonDeCommandeEconegoce,
      "FACTURE ECONEGOCE": user.factureEconegoce,
      OBSERVATION: user.observation,
    }));

    const ws = utils.json_to_sheet(data);

    // Set column widths
    const columnWidths = [
      { wch: 15 },
      { wch: 25 },
      { wch: 25 },
      { wch: 15 },
      { wch: 20 },
      { wch: 20 },
      { wch: 40 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 25 },
      { wch: 25 },
      { wch: 25 },
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

    const societe = userData.length > 0 ? userData[0].societe : "unknown";
    console.log("societe", societe);

    const fileName = `Liste-intervention-${formattedDate}-export-.xlsx`;
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

  const handleCardSelect = (id: string) => {
    setSelectedId(id);
    window.location.href = `/admin/sav/sav-intervention-detail?search=${id}`;
  };

  console.log("filteredUserData.length", filteredUserData.length);

  const extractUniqueValues = (data: CardProps[]) => {
    const societe = new Set<string>();
    const marques = new Set<string>();
    const categorieArticle = new Set<string>();
    const client = new Set<string>();
    const uniqueDates = new Set<string>(); // New set for unique dates
    const uniqueDatesDemande = new Set<string>(); // Initialize uniqueDatesDemande as a Set

    data.forEach((item) => {
      societe.add(item.societe);
      marques.add(item.marque);
      categorieArticle.add(item.categorieArticle);
      client.add(item.client);
      uniqueDates.add(item.dateDinterventionPrevut); // Format the date using formatDate function
      uniqueDatesDemande.add(item.dateDeLaDemande); // Adding to the set
    });

    setUniqueSocietes(Array.from(societe));
    setUniqueMarques(Array.from(marques));
    setUniqueSerieNumbers(Array.from(client));
    setUniqueCategorieArticle(Array.from(categorieArticle));
    setUniqueDates(Array.from(uniqueDates));
    setUniqueDatesDemande(Array.from(uniqueDatesDemande)); // Ensure you're converting the set to an array
  };

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

  /*const handleDateDemandeSelect = (date: Date | undefined) => {
    if (date) {
      const formattedDate = date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      setSelectedDateDemande(formattedDate);
    } else {
      setSelectedDateDemande("");
    }
  };

  const resetDateDemande = () => {
    setSelectedDateDemande("");
  };*/

  console.log("selected", selectedId);
  console.log("count", count);
  // Calculate the index of the first and last user to be displayed on the current page
  const startIndex = (currentPage - 1) * limit;
  const endIndex = startIndex + limit;

  // Slice the filteredUserData array to display only the users for the current page
  const usersToShow = filteredUserData.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen flex-col justify-between lg:pt-[70px] pt-[60px]">
      <BannerTitle tile={"Liste des interventions "} paragraph={""} />
      <Breadcrumb
        paths={[
          { name: "Accueil", url: "/admin/mon-compte" },
          { name: "sav", url: "/admin/sav" },
          {
            name: "Liste des interventions",
            url: "/admin/sav/liste-intervention",
          },
        ]}
      />
      <div className="lg:pt-20 p-10 max-w-[1280px] mx-auto">
        <div className="flex lg:flex-row flex-col justify-end lg:gap-10 gap-4">
          <AddButton
            title="AJOUTER UNE INTERVENTION"
            destination="/admin/sav/sav-intervention"
          />
          <Button
            className="bg-[#ffffff] border border-[#75b85f] text-[#75b85f] hover:bg-[#75b85f] hover:text-[#ffffff] p-6 rounded-sm"
            onClick={exportToExcel}
          >
            <FileUp className="mr-4" />
            Exporter vers Excel
          </Button>
        </div>
        <InterventionsSearchBox userData={userData} onFilter={handleFilter} />
        <FilterBar
          setAffichage={setAffichage}
          affichage={affichage}
          count={!message ? filteredUserData.length : 0}
        />
        <div className="mt-10 flex lg:flex-row flex-col justify-start gap-4">
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "lg:w-[240px] w-full pl-3 text-left font-normal text-muted-foreground"
                )}
              >
                <span className="text-black font-[500]">
                  {selectedDate ? selectedDate : "Date De La Demande"}
                </span>

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
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate ? new Date(selectedDate) : undefined}
                onSelect={handleDateSelect}
                disabled={(date) =>
                  date > new Date() || date < new Date("1900-01-01")
                }
                initialFocus
                locale={fr} // Set locale to French
              />
            </PopoverContent>
          </Popover>
          {/*<Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn("w-[240px] pl-3 text-left font-normal text-muted-foreground")}
              >
                <span>
                  {selectedDateDemande
                    ? selectedDateDemande
                    : "Date de la demande"}
                </span>


                {selectedDateDemande && (
                  <span
                    className="ml-2 cursor-pointer text-red-500"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent closing the popover when resetting
                      resetDateDemande(); // Reset the selected date
                    }}
                  >
                    <XIcon className="h-4 w-4" />
                  </span>
                )}

                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDateDemande ? new Date(selectedDateDemande) : undefined}
                onSelect={handleDateDemandeSelect}
                initialFocus
                locale={fr} // Set locale to French
              />
            </PopoverContent>
          </Popover>*/}
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
            word="CLIENT"
            onSelect={(selectedValue) => setSerieNumber(selectedValue)}
            date={false}
          />
        </div>
        <>
          {affichage === "grid" ? (
            <div className="mt-10 flex justify-start gap-4 flex-wrap">
              {message ? (
                <p className="text-black text-start w-full">{message}</p>
              ) : usersToShow.length > 0 ? (
                usersToShow.map((user) => (
                  <InterventionCard
                    key={user._id}
                    created_at={user.created_at}
                    _id={user._id}
                    installateur={user.client}
                    causeSAV={user.causeSAV}
                    marque={user.marque}
                    categorieArticle={user.societe}
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
          ) : (
            <div className="mt-10">
              {message ? (
                <p className="text-black text-start w-full">{message}</p>
              ) : usersToShow.length > 0 ? (
                usersToShow.map((user) => (
                  <InterventionCardCol
                    key={user._id}
                    created_at={user.created_at}
                    _id={user._id}
                    installateur={user.client}
                    causeSAV={user.causeSAV}
                    marque={user.marque}
                    categorieArticle={user.societe}
                    serieNumber={user.serieNumber}
                    onSelectCard={handleCardSelect}
                    type=""
                  />
                ))
              ) : (
                <p className="text-start w-full text-black">
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
