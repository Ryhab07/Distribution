"use client";
import BannerTitle from "@/components/reusable/BannerTitle";
import Breadcrumb from "@/components/reusable/BreadCrumb";
import ResusableCard from "@/components/reusable/reusableCard";
import { products } from "@/constants";
import { useParams } from "next/navigation";

// Define a type for products with subcategories

const Page = () => {
  const params = useParams();
  const { category } = params || {};

  
  // Filter products based on the decodedString
  const filteredProducts = products.filter(
    (product) => product.title === formattedCategory
  );

  const decodedString = Array.isArray(category)
    ? category.map((item) => decodeURIComponent(item)).join(" ")
    : decodeURIComponent(category || "");

  // Function to capitalize the first letter of each word
  // eslint-disable-next-line @next/next/no-html-link-for-pages
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  // Convert category to desired format
  const formattedCategory = Array.isArray(decodedString)
    ? decodedString
        .split("-") // Split the string by dashes
        .map((word) => capitalizeFirstLetter(word)) // Capitalize the first letter of each word
        .join(" ") // Join the words with spacesfilteredProducts
    : ""

  return (
    <div className="min-h-screen flex-col justify-between mb-10 lg:pt-[70px]  pt-[60px]">
      <BannerTitle
        tile={`${
          formattedCategory === "Panneaux Photovoltaique"
            ? "Le Photovoltaique"
            : formattedCategory
        }`}
        paragraph={"Découvrez nos produits du Photovoltaïque"}
      />
      <Breadcrumb
        paths={[
          { name: "Accueil", url: "/" },
          {
            name: `${
              formattedCategory === "Panneaux Photovoltaique"
                ? "Le Photovoltaique"
                : formattedCategory
            }`,
            url: "#",
          },
        ]}
      />
      <div className="lg:pt-20 pt-10 max-w-[1280px] mx-auto">
        <div className="flex lg:justify-start lg:flex-row md:flex-row flex-col justify-center gap-4 mx-auto flex-wrap lg:pl-[40px]">
          {filteredProducts.map(
            (product) =>
              "subcategories" in product &&
              product.subcategories.map((subcategory) => (
                <ResusableCard
                  key={subcategory.id}
                  title={subcategory.label}
                  image={subcategory.icon}
                  active={true}
                  buttonText={subcategory.buttonText}
                  redirectTo={subcategory.href}
                />
              ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
