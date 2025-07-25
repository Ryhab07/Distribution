"use client";
//import Banner from "@/components/reusable/Banner";
//import Title from "@/components/reusable/BigTitle";
//import InfoCards from "@/components/reusable/InfoCards";
//import CallToAction from "@/components/reusable/CallToAction";
import BannerNew from "@/components/reusable/BannerNew";
import { products } from "@/constants";
import sendRequest from "@/pages/api/b365/sendRequest";
import { useEffect, useState } from "react";
import bannerImg from "@/assets/images/Banner.png";
import overlayImg from "@/assets/images/overlay-image.png";
import CallToActionBottomNew from "@/components/reusable/CallToActionBottomNew";
import ExcellenceBanner from "@/components/reusable/ExcellenceBanner";
import ResusableCard from "@/components/reusable/reusableCard";

export default function Home() {
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    // Check if the function has already been called
    if (!hasFetched) {
      sendRequest();
      setHasFetched(true);
    }
  }, [hasFetched]);


  /**
   * Renders the home page of the application.
   *
   * @returns {JSX.Element} The rendered home page.
   */

  /**
   * Rend la page d'accueil de l'application.
   *
   * @returns {JSX.Element} La page d'accueil rendue.
   */


    // Filter products based on the decodedString
    const filteredProducts = products.filter(
      (product) => product.title === "Le Photovoltaique"
    );

  

  return (
    <main className="min-h-screen  flex-col justify-between  relative mt-[-45px]">
      <section>
        {/*<Banner imageUrl="https://i.ibb.co/Bq7q2k4/image-accueil-ecobl.jpg" />*/}
        <BannerNew imageUrl={bannerImg.src} overlayUrl={overlayImg.src} />
        {/*<InfoCards />*/}
      </section>
      <section  id="produits" className="lg:max-w-[1280px] lg:p-12 p-10 md:p-10 flex flex-col items-center mx-auto">
        <div className="mt-0 text-center w-full">
          {/*<TitleNew>Les catégories de produits</TitleNew>*/}
          <div
            id="productsContainer"
            className="mx-auto flex justify-center mt-10 flex-wrap gap-1 md:gap-4 lg:gap-4 flex-col lg:flex-row md:flex-row w-full"
          >
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

        {/*<div className="mt-20 text-center ">
          <TitleNew>Qualité et économie priment</TitleNew>
          <p className="mt-2">
            Votre Partenaire Idéal pour des Achats Malins : Qualité, Économie,
            et Fiabilité !
          </p>
          <InfoCardsNew />
        </div>*/}
      </section>
      <section className="mt-0">
        <ExcellenceBanner/>
      </section>
      {/*<section className="mt-10 text-center">
        <CallToActionNew />
      </section>
      <section className="lg:max-w-[1280px]   flex flex-col items-center mx-auto">
        <div className="mt-10 text-center">
          <TitleNew>Partenariats d&apos;exception</TitleNew>
          <p className="mt-2">
            Choix des produits, livraisons, service après vente, nous sommes
            avec vous de A à Z !
          </p>
          <LogoShowcase/>
        </div>
      </section>*/}
      <section className="lg:max-w-[1280px] lg:p-12 p-10  flex flex-col items-center mx-auto mb-0 mt-0">
        <CallToActionBottomNew/>
      </section>
    </main>
  );
}
