import Image from "next/image";
import logo from "@/assets/logo/Logo-Larna.png";
//import bgImage from "@/assets/images/top-br-bl.png";
import bgImagetwo from "@/assets/images/top-br-bls.png";
import { useEffect, useState } from "react";

interface User {
  name: string;
  adresse: string;
  lastname: string;
}

interface UserData {
  user: User;
}

export function PDFHeader({ confirmation, date }) {
  const Nom = sessionStorage.getItem("name");
  const NomClient = sessionStorage.getItem("clientName");
  const LastNameClient = sessionStorage.getItem("clientLastName");
  const AdresseClient = sessionStorage.getItem("clientAdresse");
  const EntrepriseClient = sessionStorage.getItem("clientEntreprise");
  const Address = sessionStorage?.getItem("adresse");
  const Role = sessionStorage?.getItem("role");
  const [userData, setUserData] = useState<UserData | null>(null);

  console.log("date", date);
  console.log("EntrepriseClient", EntrepriseClient)

  // Define a function to split the address
  const splitAddress = (address: string | null): string[] => {
    if (!address) {
      return ["", ""];
    }
    return address.split(", ");
  };

  // Example usage
  const address = Address;
  const [street, city] = splitAddress(address);
  const userId = sessionStorage.getItem("value");

  // Get today's date
  const today = new Date();

  // Format the date
  const formattedDate = today.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });

  console.log("formattedDate", formattedDate);

  useEffect(() => {
    // Function to fetch user information
    const fetchUserInfo = async () => {
      try {
        const response = await fetch(`/api/admin/user-info/${userId}`);
        if (response.ok) {
          const userData = await response.json();
          setUserData(userData);
        } else {
          console.error("Failed to fetch user information");
        }
      } catch (error) {
        console.error("Error fetching user information:", error);
      }
    };

    // Call the fetchUserInfo function
    fetchUserInfo();
  }, [userId]);

  console.log("userData", userData);

  return (
    <div className="w-full  mb-1  ">
      <div className=" ">
        <div className="pt-0 pl-5 flex justify-between w-full ">
          <div className="w-[180px]">
            <Image
              className="mt-1"
              src={logo}
              alt="Logo"
              width={150}
              height={100}
            />
          </div>
          <div className="w-[150px] ">
            <p className="font-bold text-[10px]">LARNA</p>
            <p className="text-[10px]">N° Téléphone : 01 88 83 88 58 </p>
          </div>
          <div className="!w-[280px]">
            <p className="text-[10px]">
              Adresse : 1 avenue de la gare 95380 Louvres
            </p>
            <p className="text-[10px]">Email : contact@devinov.com </p>
          </div>
        </div>
        <div
          className="pt-20 pl-5 flex justify-between bg-contain bg-right-bottom w-full relative bg-image h-[80px]"
          style={{ backgroundImage: `url(${bgImagetwo.src})` }}
        ></div>
      </div>
      <div>
        <div className=" pl-5 pr-5 flex justify-between mt-[-20px]">
          <div className="!w-[180px]">
            <p className="font-bold text-[10px] text-transparent">LARNA</p>
            <p className="text-[10px] text-transparent">
              N° Téléphone : 01 88 83 88 58{" "}
            </p>
          </div>
          {Role !== "picker" && (
            <div className="w-[150px] ">
              <p className="font-bold text-[12px]">Client</p>
              <p className="text-[12px]">{Nom} </p>
              <p className="text-[12px]">{street} </p>
              <h1 className="text-[12px]">{city}</h1>
              <h1 className="text-[12px]">France </h1>
            </div>
          )}
          {Role === "picker" && (
            <div className="w-[150px] ">
              <p className="font-bold text-[12px]">Client</p>
              <p className="text-[12px]">{EntrepriseClient}</p>
              <p className="text-[12px]">
                {NomClient} {LastNameClient}
              </p>
              {AdresseClient && (
                <>
                  <p className="text-[12px]">{AdresseClient.split(", ")[0]}</p>
                  <h1 className="text-[12px]">
                    {AdresseClient.split(", ")[1]}
                  </h1>
                </>
              )}
              <h1 className="text-[12px]">France</h1>
            </div>
          )}

          <div className="bg-[#fab516] p-4 rounded !w-[260px] items-center my-auto">
            <div className="flex justify-between text-[12px] font-bold">
              <p className="text-[12px]">Commande N° </p>
              <p className="text-[12px]">{confirmation} </p>
            </div>
            <div className="flex justify-between">
              <p className="text-[12px]">Date démission </p>
              <p className="text-[12px]">{formattedDate} </p>
            </div>
          </div>
        </div>
      </div>
      {/*<div>
          <div className="w-[213px]">
            <div className="p-2 bg-[#FBFBFB] border border-[#6F6F6F] mt-4 mb-10 w-[100%] rounded-[10px]">
              <h1 className="font-[400] text-[12px] underline">Client </h1>
              <h1 className="font-bold text-[12px]">{Nom}</h1>
              <h1 className="font-[400] text-[12px]">
              {street}{" "}
              </h1>
              <h1 className="font-[400] text-[12px]">{city}</h1>
              <h1 className="font-[400] text-[12px]">France </h1>
            </div>
          </div>
  </div>*/}

      {/*<div>
        <h1 className="font-bold text-[12px]">Commande N° {confirmation}</h1>
        <p className="font-[400] text-[10px] text-right">Date démissio n : {formattedDate} </p>
</div>*/}
    </div>
  );
}
