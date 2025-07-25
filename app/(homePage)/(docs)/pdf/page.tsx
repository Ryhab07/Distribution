// YourPage.tsx
import React from "react";
import PDFGenerator from "@/components/pdf/BonDeCommande/PDFGenerator";
import Breadcrumb from "@/components/reusable/BreadCrumb";
import Image from "next/image";
import confirmation from "@/assets/icons/commande-valide.png";
import BannerTitle from "@/components/reusable/BannerTitle";
//import PDFGeneratorReactPrint from "@/components/pdf/BonDeCommande/PDFGeneratorReactPrint";


const YourPage: React.FC = () => {
  const breadcrumbPaths = [
    { name: "Accueil", url: "/" },
    { name: "Confirmation de commande", url: "#" },
  ];
  return (
    <div className="min-h-screen flex-col justify-between mb-40 lg:w-full w-full mx-auto lg:pt-[70px] pt-[60px]">
      <BannerTitle tile={"confirmation de commande"} paragraph={""} />
      <Breadcrumb paths={breadcrumbPaths} />
      <div className="pt-20 max-w-[1280px] mx-auto">
        <div className="flex justify-center">
          <Image
            className=""
            src={confirmation}
            alt="image-de-produit"
            width={300}
            height={300}
          />
        </div>
        <div className="text-center mt-4">
          <h1 className="text-3xl text-larnaBlue font-[700] mb-2">
            Confirmation de commande{" "}
          </h1>
          <p className="text-xl">
            <span className="font-[700] text-3xl text-center mt-2">
              Félicitation !
            </span>{" "}
            votre commande a été validée avec succès
          </p>
          <p className="text-center  mt-2 text-lg">
            Un e-mail de confirmation de commande vous a été envoyé.{" "}
          </p>
          <p className="text-center  mt-2 text-[16px]">
            Veuillez vérifier votre boîte de réception, si vous ne le trouvez
            pas dans les prochaines minutes, consultez également le dossier des
            courriers indésirables ou &ldquo;Spam&rdquo;.{" "}
          </p>
          <p className="text-center  mt-2 text-[16px]">
            En cas d&apos;absence de l&apos;email, pas de panique !
            Contactez-nous pour obtenir de l&apos;aide. Merci de votre confiance
            !
          </p>

          {/*<div className="mt-8 flex justify-center gap-40">
            <div>
              <a
                href="/"
                className={`border border-[#fab516] hidden lg:inline-block px-5 py-2 relative rounded-[4px] group overflow-hidden font-medium bg-transparent text-[#fab516]  `}
              >
                <span
                  className={`text-[#fab516] absolute top-0 left-0 flex w-0 h-full mr-0 transition-all duration-200 ease-out transform translate-x-0 bg-[#fab516] group-hover:w-full opacity-90`}
                ></span>
                <span
                  className={`text-[#fab516] relative group-hover:text-white flex gap-2`}
                >
                  Accueil
                </span>
              </a>

              <a
                href="/"
                className={`lg:hidden px-5 py-2.5 relative rounded group overflow-hidden font-medium bg-[#fab516] text-white inline-block`}
              >
                <span
                  className={`text-[#fab516] absolute top-0 left-0 flex w-full h-full transition-all duration-200 ease-out transform translate-x-0 opacity-90`}
                ></span>

                <span className={`relative flex gap-2`}>Accueil</span>
              </a>
            </div>
          </div>*/}
        </div>
        <div className="md:block invisible">
          <PDFGenerator />
          {/*<PDFGeneratorReactPrint/>*/}
  </div>
      <div>
        
      {/*<PDFGenerator />*/}
    </div>
      </div>
    </div>


  );
};

export default YourPage;
