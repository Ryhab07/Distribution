"use client";
import Breadcrumb from "@/components/reusable/BreadCrumb";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ComboboxDemo } from "@/components/reusable/options";
import { Check, ChevronDown, ChevronUp, ShoppingCart } from "lucide-react";
import { addKitToCart, addToCart } from "@/redux/store/cartSlice";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import Title from "@/components/reusable/BigTitle";
import { getKitsWithPricesAndQuantities } from "@/utils/kitService";
import BannerTitle from "@/components/reusable/BannerTitle";
import kitPV from "@/assets/images/panneau-solaire-full-black.png";
import touslesproduits from "@/assets/images/tous-les-produits.png";
import SimilarProductCard from "@/components/reusable/SimilarProductCard";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface Option {
  label: string;
  value: string;
}

interface Framework {
  value: string;
  label: string;
}

interface Product {
  [key: string]: any;
}

const Page = () => {
  const params = useParams();
  const { id, category, sub } = params || {};
  const [filteredUserData, setFilteredUserData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [kits, setKits] = useState<any[]>([]);
  const [kitproducts, setKitProducts] = useState<any[]>([]);
  const [typeKit, setTypeKit] = useState<string | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [addedToCart, setAddedToCart] = useState<boolean>(false);
  const [composantKit, setComposantKit] = useState<any>([]);
  const [installateur] = useState("");
  const [chantier, setChantier] = useState("");
  const [kitValidated, setKitValidated] = useState(false);
  const [toitureError, setToitureError] = useState("");

  console.log("error", error);

  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();

  // Decode the URL-encoded string
  /*const decodedString = Array.isArray(category)
    ? category.map((item) => decodeURIComponent(item)).join(" ") // Join array items with space
    : decodeURIComponent(category || "");*/

  const decodedStringSub = Array.isArray(sub)
    ? sub.map((item) => decodeURIComponent(item)).join(" ") // Join array items with space
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
        .map((word) => capitalizeFirstLetter(word)) // Capitalize the first letter of each word
        .join(" ") // Join the words with spaces
    : decodedString
        .split("-")
        .map((word) => capitalizeFirstLetter(word))
        .join(" ");*/

  const formattedSub = Array.isArray(decodedStringSub)
    ? decodedStringSub
        .split("-") // Split the string by dashes
        .map((word) => capitalizeFirstLetter(word)) // Capitalize the first letter of each word
        .join(" ") // Join the words with spaces
    : decodedStringSub
        .split("-")
        .map((word) => capitalizeFirstLetter(word))
        .join(" ");

  let imagesrc;

  switch (formattedSub) {
    case "Kit Pv":
      imagesrc = kitPV;

      break;
    case "Tous Les Produits":
      imagesrc = touslesproduits;

      break;
    case "Onduleur Micro Onduleur":
      imagesrc = "https://i.ibb.co/4WXmzWP/onduleur-micro-onduleur.png";

      break;
    case "Kit De Fixation":
      imagesrc = "https://i.ibb.co/hXCdvbC/kit-fixation.png";

      break;
    case "Pergola":
      imagesrc = "https://i.ibb.co/TvJ4L80/pergola.png";

      break;
    case "Onduleur Micro Onduleur":
      imagesrc = "https://i.ibb.co/4WXmzWP/onduleur-micro-onduleur.png";

      break;
    default:
  }

  useEffect(() => {
    // Set the type of kit based on the formattedSub value
    if (formattedSub === "Kit Pv") {
      setTypeKit("photovoltaiques");
      setUrl(`/api/kits/${id}`);
    } else if (formattedSub === "Kit De Fixation") {
      setTypeKit("fixation");
      setUrl("/api/kits/kitRoutes?type=fixation");
    }
  }, [formattedSub]);

  // Fetches The product details
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await fetch(`/api/b365/fetchProduct?productNO=${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const jsonData = await response.json();
        setFilteredUserData(jsonData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [id]);

  /*useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const response = await fetch(
          `/api/b365/fetchCategory?category=${filteredUserData.Item_Category_Code}&page=1&limit=4`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const jsonData = await response.json();
        setFilteredUserDataAll(jsonData.products);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [filteredUserData.Item_Category_Code]);*/

  /*const marque: Option[] = [
    { label: "Hoymiles", value: "hoymiles" },
    { label: "Powernity ", value: "powernity" },
  ];*/

  const toiture: Option[] = [
    { label: "Tuile ardoise", value: "tuile-ardoise" },
    { label: "Tuile canal", value: "tuile-canal" },
    { label: "Tuile mécanique", value: "tuile-mécanique" },
    { label: "Tuile plate", value: "tuile-plate" },
    { label: "Bacs acier", value: "bacs-acier" },
    { label: "Fibro ciment", value: "fibro-ciment" },
  ];

  const options = [
    //{ label: "Marque du Micro-Onduleur", frameworks: marque },
    { label: "Type de toiture", frameworks: toiture },
  ];

  const [selectedOptions, setSelectedOptions] = useState<
    Array<Framework | null>
  >(options.map(() => null));

  const handleOptionSelect = (
    index: number,
    selectedOption: Framework | null
  ) => {
    const newSelectedOptions = [...selectedOptions];
    newSelectedOptions[index] = selectedOption;

    setSelectedOptions(newSelectedOptions);
    setToitureError("");
  };

  const handleIncrement = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1);
    }
  };

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id: filteredUserData._id,
        ref: filteredUserData.ref,
        name: filteredUserData.name,
        price: filteredUserData.cost,
        stock: filteredUserData.stock,
        image: `/images/${filteredUserData.image}`,
        desc: filteredUserData.description || filteredUserData.name,
        typeStock: filteredUserData.typeStock,
        quantity: quantity,
        option1: selectedOptions[0]?.label ?? null,
        option2: selectedOptions[1]?.label ?? null,
        sales: 0,
        installateur: installateur,
        chantier: chantier,
        creatorID: sessionStorage.getItem("id") || "",
      })
    );
    setAddedToCart(true);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    if (
      formattedSub === "Tous Les Produits" ||
      formattedSub === "Onduleur Micro Onduleur"
    ) {
      const fetchAllData = async () => {
        try {
          const response = await fetch(`/api/kits/productRoutes`);
          if (!response.ok) {
            throw new Error("Failed to fetch data");
          }
          const jsonData = await response.json();

          // Filter the product based on id
          const filteredProduct = jsonData.filter(
            (product) => product._id === id
          );

          // Filter out the selected product and shuffle the remaining products
          const filteredProducts = jsonData
            .filter((product) => product._id !== id)
            .sort(() => Math.random() - 0.5)
            .slice(0, 5);

          // Set the state with the filtered and shuffled products
          setProducts(filteredProducts);
          setFilteredUserData(filteredProduct[0]);
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

          let allData = [];
          if (formattedSub === "Kit De Fixation") {
            allData = dataKits.filter((product) => product._id === id);
          }

          setKits(dataKits);
          setKitProducts(dataProducts);

          if (allData.length > 0) {
            setFilteredUserData(allData[0]);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment     
            // @ts-ignore
            setComposantKit(allData[0].composants);
          }

          setLoading(false);
        } catch (error) {
          console.error("Error fetching data:", error);
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [typeKit, formattedSub, url]);

  useEffect(() => {
    // Only run this effect if formattedSub is "Kit De Fixation"
    if (formattedSub === "Kit De Fixation") {
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
            setKits(updatedKits);
          }
        }
      };

      updateKitsWithPricesAndQuantities();
    }
  }, [formattedSub, kitproducts, kits]); // Add formattedSub to the dependency array

  /*useEffect(() => {
    const updateKitsWithPricesAndQuantities = async () => {
      if (kits.length > 0 && kitproducts.length > 0) {
        const kitsWithPricesAndQuantities = await getKitsWithPricesAndQuantities(kitproducts, kits);
        if (Array.isArray(kitsWithPricesAndQuantities)) {
          const updatedKits = kitsWithPricesAndQuantities.map((kit) => {
            // Check stock status of each component
            const componentsStock = kit.kit.composants.every((composant) => {
              const { quantity } = getComponentQuantityAndPrice(kit.quantities, composant.cost, composant.name, composant.use);
              return quantity > 0;
            });
  
            // Set overall stock status of the kit based on components' stock status
            const stockStatus = componentsStock ? "Disponible" : "Indisponible";
  
            return {
              ...kit,
              stock: stockStatus,
            };
          });
          setKits(updatedKits);
        }
      }
    };
  
    updateKitsWithPricesAndQuantities();
  }, [kitproducts, kits]);*/

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

  //new kit
  const handleAddToCartKit = (kit: any) => {
    let totalPrice = 0; // Initialize totalPrice

    //const kitId = kit.kit._id;

    // Create an array of composants for the payload
    const composants =
      kit?.kit?.composants?.map((composant: any) => {
        const { quantity: composantQuantity, totalPrice: composantTotalPrice } =
          getComponentQuantityAndPrice(
            kit.quantities,
            composant.cost,
            composant.name,
            composant.use
          );

        // Adjust the composant quantity by multiplying with the kit quantity
        const adjustedQuantity = composantQuantity * quantity;

        // Add composantTotalPrice to totalPrice
        totalPrice += composantTotalPrice;

        // Determine the custom ID based on selectedOptions[0]?.label
        let id = composant.ref;
        if (composant.name === "Crochets") {
          switch (selectedOptions[0]?.label) {
            case "Tuile ardoise":
              id = "RH-304-000702";
              break;
            case "Tuile canal":
              id = "RH-304-000701";
              break;
            case "Tuile mécanique":
              id = "RH-304-0018";
              break;
            case "Tuile plate":
              id = "RH-304-0016";
              break;
            default:
              break;
          }
        }

        // Return the composant information along with its quantity and totalPrice
        return {
          id: id,
          name: composant.name,
          quantity: adjustedQuantity,
          price: composant.cost,
          totalPrice:
            typeof composantTotalPrice === "number"
              ? Number(composantTotalPrice.toFixed(2))
              : 0,
          image: imagesrc,
          desc: composant.name,
          stock: composant.stock,
          typeStock: "",
          option1: selectedOptions[0]?.label ?? null,
          option2: selectedOptions[1]?.label ?? null,
          sales: 0,
          installateur: installateur,
          chantier: chantier,
          creatorID: sessionStorage.getItem("id") || "",
        };
      }) || [];

    // Dispatch the addToCart action with the kit information
    dispatch(
      addKitToCart({
        id: !kit.name.includes("Kit de fixation")
          ? `KIT${kit?.kit?.puissance / 1000}KWc/P${
              kit?.kit?.puissance_panneau
            }/${
              kit?.kit?.type_alim_elec === "Monophasé" ? "Mono" : "TRI"
            }/${chantier}`
          : (() => {
              const kitName = kit?.name;
              if (kitName.includes("Bacs Acier")) {
                return "KITFIXBACSACIER";
              } else if (kitName.includes("Tuile Mécanique")) {
                return "KITFIXMECANIQUE";
              } else if (kitName.includes("Tuile Ardoise")) {
                return "KITFIXARDOISE";
              } else if (kitName.includes("Tuile Canal")) {
                return "KITFIXCANAL";
              } else if (kitName.includes("Tuile Plate")) {
                return "KITFIXPLATE";
              } else if (kitName.includes("Bac à lester")) {
                return "KITFIXBACALESTER";
              } else {
                // Default case: remove spaces and convert to uppercase
                return `KITFIX${kit?.name
                  .split(" ")
                  .slice(-2)
                  .join("")
                  .toUpperCase()}`;
              }
            })(),

        kitName: kit.name,
        kitPuissance: kit?.kit?.puissance_panneau ?? "",
        ref: `KIT${kit?.kit?.puissance / 1000}KWc/P${
          kit?.kit?.puissance_panneau
        }/${
          kit?.kit?.type_alim_elec === "Monophasé" ? "Mono" : "TRI"
        }/${chantier}`,
        totalPrice: totalPrice,
        image: imagesrc,
        quantity: quantity,
        composants: composants,
        option1: selectedOptions[0]?.label ?? "",
        option2: selectedOptions[1]?.label ?? "",
        installateur: installateur,
        chantier: chantier,
        desc: filteredUserData.description || filteredUserData.name,
        creatorID: sessionStorage.getItem("id") || "",
        //puissance: "",
      })
    );

    setAddedToCart(true);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleAddToCartPVKit = (kit: any) => {
    //const kitId = kit.kit._id;
    console.log("kit", kit)
    // Create an array of composants for the payload
  // Map composants to include composant.ref instead of composant.id
  const composants = kit.composants.map((composant: any) => ({
    ...composant,
    id: composant.ref, // Replace id with ref
  }));

    // Dispatch the addToCart action with the kit information
    dispatch(
      addKitToCart({
        id: !kit.name.includes("Kit de fixation")
          ? `KIT${kit?.puissance / 1000}KWc/P${
              kit?.puissance_panneau
            }/${
              kit?.type_alim_elec === "Monophasé" ? "Mono" : "TRI"
            }/${chantier}`
          : (() => {
              const kitName = kit?.name;
              if (kitName.includes("Bacs Acier")) {
                return "KITFIXBACSACIER";
              } else if (kitName.includes("Tuile Mécanique")) {
                return "KITFIXMECANIQUE";
              } else if (kitName.includes("Tuile Ardoise")) {
                return "KITFIXARDOISE";
              } else if (kitName.includes("Tuile Canal")) {
                return "KITFIXCANAL";
              } else if (kitName.includes("Tuile Plate")) {
                return "KITFIXPLATE";
              } else if (kitName.includes("Bac à lester")) {
                return "KITFIXBACALESTER";
              } else {
                // Default case: remove spaces and convert to uppercase
                return `KITFIX${kit?.name
                  .split(" ")
                  .slice(-2)
                  .join("")
                  .toUpperCase()}`;
              }
            })(),

        kitName: kit.name,
        kitPuissance: kit?.puissance_panneau ?? "",
        ref: `KIT${kit?.puissance / 1000}KWc/P${kit?.puissance_panneau}/${
          kit?.type_alim_elec === "Monophasé" ? "Mono" : "TRI"
        }/${chantier}`,
        totalPrice: kit.totalPrice,
        image: imagesrc,
        quantity: quantity,
        composants: composants,
        option1: selectedOptions[0]?.label ?? "",
        option2: selectedOptions[1]?.label ?? "",
        installateur: installateur,
        chantier: chantier,
        desc: kit?.description || kit.name,
        creatorID: sessionStorage.getItem("id") || "",
        //puissance: "",
      })
    );

    setAddedToCart(true);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleVerifyKit = async (kit: any) => {
    try {
      const selectedOption = selectedOptions[0]?.label;
  
      if (!selectedOption) {
        setToitureError("Le type de toiture doit être validé avant de pouvoir ajouter le kit au panier.");
        return;
      }
  
      const response = await fetch("/api/kits/recalculateKitBasedOnOption", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          kitName: kit.name,
          option: selectedOption,
        }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to recalculate kit");
      }
  
      const updatedKit = await response.json();
      setKitValidated(true)
      console.log("Updated Kit:", updatedKit); // Log the updated kit
  
      setKits((prevKits) => ({
        ...prevKits,
        data: updatedKit.data, // Update the kit data with the recalculated kit
      }));

    } catch (error) {
      console.error("Error verifying kit:", error);
      alert("Une erreur s'est produite lors de la vérification du kit.");
    }
  };

  useEffect(() => {
    console.log("Kits data updated:", kits.data);
  }, [kits.data]);
  

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="flex-col justify-between lg:p-0  lg:pt-[70px] pt-[60px]">
      <BannerTitle
        tile={
          formattedSub === "Kit Pv"
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment     
            // @ts-ignore
            ? kits.data?.name || "Chargement..." // Fallback if kits.data is undefined
            : filteredUserData?.name || "Chargement..." // Fallback if filteredUserData is undefined
        }
        paragraph=""
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
            url: `/produits/${category}/${sub}`,
          },
          {
            name:
              formattedSub === "Kit Pv"
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment     
              // @ts-ignore              
                ? kits.data?.name || "Chargement..." // Fallback if kits.data is undefined
                : filteredUserData?.name || "Chargement...", // Fallback if filteredUserData is undefined
            url: "#", // Add the url property here
          },
        ]}
      />
      {formattedSub !== "Kit Pv" && formattedSub !== "Kit De Fixation" ? (
        <>
          <div className="pt-20 max-w-[1280px] mx-auto">
            <div className="flex justify-center gap-8 lg:flex-row flex-col ">
              <div className="w-full lg:w-[42%] md:w-[90%] md:mx-auto bg-gray-50 p-8 text-center flex justify-center object-contain  ">
                <Image
                  className="mx-auto"
                  src={`/images/${filteredUserData.image}`}
                  alt="image-de-produit"
                  width={300}
                  height={50}
                />
              </div>
              <div className=" lg:w-[42%] md:w-[90%] md:mx-auto w-[90%] mx-auto">
                <div className="flex justify-between mb-2">
                  <h2 className="text-2xl font-bold">
                    {filteredUserData.name}
                  </h2>
                </div>
                <div className="flex justify-between">
                  <p className="text-[#5F5F5F]">
                    Référence :{" "}
                    <span className={`text-[16px] text-devinovBleu`}>
                      {filteredUserData.ref}
                    </span>
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-[#5F5F5F]">
                    Stock :{" "}
                    <span
                      className={`text-[16px] ${
                        filteredUserData.stock === 0 ||
                        filteredUserData.stock_reel === 0 ||
                        filteredUserData.status !== "available"
                          ? " text-red-500"
                          : "text-devinovGreen"
                      }`}
                    >
                      {filteredUserData.stock === 0 ||
                      filteredUserData.stock_reel === 0 ||
                      filteredUserData.status !== "available"
                        ? "Indisponible"
                        : "Disponible"}
                    </span>
                  </p>
                  <h1 className="text-2xl font-bold text-devinovBleu">
                    {filteredUserData.cost}€
                  </h1>
                </div>
                <div className="flex justify-between  flex-wrap lg:gap-0 gap-2">
                  <div className="flex justify-start gap-2">
                    {/*<div className="mt-4 mb-4 flex justify-center w-1/2 items-center gap-2 ">
                        <Label
                          className="text-center text-[13px] font-bold"
                          htmlFor="installateur"
                        >
                          Installateur:
                        </Label>
                        <Input
                          type="text"
                          placeholder=""
                          value={installateur}
                          onChange={(e) => setInstallateur(e.target.value)}
                          className="border !border-[#DFDFDF] rounded-[10px]"
                        />
                      </div>*/}

                    <div className="mt-4 mb-4 flex justify-center w-1/2 items-center gap-2 ">
                      <Label
                        className="text-center text-[13px] font-bold"
                        htmlFor="chantier"
                      >
                        Référence Chantier:
                      </Label>
                      <Input
                        type="text"
                        placeholder=""
                        value={chantier}
                        onChange={(e) => setChantier(e.target.value)}
                        className="border !border-[#DFDFDF] rounded-[10px]"
                      />
                    </div>
                  </div>
                  {formattedSub === "Kit Pv" && (
                    <>
                      {options.map((option, index) => (
                        <div key={index}>
                          <p className="mb-1 font-400 text-devinovGreen">
                            {option.label}
                          </p>
                          <ComboboxDemo
                            frameworks={option.frameworks}
                            option={option.label}
                            defaultValue={""}
                            onOptionSelect={(selectedOption) =>
                              handleOptionSelect(index, selectedOption)
                            }
                          />
                        </div>
                      ))}
                    </>
                  )}

                  {/*{formattedSub === "Tous Les Produits" &&
                    filteredUserData &&
                    filteredUserData.name &&
                    filteredUserData.name.includes("Micro-onduleur") && (
                      <>
                        {options.length > 0 && (
                          <div>
                            <p className="mb-1 font-400 text-devinovGreen">
                              {options[0].label}
                            </p>
                            <ComboboxDemo
                              frameworks={options[0].frameworks}
                              option={options[0].label}
                              defaultValue={""}
                              onOptionSelect={(selectedOption) =>
                                handleOptionSelect(0, selectedOption)
                              }
                            />
                          </div>
                        )}
                      </>
                    )}

                  {formattedSub === "Onduleur Micro Onduleur" &&
                    filteredUserData &&
                    filteredUserData.name &&
                    filteredUserData.name.includes("Micro-onduleur") && (
                      <>
                        {options.length > 0 && (
                          <div>
                            <p className="mb-1 font-400 text-devinovGreen">
                              {options[0].label}
                            </p>
                            <ComboboxDemo
                              frameworks={options[0].frameworks}
                              option={options[0].label}
                              defaultValue={""}
                              onOptionSelect={(selectedOption) =>
                                handleOptionSelect(0, selectedOption)
                              }
                            />
                          </div>
                        )}
                      </>
                            )}*/}

                  <div>
                    <p className="mb-1 font-400 text-devinovGreen">Quantité</p>
                    <div className="flex justify-center  w-[80px] border border-gray-200">
                      <div className="w-[80%] p-2 flex justify-center">
                        {quantity}
                      </div>
                      <div className="w-[40%]  p-1">
                        <ChevronUp
                          onClick={handleIncrement}
                          className="ml-2 h-4 w-4 shrink-0 opacity-50 cursor-pointer"
                        />
                        <ChevronDown
                          onClick={handleDecrement}
                          className="ml-2 h-4 w-4 shrink-0 opacity-50 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex lg:flex-row flex-col justify-start gap-4">
                  <div className="mt-14 mb-2">
                    <Button
                      className="bg-[#255D74]"
                      onClick={handleAddToCart}
                      disabled={
                        filteredUserData.stock === 0 ||
                        filteredUserData.stock_reel === 0 ||
                        filteredUserData.status !== "available"
                      }
                    >
                      <ShoppingCart />
                      <span className="ml-2">Ajouter au panier</span>
                    </Button>
                  </div>
                  <div className="mt-[60px] mb-2">
                    {addedToCart === true && (
                      <p className="text-green-700">
                        le produit a été ajouté au panier
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-20 mb-10 mx-auto lg:w-[90%] w-full">
              <div className="">
                <Title>Produits similaires</Title>

                <SimilarProductCard
                  displayedProducts={products}
                  image={imagesrc}
                  category={category}
                  sub={sub}
                  type="product"
                />
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {formattedSub === "Kit De Fixation" ? (
            <div className="pt-20 max-w-[1280px] mx-auto">
              {kits
                .filter((kit) => kit.id === id)
                .map((filteredKit, index) => (
                  <div
                    key={index}
                    className="flex justify-center gap-8 lg:flex-row flex-col "
                  >
                    <div className="w-full lg:w-[42%] lg:h-[80%] bg-gray-50 p-8 text-center flex justify-center object-contain  ">
                      <Image
                        className="mx-auto lg:w-[320px] lg:h-[320px]"
                        src={imagesrc}
                        alt="image-de-produit"
                        width={300}
                        height={50}
                      />
                    </div>

                    <div className=" lg:w-[50%] w-[90%] mx-auto">
                      <div className="flex justify-between mb-2">
                        <h1 className="text-2xl font-bold">
                          {filteredKit.name}
                        </h1>
                      </div>
                      <div className="flex justify-between">
                        <p className="text-[#5F5F5F]">
                          Stock :{" "}
                          <span
                            className={`text-[16px] text-devinovGreen
                            `}
                          >
                            Disponible
                          </span>
                        </p>
                        <h1 className="text-2xl font-bold text-devinovBleu">
                          {filteredKit?.kit?.composants &&
                            filteredKit.kit.composants
                              .reduce((total, composant) => {
                                const { totalPrice } =
                                  getComponentQuantityAndPrice(
                                    filteredKit.quantities,
                                    composant.cost,
                                    composant.name,
                                    composant.use
                                  );
                                return total + totalPrice;
                              }, 0)
                              .toFixed(0)}
                          €
                        </h1>
                      </div>
                      Composition :
                      <ul className="mt-4">
                        {filteredKit?.kit?.composants &&
                          filteredKit.kit.composants.map((composant) => {
                            const { quantity } = getComponentQuantityAndPrice(
                              filteredKit.quantities,
                              composant.cost,
                              composant.name,
                              composant.use
                            );

                            // Check if quantity is not zero before rendering the name
                            if (quantity !== 0) {
                              return (
                                <div
                                  key={composant._id}
                                  className="w-full flex"
                                >
                                  <div className="w-[18px] text-[#255D74] font-[700]">
                                    {quantity}{" "}
                                  </div>
                                  <div className="w-4">*</div>
                                  <div className="font-[400]">
                                    {composant.name === "Crochets" &&
                                    selectedOptions[0]?.label ? (
                                      selectedOptions[0].label.includes(
                                        "Bacs acier"
                                      ) ||
                                      selectedOptions[0].label.includes(
                                        "Fibro ciment"
                                      ) ? (
                                        <>
                                          Tirefonds
                                          <span
                                            style={{ fontWeight: "bold" }}
                                          >{` [380064-1]`}</span>
                                        </>
                                      ) : selectedOptions[0].label.includes(
                                          "Tuile ardoise"
                                        ) ? (
                                        <>
                                          Crochets {selectedOptions[0].label}
                                          <span
                                            style={{ fontWeight: "bold" }}
                                          >{` [RH-304-0007-2]`}</span>
                                        </>
                                      ) : selectedOptions[0].label.includes(
                                          "Tuile canal"
                                        ) ? (
                                        <>
                                          Crochets {selectedOptions[0].label}
                                          <span
                                            style={{ fontWeight: "bold" }}
                                          >{` [RH-304-000701R59]`}</span>
                                        </>
                                      ) : selectedOptions[0].label.includes(
                                          "Tuile mécanique"
                                        ) ? (
                                        <>
                                          Crochets {selectedOptions[0].label}
                                          <span
                                            style={{ fontWeight: "bold" }}
                                          >{` [RH-304-0059]`}</span>
                                        </>
                                      ) : selectedOptions[0].label.includes(
                                          "Tuile plate"
                                        ) ? (
                                        <>
                                          Crochets {selectedOptions[0].label}
                                          <span
                                            style={{ fontWeight: "bold" }}
                                          >{` [RH-304-0016]`}</span>
                                        </>
                                      ) : (
                                        <>
                                          Crochets {selectedOptions[0].label}
                                          <span
                                            style={{ fontWeight: "bold" }}
                                          >{` [${composant.ref}]`}</span>
                                        </>
                                      )
                                    ) : (
                                      <>
                                        {composant.name}{" "}
                                        {composant.name === "Fibro ciment" ? (
                                          <span style={{ fontWeight: "bold" }}>
                                            1712-36-2
                                          </span>
                                        ) : composant.name ===
                                          "Tuile ardoise" ? (
                                          <span style={{ fontWeight: "bold" }}>
                                            380080
                                          </span>
                                        ) : composant.name === "Tuile canal" ? (
                                          <span style={{ fontWeight: "bold" }}>
                                            RH-304-000701
                                          </span>
                                        ) : composant.name ===
                                          "Tuile mécanique" ? (
                                          <span style={{ fontWeight: "bold" }}>
                                            2003144
                                          </span>
                                        ) : composant.name === "Tuile plate" ? (
                                          <span style={{ fontWeight: "bold" }}>
                                            1000214
                                          </span>
                                        ) : composant.name === "Bacs acier" ? (
                                          <span style={{ fontWeight: "bold" }}>
                                            1712-36-3
                                          </span>
                                        ) : (
                                          <span
                                            style={{ fontWeight: "bold" }}
                                          >{`[${composant.ref}]`}</span>
                                        )}
                                      </>
                                    )}
                                  </div>
                                </div>
                              );
                            }
                            // If quantity is zero, don't render anything
                            return null;
                          })}
                      </ul>
                      <div className="flex justify-start gap-2 ">
                        {/*<div className="mt-4 mb-4 flex justify-center w-1/2 items-center gap-2 ">
                          <Label
                            className="text-center text-[13px] font-bold"
                            htmlFor="installateur"
                          >
                            Installateur:
                          </Label>
                          <Input
                            type="text"
                            placeholder=""
                            value={installateur}
                            onChange={(e) => setInstallateur(e.target.value)}
                            className="border !border-[#DFDFDF] rounded-[10px]"
                          />
                        </div>*/}

                        <div className="mt-4 mb-4 flex justify-center w-1/2 items-center gap-2 ">
                          <Label
                            className="text-center text-[13px] font-bold"
                            htmlFor="chantier"
                          >
                            Référence Chantier:
                          </Label>
                          <Input
                            type="text"
                            placeholder=""
                            value={chantier}
                            onChange={(e) => setChantier(e.target.value)}
                            className="border !border-[#DFDFDF] rounded-[10px]"
                          />
                        </div>
                      </div>
                      <div className="flex justify-start mt-10 flex-wrap lg:gap-2 gap-1">
                        {formattedSub === "Kit Pv" && (
                          <>
                            {options.map((option, index) => (
                              <div key={index}>
                                <p className="mb-1 font-400 text-devinovGreen">
                                  {option.label}
                                </p>
                                <ComboboxDemo
                                  frameworks={option.frameworks}
                                  option={option.label}
                                  defaultValue={""}
                                  onOptionSelect={(selectedOption) =>
                                    handleOptionSelect(index, selectedOption)
                                  }
                                />
                              </div>
                            ))}
                          </>
                        )}

                        <div>
                          <p className="mb-1 font-400 text-devinovGreen">
                            Quantité
                          </p>
                          <div className="flex justify-center  w-[80px] border border-gray-200">
                            <div className="w-[80%] p-2 flex justify-center">
                              {quantity}
                            </div>
                            <div className="w-[40%]  p-1">
                              <ChevronUp
                                onClick={handleIncrement}
                                className="ml-2 h-4 w-4 shrink-0 opacity-50 cursor-pointer"
                              />
                              <ChevronDown
                                onClick={handleDecrement}
                                className="ml-2 h-4 w-4 shrink-0 opacity-50 cursor-pointer"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex lg:flex-row flex-col justify-start gap-4">
                        <div className="mt-6 mb-2">
                          <Button
                            className="bg-[#255D74]"
                            onClick={() => handleAddToCartKit(filteredKit)}
                          >
                            <ShoppingCart />
                            <span className="ml-2">Ajouter au panier</span>
                          </Button>
                        </div>
                        <div className="mt-8 mb-2">
                          {addedToCart === true && (
                            <p className="text-green-700">
                              le produit a été ajouté au panier
                            </p>
                          )}
                        </div>
                      </div>
                      
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="pt-20 max-w-[1280px] mx-auto">
              
              {kits?.data && ( // Check if kits.data exists
                <div
                  key={kits.data._id} // Use _id as the key
                  className="flex justify-center gap-8 lg:flex-row flex-col"
                >
                  <div className="w-full lg:w-[42%] lg:h-[80%] bg-gray-50 p-8 text-center flex justify-center object-contain">
                    <Image
                      className="mx-auto lg:w-[320px] lg:h-[320px]"
                      src={imagesrc}
                      alt="image-de-produit"
                      width={300}
                      height={50}
                    />
                  </div>

                  <div className="lg:w-[50%] w-[90%] mx-auto">
                    <div className="flex justify-between mb-2">
                      <h1 className="text-2xl font-bold">{kits?.data?.name}</h1>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-[#5F5F5F]">
                        Stock :{" "}
                        <span className="text-[16px] text-devinovGreen">
                          Disponible
                        </span>
                      </p>
                      <h1 className="text-2xl font-bold text-devinovBleu">
                        {kits.data.totalPrice.toFixed(0)}€
                      </h1>
                    </div>
                    
                    <p className="my-4"><span className="text-[#5F5F5F]"> Description : </span>{kits.data.description}</p>
                    Composition :
                    <ul className="mt-4">
                      {kits.data.composants
                        .filter((composant) => {
                          // Hide FA0127 if formattedSub === "Kit Pv"
                          if (
                            formattedSub === "Kit Pv" &&
                            selectedOptions &&
                            (selectedOptions[0]?.label.includes("Bacs acier") ||
                              selectedOptions[0]?.label.includes(
                                "Fibro ciment"
                              )) &&
                            composant.ref === "FA0127"
                          ) {
                            return false;
                          }
                          return true;
                        })
                        .map((composant) => {
                          // Check if quantity is not zero before rendering the name
                          if (composant.quantity !== 0) {
                            // Update R59 to RF-0125 and calculate new quantity if formattedSub === "Kit Pv"
                            if (
                              formattedSub === "Kit Pv" &&
                              composant.ref === "R59" &&
                              composant.ref === "R59-01" &&
                              selectedOptions &&
                              selectedOptions[0]?.label.includes("Bacs acier")
                            ) {
                              // Find the item where use === "nbPanneaux"
                              const panneauItem = kits.data.composants.find(
                                (item) => item.use === "nbPanneaux"
                              );

                              // Get the quantity of the panneau item, default to 0 if not found
                              const nbPanneaux = panneauItem
                                ? panneauItem.quantity
                                : 0;

                              // Calculate the new quantity for RF-0125
                              composant.quantity = (nbPanneaux + 1) * 2 * 2;

                              // Update the reference to RF-0125
                              composant.ref = "RF-0125";
                              composant.name =
                                "ECOYA PV SUPPORT MINI RAIL POUR BAC ACIER MINIRAIL";
                            }
                            return (
                              <div key={composant._id} className="w-full flex">
                                <div className="w-[18px] text-[#255D74] font-[700]">
                                  { Math.ceil(composant.quantity)}{" "}
                                </div>
                                <div className="w-4">*</div>
                                <div className="font-[400]">
                                  {composant.ref === "RH-304-0007-2" &&
                                  selectedOptions[0]?.label ? (
                                    selectedOptions[0].label.includes(
                                      "Bacs acier"
                                    ) ||
                                    selectedOptions[0].label.includes(
                                      "Fibro ciment"
                                    ) ? (
                                      <>
                                        Tirefonds
                                        <span
                                          style={{ fontWeight: "bold" }}
                                        >{` [380064-1]`}</span>
                                      </>
                                    ) : selectedOptions[0].label.includes(
                                        "Tuile ardoise"
                                      ) ? (
                                      <>
                                        Crochets {selectedOptions[0].label}
                                        <span
                                          style={{ fontWeight: "bold" }}
                                        >{` [RH-304-0007-2]`}</span>
                                      </>
                                    ) : selectedOptions[0].label.includes(
                                        "Tuile canal"
                                      ) ? (
                                      <>
                                        Crochets {selectedOptions[0].label}
                                        <span
                                          style={{ fontWeight: "bold" }}
                                        >{` [RH-304-000701R59]`}</span>
                                      </>
                                    ) : selectedOptions[0].label.includes(
                                        "Tuile mécanique"
                                      ) ? (
                                      <>
                                        Crochets {selectedOptions[0].label}
                                        <span
                                          style={{ fontWeight: "bold" }}
                                        >{` [RH-304-0059]`}</span>
                                      </>
                                    ) : selectedOptions[0].label.includes(
                                        "Tuile plate"
                                      ) ? (
                                      <>
                                        Crochets {selectedOptions[0].label}
                                        <span
                                          style={{ fontWeight: "bold" }}
                                        >{` [RH-304-0016]`}</span>
                                      </>
                                    ) : (
                                      <>
                                        Crochets {selectedOptions[0].label}
                                        <span
                                          style={{ fontWeight: "bold" }}
                                        >{` [${composant.ref}]`}</span>
                                      </>
                                    )
                                  ) : (
                                    <>
                                      {composant.name}{" "}
                                      {composant.name === "Fibro ciment" ? (
                                        <span style={{ fontWeight: "bold" }}>
                                          1712-36-2
                                        </span>
                                      ) : composant.name === "Tuile ardoise" ? (
                                        <span style={{ fontWeight: "bold" }}>
                                          380080
                                        </span>
                                      ) : composant.name === "Tuile canal" ? (
                                        <span style={{ fontWeight: "bold" }}>
                                          RH-304-000701
                                        </span>
                                      ) : composant.name ===
                                        "Tuile mécanique" ? (
                                        <span style={{ fontWeight: "bold" }}>
                                          2003144
                                        </span>
                                      ) : composant.name === "Tuile plate" ? (
                                        <span style={{ fontWeight: "bold" }}>
                                          1000214
                                        </span>
                                      ) : composant.name === "Bacs acier" ? (
                                        <span style={{ fontWeight: "bold" }}>
                                          1712-36-3
                                        </span>
                                      ) : (
                                        <span
                                          style={{ fontWeight: "bold" }}
                                        >{`[${composant.ref}]`}</span>
                                      )}
                                    </>
                                  )}
                                </div>
                              </div>
                            );
                          }
                          // If quantity is zero, don't render anything
                          return null;
                        })}
                    </ul>
                    <div className="flex justify-start gap-2">
                      <div className="mt-4 mb-4 flex justify-center w-1/2 items-center gap-2">
                        <Label
                          className="text-center text-[13px] font-bold"
                          htmlFor="chantier"
                        >
                          Référence Chantier:
                        </Label>
                        <Input
                          type="text"
                          placeholder=""
                          value={chantier}
                          onChange={(e) => setChantier(e.target.value)}
                          className="border !border-[#DFDFDF] rounded-[10px]"
                        />
                      </div>
                    </div>
                    <div className="flex justify-start mt-10 flex-wrap lg:gap-2 gap-1">
                      {formattedSub === "Kit Pv" && (
                        <>
                          {options.map((option, index) => (
                            <div key={index}>
                              <p className="mb-1 font-400 text-devinovGreen">
                                {option.label} <span className="text-red-500">*</span>
                              </p>
                              <ComboboxDemo
                                frameworks={option.frameworks}
                                option={option.label}
                                defaultValue={""}
                                onOptionSelect={(selectedOption) =>
                                  handleOptionSelect(index, selectedOption)
                                }
                              />
                            </div>
                          ))}
                        </>
                      )}

                      <div>
                        <p className="mb-1 font-400 text-devinovGreen">
                          Quantité
                        </p>
                        <div className="flex justify-center w-[80px] border border-gray-200">
                          <div className="w-[80%] p-2 flex justify-center">
                            {quantity}
                          </div>
                          <div className="w-[40%] p-1">
                            <ChevronUp
                              onClick={handleIncrement}
                              className="ml-2 h-4 w-4 shrink-0 opacity-50 cursor-pointer"
                            />
                            <ChevronDown
                              onClick={handleDecrement}
                              className="ml-2 h-4 w-4 shrink-0 opacity-50 cursor-pointer"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 lg:flex-row flex-col">
                    <div className="">
                        <div className="mt-6 lg:mb-2 w-full">
                          <Button
                            className="bg-devinovGreen"
                            onClick={() => handleVerifyKit(kits.data)}
                          >
                            <Check />
                            <span className="ml-2">Valider le type de toiture</span>
                          </Button>
                        </div>
                        <div className="mt-2 mb-2">
                          {toitureError  && (
                            <p className="text-red-500">
                               {toitureError}
                            </p>
                          )}
                        </div>
                      </div>                      
                      <div className="">
                        <div className="lg:mt-6 mb-2 w-full">
                          <Button
                            className="bg-[#255D74]"
                            onClick={() => handleAddToCartPVKit(kits.data)}
                            disabled={
                              !kitValidated

                            }
                          >
                            <ShoppingCart />
                            <span className="ml-2">Ajouter au panier</span>
                          </Button>
                        </div>
                        <div className="mt-2 mb-2">
                          {addedToCart === true && (
                            <p className="text-green-700">
                              le produit a été ajouté au panier
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {formattedSub === "Kit Pv" && <div className="h-40"></div>}
          {formattedSub !== "Kit Pv" && (
            <div className="pt-20 max-w-[1280px] mx-auto">
              <div className="mt-20 mb-10 mx-auto lg:w-[100%] w-full">
                <div className="">
                  <Title>Produits associés</Title>
                  <SimilarProductCard
                    displayedProducts={composantKit.slice(0, 5)}
                    image={imagesrc}
                    category={category}
                    sub={"tous-les-produits"}
                    type="product"
                  />

                  {/*<ProductCard
                    displayedProducts={kits
                      .filter((kit) => kit.id !== id)
                      .slice(0, 4)
                      .map((user) => ({
                        ...user,
                        totalPrice:
                          user.kit && user.kit.composants
                            ? user.kit.composants
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
                                .toFixed(0)
                            : null,
                      }))}
                    image={imagesrc}
                    category={category}
                    sub={sub}
                    kitype={formattedSub}
                    type="kit"
                    />*/}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Page;
