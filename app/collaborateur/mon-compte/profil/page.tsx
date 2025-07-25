'use client'
import * as React from "react";
//import Title from "@/components/reusable/BigTitle";
import Breadcrumb from "@/components/reusable/BreadCrumb";
import { Label } from "@/components/ui/label";
import Mesinfo from "@/components/form/mesinfo";
import Password from "@/components/form/password";
import { useEffect} from "react";
import { getUserInfo } from "@/utils/userRequest";
import BannerTitle from "@/components/reusable/BannerTitle";

const Page = () => {
  const [userNom, setUserNom] = React.useState<string | undefined>("");
  const [userPrenom, setUserPrenom] = React.useState<string | undefined>("");
  const [userNumero, setUserNumero] = React.useState<string | undefined>("");
  const [userNumeroPortable, setUserNumeroPortable] = React.useState<string | undefined>("");  
  const [remise375, setRemise375] = React.useState<string | undefined>(""); 
  const [remise500, setRemise500] = React.useState<string | undefined>(""); 
  const [userAdresse, setUserAdresse] = React.useState<string | undefined>("");
  const [userEntreprise, setUserEntreprise] = React.useState<string | undefined>("");
  const [userEmail, setUseruserEmail] = React.useState<string | undefined>("");
  const [useruserEmailSecondaire, setUseruserEmailSecondaire] = React.useState<string | undefined>("");

  console.log("remise375", remise375)
  console.log("remise500", remise500)

  const breadcrumbPaths = [
    { name: "Accueil", url: "/collaborateur/mon-compte" },
    { name: "Mon profil", url: "#" },
  ];

  useEffect(() => {
    // Call the API function
    getUserInfo()
      .then((userInfo) => {
        // Handle the user info
        setUserNom(userInfo.user.name);
        setUserPrenom(userInfo.user.lastname);
        setUserNumero(userInfo.user.phone);
        setUserNumeroPortable(userInfo.user.phoneSecondaire);      
        setRemise375(userInfo.user.sales375);
        setRemise500(userInfo.user.sales500);               
        setUserEntreprise(userInfo.user.entreprise);
        setUseruserEmail(userInfo.user.email);
        setUseruserEmailSecondaire(userInfo.user.email2);
        setUserAdresse(userInfo.user.adresse);
      })
      .catch((error) => {
        // Handle errors
        console.error('Error:', error.message);
      });
  }, []);

  return (
    <div className="flex-col justify-between lg:pt-[70px] pt-[60px]">
            <BannerTitle tile = {'Informations personnelles'} paragraph = {' '} />
      <Breadcrumb paths={breadcrumbPaths} />
      <div className="p-10 max-w-[1280px] mx-auto">
        <div className=" mt-10  border border-[#DFDFDF] p-4 gap-6  rounded-[20px]">
          <div className="grid lg:grid-cols-2 grid-cols-1 gap-8">
          <div className="grid gap-1">
              <div className="grid gap-1">
                <Label className="text-xl font-bold ">Nom d’entreprise </Label>
                <div className="w-[100%] h-[40px] rounded-md border border-[#DFDFDF] bg-white p-4 flex items-center ">
                  <p className="lg:text-lg text-sm font-regular">{userEntreprise}</p>
                </div>
              </div>
            </div>

            <div className="grid gap-1">
              <div className="grid gap-1">
                <Label className="text-xl font-bold ">Contact</Label>
                <div className="w-[100%] h-[40px] rounded-md border border-[#DFDFDF] bg-white p-4 flex items-center ">
                  <p className="lg:text-lg text-sm font-regular">{userNom} {userPrenom}</p>
                </div>
              </div>
            </div>


            <div className="grid gap-1">
              <div className="grid gap-1">
                <Label className="text-xl font-bold ">Email </Label>
                <div className="w-[100%] h-[40px] rounded-md border border-[#DFDFDF] bg-white p-4 flex items-center ">
                  <p className="lg:text-lg text-sm font-regular">{userEmail}</p>
                </div>
              </div>
            </div>

            <div className="grid gap-1">
              <div className="grid gap-1">
                <Label className="text-xl font-bold ">Email secondaire </Label>
                <div className="w-[100%] h-[40px] rounded-md border border-[#DFDFDF] bg-white p-4 flex items-center ">
                  <p className="lg:text-lg text-sm font-regular">{useruserEmailSecondaire}</p>
                </div>
              </div>
            </div>


            <div className="grid gap-1">
              <div className="grid gap-1">
                <Label className="text-xl font-bold ">
                  Numéro de téléphone
                </Label>
                <div className="w-[100%] h-[40px] rounded-md border border-[#DFDFDF] bg-white p-4 flex items-center ">
                  <p className="lg:text-lg text-sm font-regular">{userNumero}</p>
                </div>
              </div>
            </div>

            <div className="grid gap-1">
              <div className="grid gap-1">
                <Label className="text-xl font-bold ">
                Numéro de téléphone portable
                </Label>
                <div className="w-[100%] h-[40px] rounded-md border border-[#DFDFDF] bg-white p-4 flex items-center ">
                  <p className="lg:text-lg text-sm font-regular">{userNumeroPortable}</p>
                </div>
              </div>
            </div>

            <div className="grid gap-1">
              <div className="grid gap-1">
                <Label className="text-xl font-bold ">
                  Adresse
                </Label>
                <div className="w-[100%] h-[40px] rounded-md border border-[#DFDFDF] bg-white p-4 flex items-center ">
                  <p className="lg:text-lg text-sm font-regular">{userAdresse}</p>
                </div>
              </div>
            </div>            
            <div className="grid gap-1">
              <div className="grid gap-1">
                <Label className="text-xl font-bold ">Mot de passe </Label>
                <div className="w-[100%] h-[40px] rounded-md border border-[#DFDFDF] bg-white p-4 flex items-center ">
                  <p className="lg:text-lg text-sm font-regular">********</p>
                </div>
              </div>
            </div>
            {/*<div className="grid gap-1">
              <div className="grid gap-1">
                <Label className="text-xl font-bold ">
                Prix de vente Kit avec panneaux 375
                </Label>
                <div className="w-[100%] h-[40px] rounded-md border border-[#DFDFDF] bg-white p-4 flex items-center ">
                  <p className="lg:text-lg text-sm font-regular">{remise375}</p>
                </div>
              </div>
            </div>  
            <div className="grid gap-1">
              <div className="grid gap-1">
                <Label className="text-xl font-bold ">
                Prix de vente Kit avec panneaux 500
                </Label>
                <div className="w-[100%] h-[40px] rounded-md border border-[#DFDFDF] bg-white p-4 flex items-center ">
                  <p className="lg:text-lg text-sm font-regular">{remise500}</p>
                </div>
              </div>
            </div> */}

          </div>
          <div className="flex lg:justify-end items-end mt-10 lg:w-full gap-4 flex-col lg:flex-row">
            <div className="col-start-2 gap-2 w-full lg:w-[30%]">
              <Mesinfo/>
            </div>
            <div className="col-start-2 gap-2">
              <Password/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
