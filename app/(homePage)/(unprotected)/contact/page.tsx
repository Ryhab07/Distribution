"use client";
import { ContactForm } from "@/components/form/contact";
import BannerTitle from "@/components/reusable/BannerTitle";
import Breadcrumb from "@/components/reusable/BreadCrumb";
import { Separator } from "@radix-ui/react-separator";
import Image from "next/image";
import mail from "@/assets/icons/mail.png";
import iphone from "@/assets/icons/iphone.png";
import location from "@/assets/icons/location.png";
import { useEffect, useState } from "react";

const Page = () => {
  //const [userNom, setUserNom] = useState<string | undefined>("");
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    // Only run on the client side
    const storedRole = sessionStorage.getItem("role");
    setRole(storedRole);
  }, []);

  
  const breadcrumbPaths = [
    {
      name: "Accueil",
      url: role === 'admin'
        ? "/admin/mon-compte"
        : role === 'collaborateur'
        ? "/collaborateur/mon-compte"
        : "/"
    },
    
    { name: "Contact", url: "#" },
  ];

  return (
    <div className=" min-h-screen flex-col justify-between ">
      <BannerTitle tile = {"Contactez-nous !"} paragraph = {""} />
      <Breadcrumb paths={breadcrumbPaths} />
      <div className="max-w-[1280px]   mx-auto">
        <div className="text-center mt-10 w-[80%] mx-auto ">
          <div className="mb-10">
            <h1 className="relative text-devinovBleu text-[16px] font-[700]">Vous avez un besoin ?</h1>
            <div className='mx-auto mt-[4px] border-t-2 border-devinovBleu w-[100px]'>
              <Separator className='lg:w-[200px] w-[120px] bg-devinovBleu mx-auto'/>
              <Separator className='lg:w-[200px] w-[120px] bg-devinovBleu mx-auto'/>
              <Separator className='lg:w-[200px] w-[120px] bg-devinovBleu mx-auto'/>
              <Separator className='lg:w-[200px] w-[120px] bg-devinovBleu mx-auto'/>
              </div>

          </div>
          <h1 className="lg:text-[30px] text-[20px] font-[700] ">
          Contactez-nous. Nous vous orienterons vers les bons produits, en fonction de votre chantier !
          </h1>
          
        </div>
        <div className="p-10">

          <div className="flex gap-10 lg:flex-row flex-col">
            <div className="lg:w-[70%] w-full">
              <ContactForm />
            </div>
            <div className="lg:w-[30%] w-full">
              <div className="flex items-center lg:gap-2 gap-4 flex-col mt-[90px] mb-10">
              <h1 className="text-[16px] font-bold uppercase text-start mb-10">information de Contact </h1>
              <div className="flex flex-col gap-[70px]">
                <div className="flex lg:justify-start items-center gap-1 mb-4 lg:mb-0 bg-devinovGreen p-2 rounded-xl lg:w-[350px] w-[350px]">
                  <div className="bg-devinovYellow rounded-full p-4">
                    <Image
                      className=""
                      src={iphone}
                      alt="iphone"
                      width={25}
                      height={25}
                    />
                  </div>
                  <div className="ml-2">
                    <p className="text-sm lg:text-[16px] font-light text-start">
                      Service Client et Support
                    </p>
                    <p className="text-sm lg:text-[16px] font-light text-start">
                      +33 (0)1 88 83 88 58
                    </p>
                  </div>
                </div>

                <div className="flex lg:justify-start items-center gap-1 mb-4 lg:mb-0 bg-devinovGreen p-2 rounded-xl lg:w-[350px] w-[350px]">
                  <div className="bg-devinovYellow rounded-full p-4">
                    <Image
                      className=""
                      src={location}
                      alt="location"
                      width={30}
                      height={30}
                    />
                  </div>
                  <p className="text-sm lg:text-[16px] font-light text-start ml-2">
                    53 Av. du Bois de la Pie, 93290 Tremblay-en-France
                  </p>
                </div>

                <div className="flex lg:justify-start items-center gap-1 mb-4 lg:mb-0 bg-devinovGreen p-2 rounded-xl lg:w-[350px] w-[350px]">
                  <div className="bg-devinovYellow rounded-full p-4">
                    <Image
                      className=""
                      src={mail}
                      alt="email"
                      width={25}
                      height={25}
                    />
                  </div>
                  <div>
                    <p className="text-[sm] lg:text-[16px] font-light ml-2 text-start">
                      Email:
                    </p>
                    <p className="text-[sm] lg:text-[16px] font-light ml-2">
                      contact@devinov.com
                    </p>
                  </div>
                </div>
              </div>
              </div>
            </div>            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
