'use client';
import { useState } from "react";
import { SavInterventionForm } from "@/components/auth/sav-intervention";
import BannerTitle from "@/components/reusable/BannerTitle";
import Title from "@/components/reusable/BigTitle";
import Breadcrumb from "@/components/reusable/BreadCrumb";
import FileUploadButtonIntervention from "@/components/reusable/FileUploadButtonIntervention";

const Page = () => {
  const [selectedOption, setSelectedOption] = useState(""); // Default to no selection

  const breadcrumbPaths = [
    { name: "Accueil", url: "/collaborateur/mon-compte" },
    { name: "sav", url: "/collaborateur/sav" },
    { name: "Formulaire D'Intervention", url: "/collaborateur/sav/sav-intervention" },
  ];

  return (
    <div className="min-h-screen flex-col justify-between lg:pt-[70px] pt-[60px]">
      <BannerTitle tile={"INTERVENTIONS"} paragraph={"Formulaire D'Intervention"} />
      <Breadcrumb paths={breadcrumbPaths} />
      <div className="lg:p-20 p-10 max-w-[1280px] mx-auto">
        <div className="flex justify-center mx-auto">
          <Title>Formulaire d&apos;intervention</Title>
        </div>
        
        {/* Radio Button Options */}
        <div className="flex lg:flex-row flex-col lg:gap-0 gap-4 justify-center mx-auto mt-10">
          <label className="lg:mr-5 mr-0">
            <input
              type="radio"
              name="interventionMode"
              value="excel"
              checked={selectedOption === "excel"}
              onChange={() => setSelectedOption("excel")}
              className="mr-2"
            />
            Importer un Excel des interventions
          </label>
          <label>
            <input
              type="radio"
              name="interventionMode"
              value="form"
              checked={selectedOption === "form"}
              onChange={() => setSelectedOption("form")}
              className="mr-2"
            />
            Remplir le formulaire
          </label>
        </div>

        {/* Show the corresponding section based on the selected option */}
        {selectedOption === "excel" && (
          <div className="flex justify-center mx-auto mt-10">
            <FileUploadButtonIntervention />
          </div>
        )}
        
        {selectedOption === "form" && (
          <div className="flex justify-center mx-auto mt-10">
            <SavInterventionForm />
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
