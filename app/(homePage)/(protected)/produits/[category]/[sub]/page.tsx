"use client";
import Breadcrumb from "@/components/reusable/BreadCrumb";
import ProductCard from "@/components/reusable/ProductCard";
import ProductSearchBox from "@/components/reusable/productSearchBox";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PaginationCategory from "@/components/reusable/Pagination";
import { getKitsWithPricesAndQuantities } from "@/utils/kitService";
import FilterBar from "@/components/reusable/FilterBar";
import ProductCardCol from "@/components/reusable/ProductCardCol";
import BannerTitle from "@/components/reusable/BannerTitle";
import kitPV from "@/assets/images/panneau-solaire-full-black.png";
import touslesproduits from "@/assets/images/tous-les-produits.png";
//import reusableCard from "@/components/reusables/reusableCard";
//import BannerKitPV from "@/components/reusable/BannerKitPV";

export interface CardProps {
  [key: string]: any;
}

interface Product {
  [key: string]: any;
}

const Page = () => {
  const limit = 12;
  const params = useParams();
  const { category, sub } = params || {}; //sous cat passer dans l'url
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [kits, setKits] = useState<any[]>([]);
  const [kitproducts, setKitProducts] = useState<any[]>([]);
  const [typeKit, setTypeKit] = useState<string | null>(null);
  const [filteredUserData, setFilteredUserData] = useState<Product[]>([]);
  const [otherProduct, setOtherProduct] = useState<Product[]>([]);
  const [url, setUrl] = useState<string | null>(null);
  const [affichage, setAffichage] = useState<string>("grid");
  const [isChecked375, setIsChecked375] = useState(false);
  const [isChecked500, setIsChecked500] = useState(false);
  const [isCheckedTous, setIsCheckedTous] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [photoKits, setPhotoKits] = useState<Product[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [count375, setCount375] = useState(0);
  const [count500, setCount500] = useState(0);
  const [countAll, setCountAll] = useState(0);
  const [isCheckedEcoya, setIsCheckedEcoya] = useState(false);
  const [isCheckedPowernity, setIsCheckedPoernity] = useState(false);
  const [isCheckedTousMarque, setIsCheckedTousMarque] = useState(false);

  console.log("countAll", countAll);
  console.log("loading", loading);
  console.log("error", error);

  const [checked, setChecked] = useState<"375" | "500" | "tous">("tous");

  const handleCheckboxChangeProduct = (filter) => {
    if (filter === "") {
      // If "Tous" is selected, deselect all filters
      setSelectedFilters([]);
    } else {
      // Toggle individual filters
      if (selectedFilters.includes(filter)) {
        setSelectedFilters(selectedFilters.filter((item) => item !== filter));
      } else {
        setSelectedFilters([...selectedFilters, filter]);
      }
    }
  };

  // Effect to update the checked value based on checkbox states
  useEffect(() => {
    if (isCheckedTous) {
      setChecked("tous");
    } else if (isChecked375) {
      setChecked("375");
    } else if (isChecked500) {
      setChecked("500");
    }
  }, [isChecked375, isChecked500, isCheckedTous]);

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

  // Decode the URL-encoded string
  /*const decodedString = Array.isArray(category)
    ? category.map((item) => decodeURIComponent(item)).join(" ")
    : decodeURIComponent(category || "");*/

  const decodedStringSub = Array.isArray(sub)
    ? sub.map((item) => decodeURIComponent(item)).join(" ")
    : decodeURIComponent(sub || "");

  // Function to capitalize the first letter of each word
  // eslint-disable-next-line @next/next/no-html-link-for-pages
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  // Convert category to desired format
  /*const formattedCategory = Array.isArray(decodedString)
    ? decodedString
        .split("-") // Split the string by dashes
        .map((word) => capitalizeFirstLetter(word))
        .join(" ") // Join the words with spaces
    : decodedString
        .split("-")
        .map((word) => capitalizeFirstLetter(word))
        .join(" ");*/

  const formattedSub = Array.isArray(decodedStringSub) //conversion du param 
    ? decodedStringSub
        .split("-") // Split the string by dashes
        .map((word) => capitalizeFirstLetter(word))
        .join(" ") // Join the words with spaces
    : decodedStringSub
        .split("-")
        .map((word) => capitalizeFirstLetter(word))
        .join(" ");

  let filterWord;
  let imagesrc;

  switch (formattedSub) {
    case "Kit Pv":
      filterWord = "SOLAIRE";
      imagesrc = kitPV;

      break;
    case "Tous Les Produits":
      filterWord = "SOLAIRE";
      imagesrc = touslesproduits;

      break;
    case "Onduleur Micro Onduleur":
      filterWord = "SOLAIRE";
      imagesrc = "https://i.ibb.co/4WXmzWP/onduleur-micro-onduleur.png";

      break;
    case "Kit De Fixation":
      filterWord = "ACCESSOIRES";
      imagesrc = "https://i.ibb.co/hXCdvbC/kit-fixation.png";

      break;
    case "Pergola":
      filterWord = "ISOLATION";
      imagesrc = "https://i.ibb.co/TvJ4L80/pergola.png";

      break;
    case "Onduleur Micro Onduleur":
      filterWord = "VMC";
      imagesrc = "https://i.ibb.co/4WXmzWP/onduleur-micro-onduleur.png";

      break;
    default:
      filterWord = null;
  }

  useEffect(() => {
    // Set the type of kit based on the formattedSub value
    if (formattedSub === "Kit Pv") {
      setTypeKit("photovoltaiques");
      //setUrl("/api/kits/kitRoutes?type=photovoltaiques");
      setUrl("/api/kits/kitphotoAll");
      checked === "tous"
        ? setCount(28)
        : checked === "375"
        ? setCount(count375)
        : setCount(count500);
    } else if (formattedSub === "Kit De Fixation") {
      setTypeKit("fixation");
      setUrl("/api/kits/kitRoutes?type=fixation");
      setCount(6);
    } else if (formattedSub === "Tous Les Produits") {
      setCount(32);
    } else if (formattedSub === "Onduleur Micro Onduleur") {
      setCount(6);
    }
  }, [formattedSub, checked]);

  useEffect(() => {
    if (
      formattedSub !== "Kit Pv" &&
      formattedSub !== "Kit De Fixation" &&
      formattedSub !== "Tous Les Produits" &&
      formattedSub !== "Onduleur Micro Onduleur"
    ) {
      const fetchCategoryData = async () => {
        try {
          const response = await fetch(
            `/api/b365/fetchCategory?category=${filterWord}&page=${currentPage}&limit=${limit}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch data");
          }
          const jsonData = await response.json();
          setProducts(jsonData.products);
          setFilteredUserData(jsonData.products);
          setCount(jsonData.itemCount);
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };
      fetchCategoryData();
    } else if (
      formattedSub === "Tous Les Produits" ||
      formattedSub === "Onduleur Micro Onduleur"
    ) {
      const fetchAllData = async () => {
        try {
          const response = await fetch(
            `/api/kits/productRoutes?type=${selectedFilters}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch data");
          }
          const jsonData = await response.json();
          const onduleurProducts = jsonData.filter((product) =>
            product.name.toLowerCase().includes("onduleur")
          );
          const allData = jsonData.filter(
            (product) =>
              product.name.toLowerCase() !== "Coffret AC Personnalisé"
          );
          console.log("allData", allData);
          setProducts(
            formattedSub === "Tous Les Produits" ? allData : onduleurProducts
          );
          setFilteredUserData(
            formattedSub === "Tous Les Produits" ? allData : onduleurProducts
          );
          setCount(jsonData.itemCount);
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };
      fetchAllData();
    } else {
      const fetchData = async () => {
        try {
          const responseKits = await fetch(`${url}`);
          const responseProducts = await fetch(`${url}`);
          const dataKits = await responseKits.json();
          const dataProducts = await responseProducts.json();
          console.log("dataKits", dataKits.data);
          const filteredKits = dataKits.data.filter(
            (kit) => kit.status === "available"
          );
          console.log("filteredKits", filteredKits);
          setKits(formattedSub === "Kit De Fixation" ? dataKits : filteredKits);
          setFilteredUserData(
            formattedSub === "Kit De Fixation" ? dataKits : filteredKits
          );
          console.log("filteredUserData", filteredUserData);
          setKitProducts(dataProducts);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      fetchData();
    }
  }, [
    typeKit,
    filterWord,
    //currentPage,
    formattedSub,
    url,
    selectedFilters,
  ]);

  useEffect(() => {
    const updateKitsWithPricesAndQuantities = async () => {
      if (kits.length > 0 && kitproducts.length > 0) {
        const kitsWithPricesAndQuantities =
          await getKitsWithPricesAndQuantities(kitproducts, kits);
        // Check if kitsWithPricesAndQuantities is an array before mapping
        if (Array.isArray(kitsWithPricesAndQuantities)) {
          // Modify kitsWithPricesAndQuantities to include the 'stock' property
          const updatedKits = kitsWithPricesAndQuantities.map((kit) => ({
            ...kit,
            stock: "Disponible",
          }));
          setFilteredUserData(updatedKits);
          setOtherProduct(updatedKits);
        }
      }
    };

    updateKitsWithPricesAndQuantities();
  }, [kits, kitproducts]);

  // Function to get component quantity and price
  const getComponentQuantityAndPrice = (
    quantities: any,
    cost: number,
    componentName: string,
    use: string
  ) => {
    const normalizedComponentName = componentName
      .toLowerCase()
      .replace(/\s/g, "");
    const usage = use; // Normalize component name
    if (normalizedComponentName === "outildedéconnexion") {
      const matchingKey = Object.keys(quantities).find(
        (key) => key.toLowerCase() === "nboutildeconnexion"
      );

      if (matchingKey) {
        const quantity = quantities[matchingKey];
        const totalPrice = quantity * cost;
        return { quantity: quantity, totalPrice: totalPrice };
      }
    } else {
      const matchingKey = Object.keys(quantities).find((key) => {
        const normalizedKey = key.toLowerCase().replace(/^nb/, "");
        const normalKey = key;
        // Normalize quantity key
        // Check if the normalized component name contains the normalized key or vice versa
        return (
          normalizedKey.includes(normalizedComponentName) || normalKey === usage
        );
      });
      if (matchingKey) {
        const quantity = quantities[matchingKey];
        const totalPrice = quantity * cost;
        return { quantity: quantity, totalPrice: totalPrice };
      }
    }

    return { quantity: 0, totalPrice: 0 };
  };

  useEffect(() => {
    setCurrentPage(1); // Reset to the first page when filters change
  }, [checked, isCheckedEcoya, isCheckedPowernity]);

  const PaginationProducts = filteredUserData.filter((user) => {
    // Apply 500/375 filter
    if (formattedSub === "Kit Pv") {
      if (checked === "375" && user.puissance_panneau !== 375) return false;
      if (checked === "500" && user.puissance_panneau !== 500) return false;
    }

    // Apply Powernity/Ecoya filter
    if (formattedSub === "Kit Pv") {
      if (isCheckedEcoya && !user.name.includes("Ecoya")) return false;
      if (isCheckedPowernity && !user.name.includes("Powernity")) return false;
    }

    return true; // Include the product if it passes all filters
  });

  useEffect(() => {
    // Update count based on the filtered products
    setCount(PaginationProducts.length);
  }, [PaginationProducts]);

  const startIndex = (currentPage - 1) * limit;
  const displayedProducts = PaginationProducts.slice(
    startIndex,
    startIndex + limit
  );

  const handleFilter = (filteredData: CardProps[]) => {
    setFilteredUserData(filteredData);
    setCount(filteredData.length);

    if (filteredData.length === 0) {
      setMessage("Aucune information trouvée");
    } else {
      setMessage(""); // Clear the message if there are results
    }
  };

  useEffect(() => {
    const fetchKits = async () => {
      try {
        const response = await fetch("/api/kits/kitphotoAll");
        const data = await response.json();

        if (data.success) {
          setPhotoKits(data.data);
          // Count items where puissance_panneau === 375
          const count375 = data.data.filter(
            (kit) => kit.puissance_panneau === 375
          ).length;
          setCount375(count375);

          // Count items where puissance_panneau === 500
          const count500 = data.data.filter(
            (kit) => kit.puissance_panneau === 500
          ).length;
          setCount500(count500);

          setCountAll(data.data.length);
          console.log("data.data.length", data.data.length);
        } else {
          setError(data.error || "Erreur lors de la récupération des kits");
        }
      } catch (error) {
        setError("Erreur lors de la récupération des kits");
      } finally {
        setLoading(false);
      }
    };

    fetchKits();
  }, []);

  console.log("photoKits", photoKits);
  console.log("checked", checked);
  return (
    <div className="flex-col justify-between lg:pt-[70px] pt-[60px]">
      <BannerTitle
        tile={`${
          formattedSub === "Onduleur Micro Onduleur"
            ? "Onduleur & Micro Onduleur"
            : formattedSub
        }`}
        paragraph={"Découvrez nos produits du Photovoltaïque"}
      />
      <Breadcrumb
        paths={[
          { name: "Accueil", url: "/" },
          {
            name: `${
              formattedSub === "Onduleur Micro Onduleur"
                ? "Onduleur & Micro Onduleur"
                : formattedSub
            }`,
            url: "#",
          },
        ]}
      />
      {/*{formattedSub === "Kit Pv" && <BannerKitPV />}*/}
      {formattedSub !== "Tous Les Produits" &&
      formattedSub !== "Kit Pv" &&
      formattedSub !== "Kit De Fixation" &&
      formattedSub !== "Pergola" &&
      formattedSub !== "Batteries" &&
      formattedSub !== "Onduleur Micro Onduleur" ? (
        <div className="p-10 lg:max-w-[1280px] w-full mx-auto">
          <ProductSearchBox
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            userData={products}
            onFilter={handleFilter}
          />
          <FilterBar
            setAffichage={setAffichage}
            affichage={affichage}
            count={!message ? count : 0}
          />
          <div className="mb-10">
            {affichage === "list" ? (
              message ? (
                <p className="text-black text-start w-full">{message}</p>
              ) : count > 0 ? (
                <ProductCardCol
                  displayedProducts={filteredUserData}
                  category={category}
                  image={imagesrc}
                  sub={sub}
                  type="product"
                />
              ) : (
                <p className="text-center w-full text-gray-500">
                  Aucun produit trouvé
                </p>
              )
            ) : message ? (
              <p className="text-black text-start w-full">{message}</p>
            ) : count > 0 ? (
              <ProductCard
                displayedProducts={filteredUserData}
                category={category}
                image={imagesrc}
                sub={sub}
                type="product"
              />
            ) : (
              <p className="text-center w-full text-gray-500">
                Aucun produit trouvé
              </p>
            )}

            {displayedProducts.length > 0 &&
              filteredUserData.length > 0 &&
              !message && (
                <div className="mt-10">
                  <PaginationCategory
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    count={count}
                    limit={limit}
                  />
                </div>
              )}
          </div>
        </div>
      ) : formattedSub === "Kit Pv" || formattedSub === "Kit De Fixation" ? (
        <div className="p-10 lg:max-w-[1280px] w-full mx-auto">
          {/* Product Search Box */}
          {formattedSub === "Kit Pv" ? (
            // Render ProductSearchBox for "Kit Pv" using kits
            <ProductSearchBox
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              userData={kits}
              onFilter={handleFilter}
              type="Kit Pv" // Set the type to "Kit Pv"
            />
          ) : (
            // Render ProductSearchBox for other cases using otherProduct
            <ProductSearchBox
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              userData={otherProduct.map((user) => {
                let totalPrice: string | null = null;

                if (formattedSub === "Kit De Fixation") {
                  // Calculate totalPrice for "Kit De Fixation"
                  if (user.kit && user.kit.composants) {
                    totalPrice = user.kit.composants
                      .reduce((total, composant) => {
                        const { totalPrice: componentTotalPrice } =
                          getComponentQuantityAndPrice(
                            user.quantities,
                            composant.cost,
                            composant.name,
                            composant.use
                          );
                        return total + componentTotalPrice;
                      }, 0)
                      .toFixed(0);
                    console.log("Total Price for Kit De Fixation:", totalPrice);
                  }
                }

                return {
                  ...user,
                  totalPrice,
                };
              })}
              onFilter={handleFilter}
              type="product" // Set the type to "product"
            />
          )}

          {/* Checkbox Section for Kit Pv */}
          {formattedSub === "Kit Pv" && (
            <div className="flex gap-4">
              {/* 500/375 Filter */}
              <div className="w-[50%] p-4 bg-white mt-10 border border-[#DFDFDF] rounded-[5px] justify-start gap-[50px] flex lg:flex-row flex-col">
                <p>Puissance du panneau:</p>
                <div className="lg:gap-2 gap-2 flex lg:flex-row flex-col">
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
              <div className="w-[50%] p-4 bg-white mt-10 border border-[#DFDFDF] rounded-[5px] justify-start gap-[50px] flex lg:flex-row flex-col">
                <p>Marque du panneau:</p>
                <div className="lg:gap-2 gap-2 flex lg:flex-row flex-col">
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
            </div>
          )}

          {/* Filter Bar */}
          <FilterBar
            setAffichage={setAffichage}
            affichage={affichage}
            count={PaginationProducts.length}
          />

          {/* Display Products */}
          <div className="mb-10">
            {affichage === "list" ? (
              message ? (
                <p className="text-black text-start w-full">{message}</p>
              ) : (
                <ProductCardCol
                  displayedProducts={displayedProducts
                    .filter((user) => {
                      console.log("User being filtered:", user); // Log the user object

                      if (formattedSub === "Kit Pv") {
                        if (!checked) return true; // If no filter is checked, include all users
                        if (checked === "375")
                          return user.puissance_panneau === 375; // Filter for 375
                        if (checked === "500")
                          return user.puissance_panneau === 500; // Filter for 500
                      }

                      return true; // Default to including the user if no conditions are met
                    })
                    .map((user) => {
                      let totalPrice: string | null = null;

                      if (formattedSub === "Kit De Fixation") {
                        // Calculate totalPrice for "Kit De Fixation"
                        if (user.kit && user.kit.composants) {
                          totalPrice = user.kit.composants
                            .reduce((total, composant) => {
                              const { totalPrice } =
                                getComponentQuantityAndPrice(
                                  user.quantities,
                                  composant.cost,
                                  composant.name,
                                  composant.use
                                );
                              return total + totalPrice;
                            }, 0)
                            .toFixed(0);
                        }
                      } else if (formattedSub === "Kit Pv") {
                        // Use the totalPrice from the endpoint for "Kit Pv"
                        totalPrice = user.totalPrice?.toFixed(0) || null;
                      }

                      return {
                        ...user,
                        totalPrice,
                      };
                    })}
                  category={category}
                  image={imagesrc}
                  sub={sub}
                  kitype={formattedSub}
                  type="kit"
                />
              )
            ) : message ? (
              <p className="text-black text-start w-full">{message}</p>
            ) : (
              <ProductCard
                displayedProducts={displayedProducts
                  .filter((user) => {
                    console.log("User being filtered:", user); // Log the user object

                    if (formattedSub === "Kit Pv") {
                      if (!checked) return true; // If no filter is checked, include all users
                      if (checked === "375")
                        return user.puissance_panneau === 375; // Filter for 375
                      if (checked === "500")
                        return user.puissance_panneau === 500; // Filter for 500
                    }

                    return true; // Default to including the user if no conditions are met
                  })
                  .map((user) => {
                    let totalPrice: string | null = null;

                    if (formattedSub === "Kit De Fixation") {
                      // Calculate totalPrice for "Kit De Fixation"
                      if (user.kit && user.kit.composants) {
                        totalPrice = user.kit.composants
                          .reduce((total, composant) => {
                            const { totalPrice } = getComponentQuantityAndPrice(
                              user.quantities,
                              composant.cost,
                              composant.name,
                              composant.use
                            );
                            return total + totalPrice;
                          }, 0)
                          .toFixed(0);
                      }
                    } else if (formattedSub === "Kit Pv") {
                      // Use the totalPrice from the endpoint for "Kit Pv"
                      console.log("user.kit?.totalPrice", user.totalPrice);
                      totalPrice = user.totalPrice?.toFixed(0) || 0;
                    }

                    return {
                      ...user,
                      totalPrice,
                    };
                  })}
                category={category}
                image={imagesrc}
                sub={sub}
                kitype={formattedSub}
                type="kit"
              />
            )}

            {/* Pagination */}
            {formattedSub !== "Kit De Fixation" &&
              displayedProducts.length > 0 &&
              filteredUserData.length > 0 &&
              !message && (
                <div className="mt-10">
                  <PaginationCategory
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    count={count}
                    limit={limit}
                  />
                </div>
              )}
          </div>
        </div>
      ) : formattedSub === "Tous Les Produits" ||
        formattedSub === "Onduleur Micro Onduleur" ? (
        <div className="p-10 lg:max-w-[1280px] w-full mx-auto">
          <ProductSearchBox
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            userData={products}
            onFilter={handleFilter}
          />
          {formattedSub === "Tous Les Produits" && (
            <div className="w-full p-4 bg-white mt-10 border border-[#DFDFDF] rounded-[5px] flex lg:flex-row flex-col justify-start gap-[30px]">
              <p>Catégories:</p>
              <div className="lg:gap-0 gap-2 flex lg:flex-row flex-col">
                <div className="lg:ml-0 ml-4 flex">
                  <input
                    type="checkbox"
                    value="Tous"
                    checked={selectedFilters.includes("")}
                    onChange={() => handleCheckboxChangeProduct("")}
                    className="  mt-0"
                  />

                  <label className="ml-[10px]">Tous</label>
                </div>
                <div className="flex">
                  <input
                    type="checkbox"
                    value="panneaux"
                    checked={selectedFilters.includes("panneaux")}
                    onChange={() => handleCheckboxChangeProduct("panneaux")}
                    className="ml-4  mt-0"
                  />
                  <label className="ml-[10px]">Panneaux</label>
                </div>
                <div>
                  <input
                    type="checkbox"
                    value="coffret-ac"
                    checked={selectedFilters.includes("coffret-ac")}
                    onChange={() => handleCheckboxChangeProduct("coffret-ac")}
                    className="ml-4  mt-0"
                  />
                  <label className="ml-[10px]">Coffret AC</label>
                </div>
                <div>
                  <input
                    type="checkbox"
                    value="onduleurs"
                    checked={selectedFilters.includes("onduleurs")}
                    onChange={() => handleCheckboxChangeProduct("onduleurs")}
                    className="ml-4  mt-0"
                  />
                  <label className="ml-[10px]">Onduleur/Micro-Onduleur</label>
                </div>
                <div>
                  <input
                    type="checkbox"
                    value="fixation"
                    checked={selectedFilters.includes("fixation")}
                    onChange={() => handleCheckboxChangeProduct("fixation")}
                    className="ml-4  mt-0"
                  />
                  <label className="ml-[10px]">Fixation</label>
                </div>
                <div>
                  <input
                    type="checkbox"
                    value="boitier-dtu"
                    checked={selectedFilters.includes("boitier-dtu")}
                    onChange={() => handleCheckboxChangeProduct("boitier-dtu")}
                    className="ml-4  mt-0"
                  />
                  <label className="ml-[10px]">
                    Boitier DTU/Passerelle WIFI
                  </label>
                </div>
                <div>
                  <input
                    type="checkbox"
                    value="accessoires"
                    checked={selectedFilters.includes("accessoires")}
                    onChange={() => handleCheckboxChangeProduct("accessoires")}
                    className="ml-4 mt-0"
                  />
                  <label className="ml-[10px]">Accessoires</label>
                </div>
              </div>
            </div>
          )}
          <FilterBar
            setAffichage={setAffichage}
            affichage={affichage}
            count={
              formattedSub !== "Onduleur Micro Onduleur"
                ? !message
                  ? count
                  : 0
                : displayedProducts.filter((product) =>
                    product.cat.toLowerCase().includes("onduleurs")
                  ).length
            }
          />
          <div className="mb-10">
            {affichage === "list" ? (
              message ? (
                <p className="text-black text-start w-full">{message}</p>
              ) : formattedSub === "Onduleur Micro Onduleur" ? (
                <ProductCardCol
                  displayedProducts={displayedProducts.filter((product) =>
                    product.cat.toLowerCase().includes("onduleurs")
                  )}
                  category={category}
                  image={imagesrc}
                  sub={sub}
                  kitype={formattedSub}
                  type="product"
                />
              ) : displayedProducts.length > 0 ? (
                <ProductCardCol
                  displayedProducts={displayedProducts}
                  category={category}
                  image={imagesrc}
                  sub={sub}
                  kitype={formattedSub}
                  type="product"
                />
              ) : (
                <p className="text-center w-full text-gray-500">
                  Aucun produit trouvé
                </p>
              )
            ) : message ? (
              <p className="text-black text-start w-full">{message}</p>
            ) : formattedSub === "Onduleur Micro Onduleur" ? (
              <ProductCard
                displayedProducts={displayedProducts.filter((product) =>
                  product.cat.toLowerCase().includes("onduleurs")
                )}
                category={category}
                image={imagesrc}
                sub={sub}
                kitype={formattedSub}
                type="product"
              />
            ) : displayedProducts.length > 0 ? (
              <ProductCard
                displayedProducts={displayedProducts}
                category={category}
                image={imagesrc}
                sub={sub}
                kitype={formattedSub}
                type="product"
              />
            ) : (
              <p className="text-center w-full text-gray-500">
                Aucun produit trouvé
              </p>
            )}

            {formattedSub !== "Onduleur Micro Onduleur" &&
              displayedProducts.length > 0 &&
              filteredUserData.length > 0 &&
              !message && (
                <div className="mt-10">
                  <PaginationCategory
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    count={products.length}
                    limit={12}
                  />
                </div>
              )}
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center lg:p-[250px] lg:mt-0 mt-[250px]">
          <p className="text-red-500 text-center">
            Aucun produit n&apos;est disponible pour le moment. Veuillez
            vérifier ultérieurement.
          </p>
        </div>
      )}
    </div>
  );
};

export default Page;
