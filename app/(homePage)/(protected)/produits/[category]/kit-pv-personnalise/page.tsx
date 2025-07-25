"use client";
import Breadcrumb from "@/components/reusable/BreadCrumb";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ComboboxDemo } from "@/components/reusable/options";
import { Check, Pen, ShoppingCart } from "lucide-react";
import { addKitToCart } from "@/redux/store/cartSlice";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import BannerTitle from "@/components/reusable/BannerTitle";
import kitPV from "@/assets/images/panneau-solaire-full-black.png";
import Title from "@/components/reusable/BigTitle";
import SimilarProductCard from "@/components/reusable/SimilarProductCard";
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

interface ErrorMessages {
  nbrPanneaux?: string;
  puissance_panneau?: string;
  micro?: string;
  optionBoitier?: string;
  marque?: string;
  positionPanneauxChoice?: string;
  typeTuilesChoice?: string;
  nbLignes?: string;
  nbPanneauxParLigne?: string;
}

const Page = () => {
  const [response, setResponse] = useState<any>(null);
  const params = useParams();
  const { category } = params || {};
  const [filteredUserData, setFilteredUserData] = useState<any>([]);
  const [nbrPanneaux, setNbrPanneaux] = useState<number>(1);
  const [addedToCart, setAddedToCart] = useState<boolean>(false);
  const [showPuissanceTotal, setShowPuissanceTotal] = useState<boolean>(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [installateur] = useState("");
  const [chantier, setChantier] = useState("");
  const [block, setBlock] = useState(false);
  const [errorMessages, setErrorMessages] = useState<ErrorMessages>({});
  const [totalSum, setTotalSum] = useState(0);

  console.log("errorMessages", errorMessages);
  console.log("installateur", installateur);
  console.log("chantier", chantier);

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

  //console.log("puissance", puissance);

  //const [quantity, setQuantity] = useState(1);
  const quantity = 1;
  //const [nbLignes, setNbLignes] = useState(1);
  const dispatch = useDispatch();

  // Decode the URL-encoded string
  /*const decodedString = Array.isArray(category)
    ? category.map((item) => decodeURIComponent(item)).join(" ")
    : decodeURIComponent(category || "");*/

  const decodedStringSub = "Personnaliser mon Kit Photovoltaïque";

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
        const response = await fetch(`/kits/productRoutes`);
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

  const positionPanneauxChoice: Option[] = [
    { label: "Portrait", value: "portrait" },
    { label: "Paysage", value: "paysage" },
  ];

  const typeTuilesChoice: Option[] = [
    { label: "Tuile ardoise", value: "tuile-ardoise" },
    { label: "Tuile canal", value: "tuile-canal" },
    { label: "Tuile mécanique", value: "tuile-mecanique" },
    { label: "Tuile plate", value: "tuile-plate" },
    { label: "Bacs acier", value: "bacs-acier" },
    { label: "Fibro ciment", value: "fibro-ciment" },
  ];

  const puissance_panneau: Option[] = [
    { label: "PANNEAU 375WC POWERNITY", value: "375-powernity" },
    { label: "PANNEAU 375WC ECOYA", value: "375-ecoya" },
    { label: "PANNEAU 500WC POWERNITY", value: "500-powernity" },
    { label: "PANNEAU 500WC ECOYA", value: "500-ecoya" },
    { label: "PANNEAU 425WC POWERNITY", value: "425" },
  ];

  const micro: Option[] = [
    { label: "Micro-onduleur Powernity 350W", value: "powernity-350" },
    { label: "Micro-onduleur Powernity 450W", value: "powernity-450" },
    { label: "Micro-onduleur Hoymiles 700W", value: "hoymiles-700" },
    { label: "Micro-onduleur Hoymiles 1000W", value: "hoymiles-1000" },
    { label: "Micro-onduleur POWERNITY  1000W", value: "powernity-1000" },
    { label: "Micro-onduleur Hoymiles 400W", value: "hoymiles-400" },
    { label: "Micro-onduleur Hoymiles 800W", value: "hoymiles-800" },
  ];

  const boitier: Option[] = [
    { label: "1", value: "1" },
    { label: "2", value: "2" },
    { label: "3", value: "3" },
    { label: "4", value: "4" },
    { label: "5", value: "5" },
  ];

  const ligne: Option[] = [
    { label: "1", value: "1" },
    { label: "2", value: "2" },
    { label: "3", value: "3" },
    { label: "4", value: "4" },
    { label: "5", value: "5" },
    { label: "6", value: "6" },
    { label: "7", value: "7" },
    { label: "8", value: "8" },
    { label: "9", value: "9" },
    { label: "10", value: "10" },
  ];

  const options = [{ label: "Type", frameworks: marque }];
  console.log('options', options)
  const optionPositionPanneauxChoice = [
    { label: "Position des panneaux", frameworks: positionPanneauxChoice },
  ];
  const optionTypeTuilesChoice = [
    { label: "Type de toiture", frameworks: typeTuilesChoice },
  ];
  const optionPuissance_panneau = [
    { label: "Puissance de panneaux", frameworks: puissance_panneau },
  ];

  const optionMicro = [
    { label: "Puissance Micro-Onduleur", frameworks: micro },
  ];

  const optionLigne = [{ label: "Nbre Ligne", frameworks: ligne }];

  const [selectedOptionMicro, setSelectedOptionMicro] = useState<
    Array<Framework | null>
  >(optionMicro.map(() => null));

  const optionBoitier = [
    {
      label:
        selectedOptionMicro &&
        selectedOptionMicro.length > 0 &&
        (selectedOptionMicro[0]?.value === "powernity-350" ||
          selectedOptionMicro[0]?.value === "powernity-400")
          ? "Boitier DTU POWERNITY"
          : selectedOptionMicro[0]?.value === "hoymiles-700"
          ? "Boitier DTU Pro"
          : selectedOptionMicro[0]?.value === "hoymiles-1000"
          ? "Boitier DTU Pro-S"
          : "Boitier DTU",
      frameworks: boitier,
    },
  ];

  console.log("selectedOptionMicro", selectedOptionMicro);

  const [selectedOptions, setSelectedOptions] = useState<
    Array<Framework | null>
  >(
    options.map(
      (option) => option.frameworks.find((f) => f.label === "Monophasé") ?? null
    )
  );


  const [selectedOptionsMarque, setSelectedOptionsMarque] = useState<
    Array<Framework | null>
  >(
    options.map(
      (option) => option.frameworks.find((f) => f.label === "Monophasé") ?? null
    )
  );

  console.log("selectedOptions", selectedOptionsMarque)

  const [
    selectedOptionPositionPanneauxChoice,
    setSelectedOptionPositionPanneauxChoice,
  ] = useState<Array<Framework | null>>(
    optionPositionPanneauxChoice.map(() => null)
  );

  const [selectedOptionTypeTuilesChoice, setSelectedOptionTypeTuilesChoice] =
    useState<Array<Framework | null>>(optionTypeTuilesChoice.map(() => null));

  const [selectedOptionPuissance_panneau, setSelectedOptionPuissance_panneau] =
    useState<Array<Framework | null>>(optionPuissance_panneau.map(() => null));

  const [selectedOptionBoitier, setSelectedOptionBoitier] = useState<
    Array<Framework | null>
  >(optionBoitier.map((_, index) => (index === 0 ? boitier[index] : null)));

  const [selectedLigne, setSelecteLigne] = useState<Array<Framework | null>>(
    optionLigne.map(() => null)
  );

  const [selectedOtherLinesOptions, setSelectedOtherLinesOptions] = useState<
    (string | number)[]
  >([]);

  const handleOptionOtherLines = (lineIndex, selectedOption) => {
    const newSelectedOtherLinesOptions = [...selectedOtherLinesOptions];
    newSelectedOtherLinesOptions[lineIndex] = selectedOption;
    setSelectedOtherLinesOptions(newSelectedOtherLinesOptions);
  };

  useEffect(() => {
    // Initialize selectedOtherLinesOptions with "0" for each selectedLigne
    setSelectedOtherLinesOptions(selectedLigne.map(() => 1)); // or use "0" if you prefer strings
  }, [selectedLigne]);

  const sumValues = (array) => {
    return array
      .filter((item) => item && !isNaN(parseInt(item.value)))
      .reduce((sum, item) => sum + parseInt(item.value || "0"), 0);
  };

  useEffect(() => {
    const newTotalSum = sumValues(selectedOtherLinesOptions);
    setTotalSum(newTotalSum);
  }, [selectedOtherLinesOptions]);

  const determinePuissanceValue = (value) => {
    if (value.includes("375")) {
      return 375;
    } else if (value.includes("500")) {
      return 500;
    } else if (value.includes("425")) {
      return 425;
    }
    return 0; // Default value if no match is found
  };

  console.log("nbrPanneaux", nbrPanneaux);
  console.log("totalSum", totalSum);
  console.log("selectedLigne", selectedLigne);
  console.log("selectedOtherLinesOptions");
  console.log(
    "selectedOptionPuissance_panneau",
    parseInt(selectedOptionPuissance_panneau[0]?.value || "0")
  );
  const PuissanceTotaleKit = (
    (selectedOptionPuissance_panneau &&
    selectedOptionPuissance_panneau.length > 0
      ? parseFloat(selectedOptionPuissance_panneau[0]?.value || "0") *
        nbrPanneaux
      : 0) / 1000
  ).toFixed(2);

  console.log("totalSum > nbrPanneaux ", totalSum > nbrPanneaux);
  console.log("totalSum < nbrPanneaux ", totalSum < nbrPanneaux);
  console.log("selectedOtherLinesOptions", selectedOtherLinesOptions);
  console.log("selectedLigne.", selectedLigne);
  console.log("nbrPanneaux", nbrPanneaux);

  const handleSubmitKitPrice = async () => {
    // Initialize error messages as empty
    const errors: ErrorMessages = {};

    // Perform validation
    if (
      !selectedOptionPuissance_panneau ||
      selectedOptionPuissance_panneau.length === 0 ||
      selectedOptionPuissance_panneau.includes(null)
    ) {
      errors.puissance_panneau = "Puissance panneau est requis";
    }

    if (
      nbrPanneaux === null ||
      nbrPanneaux === undefined ||
      nbrPanneaux === 0
    ) {
      errors.nbrPanneaux =
        nbrPanneaux === 0
          ? "Le nombre de panneaux ne peut pas être égal à 0."
          : "Nombre de panneaux est requis";
    }

    if (
      !selectedOptionMicro ||
      selectedOptionMicro.length === 0 ||
      selectedOptionMicro.includes(null)
    ) {
      errors.micro = "Micro-inverseur est requis";
    }

    if (
      !selectedOptionBoitier ||
      selectedOptionBoitier.length === 0 ||
      selectedOptionBoitier.includes(null)
    ) {
      errors.optionBoitier = "Boitier est requis";
    }

    if (
      !selectedOptions ||
      selectedOptions.length === 0 ||
      selectedOptions.includes(null)
    ) {
      errors.marque = "Marque est requis";
    }

    if (
      !selectedOptionPositionPanneauxChoice ||
      selectedOptionPositionPanneauxChoice.length === 0 ||
      selectedOptionPositionPanneauxChoice.includes(null)
    ) {
      errors.positionPanneauxChoice = "Position panneaux est requis";
    }

    if (
      !selectedOptionTypeTuilesChoice ||
      selectedOptionTypeTuilesChoice.length === 0 ||
      selectedOptionTypeTuilesChoice.includes(null)
    ) {
      errors.typeTuilesChoice = "Type de tuiles est requis";
    }

    if (
      !selectedLigne ||
      selectedLigne.length === 0 ||
      !selectedLigne[0]?.value ||
      selectedLigne.includes(null)
    ) {
      errors.nbLignes = "Nombre de lignes est requis";
    }

    const selectedLigneValue =
      selectedLigne.length > 0 ? Number(selectedLigne[0]?.value) : 0;

    if (selectedLigneValue > 2) {
      // Check if the sum of selectedOtherLinesOptions.values is not equal to nbrPanneaux
      const sumOfPanneauxPerLigne = selectedOtherLinesOptions.reduce(
        (sum, option) => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment     
          // @ts-ignore
          const currentSum = Number(sum) + (Number(option.value) || 0); // Access the 'value' property of each object
          console.log(
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment     
          // @ts-ignore
            `sum: ${sum}, option: ${option.value}, currentSum: ${currentSum}`
          );
          return currentSum;
        },
        0 // Initial sum value
      );

      if (
        sumOfPanneauxPerLigne !== nbrPanneaux ||
        selectedOtherLinesOptions.includes("")
      ) {
        errors.nbPanneauxParLigne =
          "Le nombre total de panneaux par ligne doit être égal au nombre total de panneaux";
      }
    }

    // If there are errors, set them and stop the submission
    if (Object.keys(errors).length > 0) {
      setErrorMessages(errors);
      return;
    }

    try {
      const requestBody = {
        NbrePanneaux: nbrPanneaux,
        puissance_panneau:
          selectedOptionPuissance_panneau &&
          selectedOptionPuissance_panneau.length > 0
            ? determinePuissanceValue(
                selectedOptionPuissance_panneau[0]?.value || ""
              )
            : 0,
        puissance_panneau_label:
          selectedOptionPuissance_panneau &&
          selectedOptionPuissance_panneau.length > 0
            ? selectedOptionPuissance_panneau[0]?.label
            : "",
        micro:
          selectedOptionMicro && selectedOptionMicro[0]?.value.includes("350")
            ? 350
            : selectedOptionMicro[0]?.value.includes("450")
            ? 450
            : selectedOptionMicro[0]?.value.includes("425")
            ? 425
            : selectedOptionMicro[0]?.value.includes("700")
            ? 700
            : selectedOptionMicro[0]?.value.includes("800")
            ? 800
            : selectedOptionMicro[0]?.value.includes("400")
            ? 400
            : 1000,
        microOnduleur: selectedOptionMicro && selectedOptionMicro[0]?.value,
        optionBoitier:
          selectedOptionBoitier.length > 0
            ? selectedOptionBoitier[0]?.label
            : "",
        marque: selectedOptionsMarque.length > 0 ? selectedOptionsMarque[0]?.label : "",
        positionPanneauxChoice:
          selectedOptionPositionPanneauxChoice.length > 0
            ? selectedOptionPositionPanneauxChoice[0]?.label
            : "",
        typeTuilesChoice:
          selectedOptionTypeTuilesChoice.length > 0
            ? selectedOptionTypeTuilesChoice[0]?.label
            : "",
        nbLignes: selectedLigne && selectedLigne[0]?.value,
        nbPanneauxParLigne: selectedOtherLinesOptions,
        quantity: quantity,
      };

      setBlock(true);

      const response = await fetch("/api/kits/kitPerso", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const responseData = await response.json();
      setResponse(responseData);
      setShowPuissanceTotal(true);
      //window.scrollTo(0, 0);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleOptionSelect = (
    index: number,
    selectedOption: Framework | null
  ) => {
    const newSelectedOptions = [...selectedOptions];
    newSelectedOptions[index] = selectedOption;
    setSelectedOptionsMarque(newSelectedOptions);
  };

  const handleOptionPositionPanneauxChoiceSelect = (
    index: number,
    selectedOption: Framework | null
  ) => {
    const newSelectedPositionPanneauxChoiceOptions = [
      ...selectedOptionPositionPanneauxChoice,
    ];
    newSelectedPositionPanneauxChoiceOptions[index] = selectedOption;
    setSelectedOptionPositionPanneauxChoice(
      newSelectedPositionPanneauxChoiceOptions
    );
  };

  const handleOptionTypeTuilesChoiceSelect = (
    index: number,
    selectedOption: Framework | null
  ) => {
    const newSelectedOptionTypeTuilesChoice = [
      ...selectedOptionTypeTuilesChoice,
    ];
    newSelectedOptionTypeTuilesChoice[index] = selectedOption;
    setSelectedOptionTypeTuilesChoice(newSelectedOptionTypeTuilesChoice);
  };

  const handleOptionPuissance_panneauSelect = (
    index: number,
    selectedOption: Framework | null
  ) => {
    const newSelectedOptionPuissance_panneau = [
      ...selectedOptionPuissance_panneau,
    ];
    newSelectedOptionPuissance_panneau[index] = selectedOption;
    setSelectedOptionPuissance_panneau(newSelectedOptionPuissance_panneau);
  };

  const handleOptionMicroChoice = (
    index: number,
    selectedOption: Framework | null
  ) => {
    const newSelectedOptionMicro = [...selectedOptionMicro];
    newSelectedOptionMicro[index] = selectedOption;
    setSelectedOptionMicro(newSelectedOptionMicro);
  };

  const handleOptionBoitier = (
    index: number,
    selectedOption: Framework | null
  ) => {
    const newselectedOptionBoitier = [...selectedOptionBoitier];
    newselectedOptionBoitier[index] = selectedOption;
    setSelectedOptionBoitier(newselectedOptionBoitier);
  };

  useEffect(() => {
    if (selectedOptionPuissance_panneau?.length > 0) {
      const filteredOptions = getFilteredMicroOptions(
        selectedOptionPuissance_panneau[0]?.value
      );

      setSelectedOptionMicro((prevSelected) =>
        prevSelected.map((microChoice) =>
          microChoice &&
          !filteredOptions.some((option) => option.value === microChoice.value)
            ? null // Reset to empty if the current choice is not in filtered options
            : microChoice
        )
      );
    }
  }, [selectedOptionPuissance_panneau]);

  const handleOptionLigne = (
    index: number,
    selectedOption: Framework | null
  ) => {
    const newselectedOptionLigne = [...selectedLigne];
    newselectedOptionLigne[index] = selectedOption;
    setSelecteLigne(newselectedOptionLigne);
  };

  //const puissance = String(parseInt(String(selectedOptionPuissance_panneau[0]?.value ?? 0), 10));
  const puissance = selectedOptionPuissance_panneau[0]?.value || "0";
  const coffret = selectedOptions[0]?.label === "Triphasé" ? "TRI" : "MONO";
  const microAdd = selectedOptionMicro[0]?.value || "0";
  const microPower = microAdd.match(/\d+/);

  const handleAddToCartKit = () => {
    // Create an array of components for the payload
    const composants =
      response?.componentsWithPrices?.map((composant: any) => {
        let id = composant.ref; // Default ID

        // Determine the custom ID based on selectedOptions[0]?.label
        if (composant.name === "Crochets") {
          console.log("selectedOptionTypeTuilesChoice[0]?.label", selectedOptionTypeTuilesChoice[0]?.label)
          switch (selectedOptionTypeTuilesChoice[0]?.label) {
            case "Tuile ardoise":
              id = "RH-304-0007-2";
              break;
            case "Tuile canal":
              id = "RH-304-000701R59";
              break;
            case "Tuile mécanique":
              id = "RH-304-0059";
              break;
            case "Tuile plate":
              id = "RH-304-0016";
              break;
            case "Fibro ciment": 
              id = "380064-1"
              break;              
            default:
              break;
          }
        }

        return {
          id: id,
          name: composant.name,
          quantity: composant.quantity,
          price: composant.cost,
          totalPrice: composant.totalPriceForComponent,
          image: composant.image,
          desc: composant.name,
          stock: composant.stock,

          typeStock: "",
          option1: selectedOptionTypeTuilesChoice[0]?.label ?? null,
          option2: selectedOptions[1]?.label ?? null,
          sales: 0,
        };
      }) || [];

    const imagesrc = kitPV.src;
    console.log("imagesrc: ", imagesrc);

    // Dispatch the addToCart action with the kit information
    dispatch(
      addKitToCart({
        id:
          "KIT" +
          PuissanceTotaleKit +
          "WKc/P" +
          puissance +
          "/" +
          microPower +
          "/" +
          coffret +
          "/" +
          (chantier !== "" ? chantier : ""),
        ref:
          "KIT" +
          PuissanceTotaleKit +
          "WKc/P" +
          puissance +
          "/" +
          microPower +
          "/" +
          coffret +
          "/" +
          (chantier !== "" ? chantier : ""),
        kitName: "Kit Photovoltaïque Personnalisé",
        desc: `Puissance du kit ${PuissanceTotaleKit} KWc / Nombre de panneaux : ${nbrPanneaux} / Puissance des panneaux : ${puissance} / Puissance des Micro-Onduleur: Micro-onduleur ${microAdd}`,
        totalPrice: response.totalPrice,
        image: imagesrc,
        quantity: quantity,
        composants: composants,
        option1: selectedOptionTypeTuilesChoice[0]?.label ?? "",
        option2: selectedOptions[1]?.label ?? "",
        kitPuissance: parseInt(puissance),
        installateur: installateur,
        chantier: chantier,
        creatorID: sessionStorage.getItem("id") || "",
        //puissance: "",
      })
    );

    setAddedToCart(true);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    window.location.reload();
  };

  const getFilteredMicroOptions = (value) => {
    const powerValue = parseInt(value);

    switch (powerValue) {
      case 375:
        return micro.filter(
          (option) =>
            option.label.includes("350") || option.label.includes("700")
        );
      case 425:
        return micro.filter(
          (option) =>
            option.label.includes("400") || option.label.includes("800")
        );
      default:
        return micro.filter(
          (option) =>
            option.label.includes("450") ||
            option.label.includes("1000") ||
            option.label.includes("800") ||
            option.label.includes("400")
        );
    }
  };

  const handleChangeNombrePanneaux = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const inputValue = e.target.value;

    // Check if the input is a valid number and is within the max length of 4 digits
    if (/^\d{0,4}$/.test(inputValue)) {
      // Convert the input value to a number
      const numericValue = inputValue === "" ? 0 : parseInt(inputValue);
      setNbrPanneaux(numericValue);
    }
  };

  const handleClickValider = () => {
    if (block === false) {
      // Call the handleSubmitKitPrice function when block is false
      handleSubmitKitPrice();
    } else {
      // Reload the page when block is true
      window.location.reload();
    }
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
          <div className="w-full lg:max-w-[42%] md:w-[90%] md:mx-auto bg-gray-50 p-8 text-center flex justify-center">
            <Image
              className="mx-auto object-contain"
              src={kitPV.src}
              alt="image-de-produit"
              width={300}
              height={50}
            />
          </div>

          <div className="w-[90%] mx-auto lg:w-[42%]">
            <div className="flex justify-between mb-2">
              <div>
                <h1 className="text-2xl font-bold">
                  Personnaliser mon Kit Photovoltaïque{" "}
                </h1>
                <p className="text-sm">
                  Conception Sur Mesure pour Grandes Installations
                </p>
                {showPuissanceTotal && (
                  <p className="text-[24px] mt-4 text-[#255D74]">
                    <span className="font-bold text-black">
                      Puissance totale du Kit :{" "}
                    </span>{" "}
                    {PuissanceTotaleKit} KWc
                  </p>
                )}
              </div>
            </div>
            {response !== null ? (
              <div className="mt-4">
                Composition :
                <ul className="mt-4">
                  {response.componentsWithPrices.map((component, index) => (
                    <div key={index} className="w-full flex">
                      {component.quantity !== 0 && (
                        <>
                          <div className="w-[28px] text-[#255D74] font-[700]">
                            {component.quantity}
                          </div>
                          <div className="w-6">*</div>
                          <div className="font-[400]">
                            {component.name === "Crochets" &&
                            selectedOptionTypeTuilesChoice.length > 0 ? (
                              selectedOptionTypeTuilesChoice[0]?.label.includes(
                                "Bacs acier"
                              ) ||
                              selectedOptionTypeTuilesChoice[0]?.label.includes(
                                "Fibro ciment"
                              ) ? (
                                <>
                                  Tirefonds
                                  <span
                                    style={{ fontWeight: "bold" }}
                                  >{` [380064-1]`}</span>
                                </>
                              ) : selectedOptionTypeTuilesChoice[0]?.label.includes(
                                  "Tuile ardoise"
                                ) ? (
                                <>
                                  Crochets{" "}
                                  {selectedOptionTypeTuilesChoice[0]?.label}
                                  <span
                                    style={{ fontWeight: "bold" }}
                                  >{` [RH-304-0007-2]`}</span>
                                </>
                              ) : selectedOptionTypeTuilesChoice[0]?.label.includes(
                                  "Tuile canal"
                                ) ? (
                                <>
                                  Crochets{" "}
                                  {selectedOptionTypeTuilesChoice[0]?.label}
                                  <span
                                    style={{ fontWeight: "bold" }}
                                  >{` [RH-304-000701R59]`}</span>
                                </>
                              ) : selectedOptionTypeTuilesChoice[0]?.label.includes(
                                  "Tuile mécanique"
                                ) ? (
                                <>
                                  Crochets{" "}
                                  {selectedOptionTypeTuilesChoice[0]?.label}
                                  <span
                                    style={{ fontWeight: "bold" }}
                                  >{` [RH-304-0059]`}</span>
                                </>
                              ) : selectedOptionTypeTuilesChoice[0]?.label.includes(
                                  "Tuile plate"
                                ) ? (
                                <>
                                  Crochets{" "}
                                  {selectedOptionTypeTuilesChoice[0]?.label}
                                  <span
                                    style={{ fontWeight: "bold" }}
                                  >{` [RH-304-0016]`}</span>
                                </>
                              ) : (
                                <>
                                  Crochets{" "}
                                  {selectedOptionTypeTuilesChoice[0]?.label}
                                  <span
                                    style={{ fontWeight: "bold" }}
                                  >{` [${component.ref}]`}</span>
                                </>
                              )
                            ) : (
                              <>
                                {component.name}{" "}
                                {component.name === "Fibro ciment" ? (
                                  <span style={{ fontWeight: "bold" }}>
                                    1712-36-2
                                  </span>
                                ) : component.name === "Tuile ardoise" ? (
                                  <span style={{ fontWeight: "bold" }}>
                                    380080
                                  </span>
                                ) : component.name === "Tuile canal" ? (
                                  <span style={{ fontWeight: "bold" }}>
                                    RH-304-000701R59
                                  </span>
                                ) : component.name === "Tuile mécanique" ? (
                                  <span style={{ fontWeight: "bold" }}>
                                    2003144
                                  </span>
                                ) : component.name === "Tuile plate" ? (
                                  <span style={{ fontWeight: "bold" }}>
                                    1000214
                                  </span>
                                ) : component.name === "Bacs acier" ? (
                                  <span style={{ fontWeight: "bold" }}>
                                    1712-36-3
                                  </span>
                                ) : (
                                  <span
                                    style={{ fontWeight: "bold" }}
                                  >{`[${component.ref}]`}</span>
                                )}
                              </>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="mt-4  text-justify">
                <p>
                  Votre Solution Électrique, Conçue à la Commande ! Découvrez la
                  liberté de personnaliser entièrement votre Kit Photovoltaïque
                  pour grandes installations avec notre service sur mesure.
                  Choisissez chaque détail selon vos besoins spécifiques pour
                  une performance optimale. Notre promesse ? Une solution
                  électrique fiable, conçue précisément pour votre projet.
                  Faites le choix de l&apos;excellence et de
                  l&apos;adaptabilité.
                </p>
              </div>
            )}
            <div className="flex justify-start gap-2 ">
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
          </div>
        </div>
      </div>
      <div className="lg:max-w-[1280px] w-[90%] mx-auto flex justify-start mt-10 flex-wrap lg:gap-4 gap-2 lg:pl-20">
        {formattedSub === "Personnaliser mon Kit Photovoltaïque" && (
          <>
            {optionPuissance_panneau.map((option, index) => (
              <div key={index}>
                <p className="mb-1 font-400 text-devinovBleu">
                  Puissance Panneau
                </p>
                <ComboboxDemo
                  frameworks={option.frameworks}
                  option={option.label}
                  disabled={block}
                  defaultValue={""}
                  onOptionSelect={(selectedOption) =>
                    handleOptionPuissance_panneauSelect(index, selectedOption)
                  }
                />
                {errorMessages["puissance_panneau"] && (
                  <span className="text-red-500">
                    {errorMessages["puissance_panneau"]}
                  </span>
                )}
              </div>
            ))}
          </>
        )}

        <div>
          <Label className="mb-1 font-400  text-devinovBleu">
            Nombre de panneaux
          </Label>
          <Input
            type="text"
            className="mt-1 rounded-none w-full"
            value={nbrPanneaux.toString()}
            onChange={handleChangeNombrePanneaux}
            disabled={block}
            maxLength={4}
            placeholder="Enter number up to 9999"
          />
          {errorMessages["nbrPanneaux"] && (
            <span className="text-red-500">{errorMessages["nbrPanneaux"]}</span>
          )}
        </div>

        {formattedSub === "Personnaliser mon Kit Photovoltaïque" && (
          <>
            {optionMicro.map((option, index) => (
              <div key={index}>
                <p className="mb-1 font-400 text-devinovBleu">
                  {option.label}
                </p>
                <ComboboxDemo
                  frameworks={
                    selectedOptionPuissance_panneau?.length > 0 &&
                    selectedOptionPuissance_panneau[0]?.value !== undefined
                      ? getFilteredMicroOptions(
                          selectedOptionPuissance_panneau[0]?.value
                        )
                      : []
                  }
                  disabled={block}
                  option={option.label}
                  defaultValue={
                    selectedOptionPuissance_panneau?.length > 0 &&
                    selectedOptionPuissance_panneau[0]?.value !== undefined
                      ? ""
                      : "No options available"
                  }
                  onOptionSelect={(selectedOption) =>
                    handleOptionMicroChoice(index, selectedOption)
                  }
                />

                {errorMessages["micro"] && (
                  <span className="text-red-500">{errorMessages["micro"]}</span>
                )}
              </div>
            ))}
          </>
        )}

        {formattedSub === "Personnaliser mon Kit Photovoltaïque" && (
          <>
            {optionBoitier.map((option, index) => (
              <div key={index}>
                <p className="mb-1 font-400  text-devinovBleu">
                  {selectedOptionMicro &&
                  selectedOptionMicro.length > 0 &&
                  (selectedOptionMicro[0]?.value === "powernity-350" ||
                    selectedOptionMicro[0]?.value === "powernity-400")
                    ? "Passerelle POWERNITY"
                    : selectedOptionMicro[0]?.value === "hoymiles-700"
                    ? "Passerelle Pro"
                    : selectedOptionMicro[0]?.value === "hoymiles-1000"
                    ? "Passerelle Pro-S"
                    : "Passerelle"}
                </p>
                <ComboboxDemo
                  frameworks={option.frameworks}
                  option={option.label}
                  defaultValue={"1"}
                  disabled={block}
                  onOptionSelect={(selectedOption) =>
                    handleOptionBoitier(index, selectedOption)
                  }
                />
                {errorMessages["boitier"] && (
                  <span className="text-red-500">
                    {errorMessages["boitier"]}
                  </span>
                )}
              </div>
            ))}
          </>
        )}

        {formattedSub === "Personnaliser mon Kit Photovoltaïque" && (
          <>
            {options.map((option, index) => (
              <div key={index}>
                <p className="mb-1 font-400  text-devinovBleu">Coffret AC</p>
                <ComboboxDemo
                  frameworks={option.frameworks}
                  option={option.label}
                  disabled={block}
                  defaultValue={"monophase"}
                  onOptionSelect={(selectedOption) =>
                    handleOptionSelect(index, selectedOption)
                  }
                />
                {errorMessages["coffretAC"] && (
                  <span className="text-red-500">
                    {errorMessages["coffretAC"]}
                  </span>
                )}
              </div>
            ))}
          </>
        )}

        {formattedSub === "Personnaliser mon Kit Photovoltaïque" && (
          <>
            {optionPositionPanneauxChoice.map((option, index) => (
              <div key={index}>
                <p className="mb-1 font-400  text-devinovBleu">
                  {option.label}
                </p>
                <ComboboxDemo
                  frameworks={option.frameworks}
                  option={option.label}
                  defaultValue={""}
                  disabled={block}
                  onOptionSelect={(selectedOption) =>
                    handleOptionPositionPanneauxChoiceSelect(
                      index,
                      selectedOption
                    )
                  }
                />
                {errorMessages["positionPanneauxChoice"] && (
                  <span className="text-red-500">
                    {errorMessages["positionPanneauxChoice"]}
                  </span>
                )}
              </div>
            ))}
          </>
        )}

        {formattedSub === "Personnaliser mon Kit Photovoltaïque" && (
          <>
            {optionTypeTuilesChoice.map((option, index) => (
              <div key={index}>
                <p className="mb-1 font-400  text-devinovBleu">
                  {option.label}
                </p>
                <ComboboxDemo
                  frameworks={option.frameworks}
                  option={option.label}
                  defaultValue={""}
                  disabled={block}
                  onOptionSelect={(selectedOption) =>
                    handleOptionTypeTuilesChoiceSelect(index, selectedOption)
                  }
                />
                {errorMessages["typeTuilesChoice"] && (
                  <span className="text-red-500">
                    {errorMessages["typeTuilesChoice"]}
                  </span>
                )}
              </div>
            ))}
          </>
        )}

        {formattedSub === "Personnaliser mon Kit Photovoltaïque" && (
          <>
            {optionLigne.map((option, index) => (
              <div key={index}>
                <p className="mb-1 font-400  text-devinovBleu">Nbre Ligne</p>
                <ComboboxDemo
                  frameworks={option.frameworks}
                  option={option.label}
                  defaultValue={""}
                  disabled={block}
                  onOptionSelect={(selectedOption) =>
                    handleOptionLigne(index, selectedOption)
                  }
                />
                {errorMessages["nbLignes"] && (
                  <span className="text-red-500 !pt-1">
                    {errorMessages["nbLignes"]}
                  </span>
                )}
              </div>
            ))}
          </>
        )}

        {/* Handle Nbre de panneaux de la Ligne */}
        <div>
          {selectedLigne[0]?.value &&
            parseInt(selectedLigne[0]?.value || "0") > 2 && (
              <div className="max-w-[1280px] mx-auto flex justify-start flex-wrap lg:gap-4 gap-2">
                {[...Array(parseInt(selectedLigne[0]?.value || "0"))].map(
                  (_, i) => {
                    let remainingMaxPanels = nbrPanneaux;
                    remainingMaxPanels = Math.max(remainingMaxPanels, 1);

                    const options = Array.from(
                      { length: remainingMaxPanels },
                      (_, j) => ({
                        label: `${j + 1}`,
                        value: `${j + 1}`,
                      })
                    );

                    return (
                      <div key={i}>
                        <p className="mb-1 font-400 text-devinovGreen">
                          Nbre de panneaux de la Ligne {i + 1}
                        </p>
                        <ComboboxDemo
                          frameworks={options}
                          option={`Nbre de panneaux`}
                          disabled={false}
                          defaultValue=""
                          onOptionSelect={(selectedOption) => {
                            handleOptionOtherLines(i, selectedOption);

                            // Update the selected options state
                            setSelectedOptions((prev) => {
                              const newOptions = [...prev];
                              newOptions[i] = selectedOption; // Store the selected value for the current combobox
                              return newOptions;
                            });
                          }}
                        />

                        {errorMessages[`ligne_${i}`] && (
                          <span className="text-red-500">
                            {errorMessages[`ligne_${i}`]}
                          </span>
                        )}
                      </div>
                    );
                  }
                )}
              </div>
            )}
          {errorMessages["nbPanneauxParLigne"] && (
            <span className="text-red-500">
              {errorMessages["nbPanneauxParLigne"]}
            </span>
          )}
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto flex justify-between gap-4 ">
        <div className="flex justify-start mt-14 flex-wrap lg:gap-4 gap-2 pl-20 text-red-500">
          {totalSum > nbrPanneaux && totalSum > 0 && (
            <p>
              Le nombre de panneaux par ligne est supérieur au total
              sélectionné.
            </p>
          )}
          {totalSum < nbrPanneaux && totalSum > 0 && (
            <p>
              Le nombre de panneaux par ligne est inférieur au total
              sélectionné.
            </p>
          )}
        </div>
      </div>

      {response !== null && (
        <div className="lg:max-w-[1280px] w-full lg:mx-auto flex lg:justify-end justify-start gap-4 p-4">
          <div className=" mb-2">
            <h2 className="text-[30px] font-bold">
              Prix Du Kit:{" "}
              <span className="text-devinovBleu">
                {response.totalPrice.toFixed(2)} €
              </span>
            </h2>
          </div>
        </div>
      )}
      <div className="lg:max-w-[1280px] w-full pl-4 lg:mx-auto flex lg:flex-row flex-col lg:justify-end justify-start lg:gap-4 gap-2">
      <div className="lg:mt-4 lg:mb-2">
          <Button
            className="bg-devinovGreen w-[96%] mx-auto  "
            onClick={handleClickValider}
            disabled={
              (totalSum < nbrPanneaux && totalSum > 0) ||
              (totalSum > nbrPanneaux && totalSum > 0)
            }
          >
            {block === false ? <Check /> : <Pen className="w-4 h-4 mb-1" />}
            <span className="ml-2">
              {block === false ? "Valider mes choix" : "Changer mes choix"}
            </span>
          </Button>
        </div>
        
        <div className="lg:mt-4 lg:mb-2 ">
          <Button
            className="bg-[#255D74] w-[96%] mx-auto "
            onClick={handleAddToCartKit}
            disabled={
              (totalSum < nbrPanneaux && totalSum > 0) ||
              (totalSum > nbrPanneaux && totalSum > 0)
            }
          >
            <ShoppingCart />
            <span className="ml-2">Ajouter au panier</span>
          </Button>
        </div>
        {addedToCart === true && (
          <div className="mt-[60px] mb-2">
            <p className="text-green-700">le produit a été ajouté au panier</p>
          </div>
        )}
      </div>

      <div className="max-w-[1280px] mx-auto flex justify-end gap-4">
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
