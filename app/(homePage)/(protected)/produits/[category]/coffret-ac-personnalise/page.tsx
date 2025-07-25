"use client";
import Breadcrumb from "@/components/reusable/BreadCrumb";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ComboboxDemo } from "@/components/reusable/options";
import { ChevronDown, ChevronUp, ShoppingCart } from "lucide-react";
import { addToCart } from "@/redux/store/cartSlice";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import BannerTitle from "@/components/reusable/BannerTitle";
import acPersonalise from "@/assets/images/coffretacpersonnalise.png";
import SimilarProductCard from "@/components/reusable/SimilarProductCard";
import Title from "@/components/reusable/BigTitle";
import touslesproduits from "@/assets/images/tous-les-produits.png";

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
  const { category } = params || {};
  const [filteredUserData, setFilteredUserData] = useState<any>([]);
  const [puissance, setPuissance] = useState<string>("");
  const [addedToCart, setAddedToCart] = useState<boolean>(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [installateur] = useState("");
  const [chantier, setChantier] = useState("");

  console.log("loading", loading);
  console.log("error", error);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const response = await fetch(`/api/kits/productRoutes`);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const jsonData = await response.json();
        console.log("jsonData", jsonData);

        // Shuffle the jsonData array
        const shuffledData = jsonData.sort(() => Math.random() - 0.5);

        setProducts(shuffledData.slice(0, 5));

        setFilteredUserData(shuffledData[0]);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();

  // Decode the URL-encoded string
  /*const decodedString = Array.isArray(category)
    ? category.map((item) => decodeURIComponent(item)).join(" ")
    : decodeURIComponent(category || "");*/

  const decodedStringSub = "Coffret AC Personnalisé";

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

  // Fetches The product details
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const response = await fetch(`/api/kits/productRoutes`);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const jsonData = await response.json();
        const filteredData = jsonData.filter(
          (product) => product.name.toLowerCase() === "coffret ac personnalisé"
        );
        setFilteredUserData(filteredData);
      } catch (error) {
        console.error("Error fetching data:", error);
        // Handle error state or display an error message
      }
    };

    fetchAllData();
  }, []);

  console.log("setFilteredUserData", filteredUserData);

  const marque: Option[] = [
    { label: "Monophasé", value: "monophase" },
    { label: "Triphasé", value: "triphase" },
  ];

  const options = [{ label: "Type", frameworks: marque }];

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
  };

  const handleIncrement = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1);
    }
  };

  console.log("selectedOptions[0]?.label", selectedOptions[0]?.label)

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id: selectedOptions[0]?.label === "Monophasé" ? "65ce13821136e8c9a3fe50e1" : "65ce13821136e8c9a3fe50e2",
        name: "Coffret AC Personnalisé",
        price: 0,
        stock: filteredUserData.InventoryField,
        image: acPersonalise.src,
        desc: "Coffret AC Personnalisé",
        typeStock: filteredUserData.typeStock,
        quantity: quantity,
        option1: selectedOptions[0]?.label ?? null,
        option2: selectedOptions[0]?.label ?? null,
        sales: 0,
        puissance: puissance,
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

  return (
    <div className="flex-col justify-between  lg:py-[70px] pt-[60px]">
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
          { name: `${formattedSub}`, url: "#" },
        ]}
      />
      <div className="pt-20 max-w-[1280px] mx-auto">
        <div className="flex justify-center gap-8 lg:flex-row flex-col">
          <div className="w-full lg:w-[42%] bg-gray-50 p-8 text-center flex justify-center object-contain  ">
          <Image
  className="mx-auto object-contain w-full h-auto"
  src={acPersonalise.src}
  alt="image-de-produit"
  width={300}
  height={50}
/>

          </div>

          <div className="w-[90%] lg:w-[42%] mx-auto">
            <div className="flex justify-between mb-2">
              <div>
                <h1 className="text-2xl font-bold">Coffret AC Personnalisé</h1>
                <p className="text-sm">
                  Conception Sur Mesure pour Grandes Installations
                </p>
                <h1 className="text-[16px] text-[#5F5F5F] mt-4">
                  Prix: <span className="text-black">Sur Devis</span>
                </h1>
              </div>
            </div>

            <div className="mt-4 text-justify">
              <p>
                Votre Solution Électrique, Conçue à la Commande ! Découvrez la
                liberté de personnaliser entièrement votre coffret AC pour
                grandes installations avec notre service sur mesure. Choisissez
                chaque détail selon vos besoins spécifiques pour une performance
                optimale. Notre promesse ? Une solution électrique fiable,
                conçue précisément pour votre projet. Faites le choix de
                l&apos;excellence et de l&apos;adaptabilité.
              </p>
            </div>

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

            <div className="flex justify-between mt-10 flex-wrap lg:gap-0 gap-2">
              {formattedSub === "Coffret AC Personnalisé" && (
                <>
                  {options.map((option, index) => (
                    <div key={index}>
                      <p className="mb-1 font-400">{option.label}</p>
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
                <Label>Puissance</Label>
                <Input
                  className="mt-1 rounded-none"
                  value={puissance}
                  onChange={(e) => setPuissance(e.target.value)}
                />
              </div>
              <div>
                <p className="mb-1 font-400">Quantité</p>
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



            <div className="flex justify-start gap-4">
              <div className="mt-14 mb-2">
                <Button className="bg-[#255D74]" onClick={handleAddToCart}>
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
      </div>
      <div className="pt-20 max-w-[1280px] mx-auto">
        <div className="mt-20 mb-10 mx-auto lg:w-[90%] w-full">
          <div className="">
            <Title>Produits similaires</Title>

            <SimilarProductCard
              displayedProducts={products}
              image={touslesproduits}
              category={category}
              sub={"tous-les-produits"}
              type="product"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
