
'use client'
import { SavInterventionForm } from "@/components/auth/sav-intervention";

import BannerTitle from "@/components/reusable/BannerTitle";
import Title from "@/components/reusable/BigTitle";
import Breadcrumb from "@/components/reusable/BreadCrumb";
//import FileUploadButton from "@/components/reusable/FileUploadButton";

const Page = () => {
  const breadcrumbPaths = [
    { name: "Accueil", url: "/user-pro/mon-compte" },
    { name: "sav", url: "/user-pro/sav" },
    { name: "Formulaire de Suivi d'intervention", url: "/user-pro/sav/sav-intervention" },
  ];
  return (
    <div className="min-h-screen flex-col justify-between lg:pt-[70px] pt-[60px] ">
      <BannerTitle tile={"SUIVI PIECES DETACHEES"} paragraph={"Formulaire de Suivi des Pièces Détachées "} />

      <Breadcrumb paths={breadcrumbPaths} />
      <div className="lg:p-20 p-10 max-w-[1280px] mx-auto">
        <div className="flex justify-center mx-auto">
          <Title>Formulaire d&apos;intervention</Title>
          
        </div>
        <div className="flex justify-center mx-auto mt-10">
        </div>
        <SavInterventionForm />
      </div>

    </div>
  );
};

export default Page;
