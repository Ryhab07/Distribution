"use client";
import { useState, useEffect } from "react";
import Breadcrumb from "@/components/reusable/BreadCrumb";
import axios from "axios";
import BannerTitle from "@/components/reusable/BannerTitle";
import PaginationCategory from "@/components/reusable/Pagination";
import AdminProductCardCol from "@/components/reusable/AdminProductCardCol";
import Title from "@/components/reusable/BigTitle";
import { Product } from "@/types/types";

export interface CardProps {
  [key: string]: any;
}

const Page = () => {
  const [filteredUserData, setFilteredUserData] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successAdd, setSuccessAdd] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [count, setCount] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [allKits, setAllKits] = useState([]);
  const limit = 12;
  const formattedSub = "Tous Les Produits";
  const [file, setFile] = useState<File | null>(null);
  const [isCheckedEcoya, setIsCheckedEcoya] = useState(false);
  const [isCheckedPowernity, setIsCheckedPoernity] = useState(false);
  const [isCheckedTousMarque, setIsCheckedTousMarque] = useState(false);
  const [isCheckedTous, setIsCheckedTous] = useState(false);
  const [isChecked375, setIsChecked375] = useState(false);
  const [isChecked500, setIsChecked500] = useState(false);

  console.log("loading, error ", loading, error);

  const handleSearch = () => {
    const filteredData = products.filter(
      (product) =>
        product.ref.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUserData(filteredData);
  };

  useEffect(() => {
    handleSearch(); // Call handleSearch whenever searchQuery or products change
  }, [searchQuery, products]);

  const handleCheckboxChangeProduct = (filter) => {
    if (filter === "") {
      setSelectedFilters([]); // Clear filters if "Tous" is selected
    } else {
      // Toggle the filter in the selectedFilters array
      setSelectedFilters((prevFilters) =>
        prevFilters.includes(filter)
          ? prevFilters.filter((item) => item !== filter)
          : [...prevFilters, filter]
      );
    }
  };

  useEffect(() => {
    fetchAllData();
    fetchAllKits();
  }, [selectedFilters]);

  const fetchAllData = async () => {
    try {
      // Convert selected filters to a query string
      const filterQuery =
        selectedFilters.length > 0 ? `&type=${selectedFilters.join(",")}` : "";
      const response = await fetch(`/api/kits/productRoutes?${filterQuery}`);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const jsonData = await response.json();
      console.log("allData", jsonData);
      setProducts(jsonData);
      setCount(jsonData.length);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all kits
  const fetchAllKits = async () => {
    try {
      const response = await fetch(`/api/kits/kitphotoAll`);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const jsonData = await response.json();
      console.log("allData", jsonData);

      setAllKits(jsonData.data); // Store fetched data
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // useEffect to update the count when filters or data change
  useEffect(() => {
    const filteredCount = allKits.filter((kit) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (isChecked500 && kit.puissance_panneau !== 500) return false;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (isChecked375 && kit.puissance_panneau !== 375) return false;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (isCheckedEcoya && !kit.name.includes("Ecoya")) return false;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (isCheckedPowernity && !kit.name.includes("Powernity")) return false;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (!kit.name.toLowerCase().includes(searchQuery.toLowerCase()))
        return false; // Add search query filter
      return true;
    }).length;

    setCount(filteredCount); // Update count dynamically
  }, [
    allKits,
    isChecked500,
    isChecked375,
    isCheckedEcoya,
    isCheckedPowernity,
    searchQuery,
  ]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleFileUpload = async () => {
    if (!file) return;

    const creatorId = sessionStorage.getItem("id");
    if (!creatorId) {
      alert("Erreur: Identifiant du créateur introuvable.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("creatorId", creatorId);

    try {
      const response = await axios.post("/api/admin/uploadProducts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        console.log("response.data.success", response.data.success);
        setSuccessAdd("Produits ajoutés avec succès.");
        alert("Produits ajoutés avec succès.");
      }
    } catch (error: any) {
      console.error("Erreur lors du téléchargement du fichier:", error);
      const errorMessage = error.response?.data?.error || "Erreur inconnue.";
      setError(errorMessage); // Display the backend error message
      alert(errorMessage); // Optionally show the error message in an alert
    }
  };

  // Function to handle checkbox changes
  const handleCheckboxChange = (value) => {
    if (value === "375") {
      const new375State = !isChecked375;
      setIsChecked375(new375State);
      setIsChecked500(false);
      setIsCheckedTous(!new375State && !isChecked500); // Select "Tous" if "375" is deselected and "500" is not selected
    } else if (value === "500") {
      const new500State = !isChecked500;
      setIsChecked500(new500State);
      setIsChecked375(false);
      setIsCheckedTous(!new500State && !isChecked375); // Select "Tous" if "500" is deselected and "375" is not selected
    } else if (value === "tous") {
      const newTousState = !isCheckedTous;
      setIsCheckedTous(newTousState);
      setIsChecked375(false);
      setIsChecked500(false);
    }
  };

  // Function to handle checkbox changes
  const handleCheckboxChangeMarque = (value) => {
    console.log("Checkbox value clicked:", value); // Log the value of the checkbox being clicked

    if (value === "Ecoya") {
      // Toggle Ecoya and deselect Powernity
      const newEcoyaState = !isCheckedEcoya;
      setIsCheckedEcoya(newEcoyaState);
      setIsCheckedPoernity(false);
      setIsCheckedTousMarque(false); // Deselect Tous when Ecoya is selected
      console.log("Ecoya selected, Powernity and Tous deselected");
    } else if (value === "Powernity") {
      // Toggle Powernity and deselect Ecoya
      const newPowernityState = !isCheckedPowernity;
      setIsCheckedPoernity(newPowernityState);
      setIsCheckedEcoya(false);
      setIsCheckedTousMarque(false); // Deselect Tous when Powernity is selected
      console.log("Powernity selected, Ecoya and Tous deselected");
    } else if (value === "tous") {
      // Toggle Tous and deselect Ecoya and Powernity
      const newTousState = !isCheckedTousMarque;
      setIsCheckedTousMarque(newTousState);
      setIsCheckedEcoya(false);
      setIsCheckedPoernity(false);
      console.log("Tous selected, Ecoya and Powernity deselected");
    }
    // Log the final state of all checkboxes
    console.log(
      "Final state - Ecoya:",
      isCheckedEcoya,
      "Powernity:",
      isCheckedPowernity,
      "Tous:",
      isCheckedTousMarque
    );
  };

  const displayedProducts = (
    selectedOption === "products"
      ? filteredUserData
      : allKits.filter((kit) => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          if (isChecked500 && kit.puissance_panneau !== 500) return false;
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          if (isChecked375 && kit.puissance_panneau !== 375) return false;
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          if (isCheckedEcoya && !kit.name.includes("Ecoya")) return false;
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          if (isCheckedPowernity && !kit.name.includes("Powernity"))
            return false;
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          if (!kit.name.toLowerCase().includes(searchQuery.toLowerCase()))
            return false; // Add search query filter
          return true; // Include the kit if none of the filters exclude it
        })
  ).slice((currentPage - 1) * limit, currentPage * limit);




  return (
    <div className="min-h-screen flex-col justify-between lg:pt-[70px] pt-[60px]">
      <BannerTitle tile={"Liste des produits"} paragraph={""} />
      <Breadcrumb
        paths={[
          { name: "Accueil", url: "/admin/mon-compte" },
          { name: "Mon compte", url: "/admin/mon-compte" },
          { name: "Liste des produits", url: "#" },
        ]}
      />

      <div className="lg:p-20 p-10 max-w-[1280px] mx-auto">
        <div className="flex justify-center mx-auto">
          <Title>Que souhaitez-vous consulter ? </Title>
        </div>

        {/* Radio Button Options */}
        <div className="flex justify-center mx-auto mt-10">
          <label className="mr-5">
            <input
              type="radio"
              name="interventionMode"
              value="products"
              checked={selectedOption === "products"}
              onChange={() => setSelectedOption("products")}
              className="mr-2"
            />
            Les produits de la base de données
          </label>
          <label>
            <input
              type="radio"
              name="interventionMode"
              value="kits"
              checked={selectedOption === "kits"}
              onChange={() => setSelectedOption("kits")}
              className="mr-2"
            />
            Les kits prédéfinis
          </label>
        </div>

        {/* Show the corresponding section based on the selected option */}
        {selectedOption === "products" && (
          <div className="lg:pt-20 p-10 max-w-[1280px] mx-auto">
            <p className="lg:text-end text-center mb-2 text-devinovGreen">
              <a href="/empty-products.xlsx" download="fichier.xlsx">
                Téléchargez le fichier Excel, complétez-le, puis importez-le
                pour ajouter vos produits.
              </a>
            </p>
            <div className="flex lg:flex-row flex-col justify-between bg-gray-50 rounded-md p-4">
              <input
                type="file"
                onChange={handleFileChange}
                className="pt-4 "
              />
              <div className="">
                <button
                  onClick={handleFileUpload}
                  className="bg-blue-500 text-white py-2 px-4 rounded mt-4"
                >
                  Importer des produits
                </button>
              </div>
            </div>
            {successAdd && <p>{successAdd}</p>}

            <div className="py-10 max-w-[1280px] mx-auto">
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Rechercher par ref, nom..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)} // Update searchQuery state
                  className="border rounded-md w-full p-4 bg-white"
                />
              </div>
            </div>
            {formattedSub === "Tous Les Produits" && (
              <div className="w-full p-4 bg-white mt-10 border border-[#DFDFDF] rounded-[5px] flex lg:flex-row flex-col justify-start gap-[30px]">
                <p className="text-[14px]">Catégories:</p>
                <div className="gap-4 flex flex-wrap md:flex-nowrap">
                  <div className="flex items-center mb-2 md:mb-0">
                    <input
                      type="checkbox"
                      value="Tous"
                      checked={selectedFilters.includes("")}
                      onChange={() => handleCheckboxChangeProduct("")}
                      className=""
                    />
                    <label className="ml-2 text-[13px]">Tous</label>
                  </div>

                  <div className="flex items-center mb-2 md:mb-0">
                    <input
                      type="checkbox"
                      value="panneaux"
                      checked={selectedFilters.includes("panneaux")}
                      onChange={() => handleCheckboxChangeProduct("panneaux")}
                      className=""
                    />
                    <label className="ml-2 text-[13px]">Panneaux</label>
                  </div>

                  <div className="flex items-center mb-2 md:mb-0">
                    <input
                      type="checkbox"
                      value="coffret-ac"
                      checked={selectedFilters.includes("coffret-ac")}
                      onChange={() => handleCheckboxChangeProduct("coffret-ac")}
                      className=""
                    />
                    <label className="ml-2 text-[13px]">Coffret AC</label>
                  </div>

                  <div className="flex items-center mb-2 md:mb-0">
                    <input
                      type="checkbox"
                      value="onduleurs"
                      checked={selectedFilters.includes("onduleurs")}
                      onChange={() => handleCheckboxChangeProduct("onduleurs")}
                      className=""
                    />
                    <label className="ml-2 text-[13px]">
                      Onduleur/Micro-Onduleur
                    </label>
                  </div>

                  <div className="flex items-center mb-2 md:mb-0">
                    <input
                      type="checkbox"
                      value="fixation"
                      checked={selectedFilters.includes("fixation")}
                      onChange={() => handleCheckboxChangeProduct("fixation")}
                      className=""
                    />
                    <label className="ml-2 text-[13px]">Fixation</label>
                  </div>

                  <div className="flex items-center mb-2 md:mb-0">
                    <input
                      type="checkbox"
                      value="boitier-dtu"
                      checked={selectedFilters.includes("boitier-dtu")}
                      onChange={() =>
                        handleCheckboxChangeProduct("boitier-dtu")
                      }
                      className=""
                    />
                    <label className="ml-2 text-[13px]">
                      Boitier DTU/Passerelle WIFI
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      value="accessoires"
                      checked={selectedFilters.includes("accessoires")}
                      onChange={() =>
                        handleCheckboxChangeProduct("accessoires")
                      }
                      className=""
                    />
                    <label className="ml-2 text-[13px]">Accessoires</label>
                  </div>
                </div>
              </div>
            )}
            <div className="w-full rounded bg-[#EFEFEF] p-4 my-[30px] border border-[#DFDFDF]">
              <p className="font-semibold text-devinovGreen">
                Nombre Total de produits: {filteredUserData.length}
              </p>
            </div>
            <div className="mt-10">
              {displayedProducts.length === 0 ? (
                <p className="text-start w-full text-black">
                  Aucune information trouvée
                </p>
              ) : (
                <AdminProductCardCol
                  displayedProducts={displayedProducts}
                  type="products"
                />
              )}
            </div>
            {displayedProducts.length > 0 && (
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
        )}

        {selectedOption === "kits" && (
          <div className="lg:pt-20 p-10 max-w-[1280px] mx-auto">
            {successAdd && <p>{successAdd}</p>}

            <div className="py-10 max-w-[1280px] mx-auto">
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Rechercher par ref, nom..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border rounded-md w-full p-4 bg-white"
                />
              </div>
            </div>
            <>
              {/* 500/375 Filter */}
              <div className="w-full p-4 bg-white mt-10 border border-[#DFDFDF] rounded-[5px] justify-start gap-[50px] flex lg:flex-row flex-col">
                <p>Puissance du panneau:</p>
                <div className="lg:gap-10 gap-2 flex lg:flex-row flex-col">
                  <div>
                    <input
                      type="checkbox"
                      value="Tous"
                      checked={isCheckedTous}
                      onChange={() => handleCheckboxChange("tous")}
                      className="mt-1"
                    />
                    <label className="ml-[10px]">Tous</label>
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      value="375"
                      checked={isChecked375}
                      onChange={() => handleCheckboxChange("375")}
                      className="lg:ml-4 ml-0"
                    />
                    <label className="ml-[10px]">375 Wc</label>
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      value="500"
                      checked={isChecked500}
                      onChange={() => handleCheckboxChange("500")}
                      className="lg:ml-4 ml-0"
                    />
                    <label className="ml-[10px]">500 Wc</label>
                  </div>
                </div>
              </div>

              {/* Powernity/Ecoya Filter */}
              <div className="w-full p-4 bg-white mt-10 border border-[#DFDFDF] rounded-[5px] justify-start gap-[50px] flex lg:flex-row flex-col">
                <p>Marque du panneau:</p>
                <div className="lg:gap-10 gap-2 flex lg:flex-row flex-col">
                  <div>
                    <input
                      type="checkbox"
                      value="Tous"
                      checked={isCheckedTousMarque}
                      onChange={() => handleCheckboxChangeMarque("tous")}
                      className="mt-1"
                    />
                    <label className="ml-[10px]">Tous</label>
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      value="Ecoya"
                      checked={isCheckedEcoya}
                      onChange={() => handleCheckboxChangeMarque("Ecoya")}
                      className="lg:ml-4 ml-0"
                    />
                    <label className="ml-[10px]">Ecoya</label>
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      value="Powernity"
                      checked={isCheckedPowernity}
                      onChange={() => handleCheckboxChangeMarque("Powernity")}
                      className="lg:ml-4 ml-0"
                    />
                    <label className="ml-[10px]">Powernity</label>
                  </div>
                </div>
              </div>
            </>
            <div className="w-full rounded bg-[#EFEFEF] p-4 my-[30px] border border-[#DFDFDF]">
              <p className="font-semibold text-devinovGreen">
                Nombre Total de produits: {count}
              </p>
            </div>
            <div className="mt-10">
              {displayedProducts.length === 0 ? (
                <p className="text-start w-full text-black">
                  Aucune information trouvée
                </p>
              ) : (
                <AdminProductCardCol
                  displayedProducts={displayedProducts}
                  type="kits"
                />
              )}
            </div>

            <div className="mt-10 ">
              <PaginationCategory
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                count={count}
                limit={limit}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
