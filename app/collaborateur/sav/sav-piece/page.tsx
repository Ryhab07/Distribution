
'use client'
import { SavPieceForm } from "@/components/auth/sav-piece";
import BannerTitle from "@/components/reusable/BannerTitle";
import Title from "@/components/reusable/BigTitle";
import Breadcrumb from "@/components/reusable/BreadCrumb";
//import FileUploadButton from "@/components/reusable/FileUploadButton";

const Page = () => {
  const breadcrumbPaths = [
    { name: "Accueil", url: "/collaborateur/mon-compte" },
    { name: "sav", url: "/collaborateur/sav" },
    { name: "Formulaire de Suivi des Pièces Détachées", url: "/collaborateur/sav/sav-piece" },
  ];
  return (
    <div className="min-h-screen flex-col justify-between lg:pt-[70px] pt-[60px] ">
      <BannerTitle tile={"SUIVI PIECES DETACHEES"} paragraph={"Formulaire de Suivi des Pièces Détachées "} />

      <Breadcrumb paths={breadcrumbPaths} />
      <div className="lg:p-20 p-10 max-w-[1280px] mx-auto">
        <div className="flex justify-center mx-auto">
          <Title>Formulaire de Suivi des Pièces Détachées</Title>
          
        </div>
        <div className="flex justify-center mx-auto mt-10">
        </div>
        <SavPieceForm />
      </div>
      {/*<div className="flex justify-center mx-auto mt-10">
          <FileUploadButton />
        </div>*/}
    </div>
  );
};

export default Page;
