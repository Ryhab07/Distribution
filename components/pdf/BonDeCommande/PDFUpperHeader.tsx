"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import BarcodeComponent from "../Barcode";
import { PDFTitle } from "./PDFTitle";

interface User {
  name: string;
  adresse: string;
  lastname: string;
}

interface UserData {
  user: User;
}

const PDFUpperHeader = ({ confirmation, date }) => {
  const Nom = sessionStorage.getItem("name");
  const NomClient = sessionStorage.getItem("clientName");
  const LastNameClient = sessionStorage.getItem("clientLastName");
  const AdresseClient = sessionStorage.getItem("clientAdresse");
  const EntrepriseClient = sessionStorage.getItem("clientEntreprise");
  const Address = sessionStorage?.getItem("adresse");
  const [userData, setUserData] = useState<UserData | null>(null);
  const Role = sessionStorage?.getItem("role");
  const userId = sessionStorage.getItem("value");
  const [headerHeight, setHeaderHeight] = useState<number>(0);
  const headerRef = useRef<HTMLDivElement>(null);
  console.log("date", date);
  console.log("userData", userData);
  // Define a function to split the address
  const splitAddress = (address: string | null): string[] => {
    if (!address) {
      return ["", ""];
    }
    return address.split(", ");
  };

  // Use useLayoutEffect to measure the header's height after it has been rendered
  useLayoutEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }
  }, []); // Empty dependency array ensures this runs only once after the first render

  console.log("headerHeight", headerHeight);

  // Example usage
  const address = Address;
  const [street, city] = splitAddress(address);

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

  return (
    <div>
      <div className=" pl-5 pr-5 flex justify-between ">
        <div className="!w-[180px]">
          <p className="font-bold text-[10px] text-transparent">LARNA</p>
          <p className="text-[10px] text-transparent">
            N° Téléphone : 01 88 83 88 58{" "}
          </p>
        </div>
        {Role !== "picker" && (
          <div className="w-[150px] ">
            <p className="font-bold text-[12px] text-[#fab516]">Client</p>
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
                <h1 className="text-[12px]">{AdresseClient.split(", ")[1]}</h1>
              </>
            )}
            <h1 className="text-[12px]">France</h1>
          </div>
        )}
        <div className="bg-[#fab516] p-4 rounded !w-[300px] items-center my-auto text-white">
          <div className="flex justify-start gap-4 text-[12px] font-bold ">
            <p className="text-[16px] font-bold">Numéro du Bon:</p>
            <p className="text-[16px] font-bold text-start">{confirmation} </p>
          </div>
          <div className="flex justify-start gap-4 text-[12px] font-bold">
          <p className="text-[16px] font-bold">Date démission:  </p>
          <p className="text-[16px] font-bold text-start">{formattedDate} </p>
          </div>
          <div className="flex justify-between mt-2">
            <p className="text-[11px] w-[30%] font-bold">A retirer à : </p>
            <p className="text-[10px] w-[70%] ">
              Tremblay WMS <br/> 53 AV DU BOIS DE LA PIE <br/> 93290 TREMBLAY EN FRANCE
            </p>
          </div>
        </div>
      </div>
      <div className="flex justify-between px-10 mb-[-20px] items-center">
        <PDFTitle />
        <BarcodeComponent barcodeData={confirmation} />
      </div>
    </div>
  );
};

export default PDFUpperHeader;
