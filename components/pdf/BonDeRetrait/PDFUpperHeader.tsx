"use client";

import { useEffect } from "react";
import BarcodeComponent from "../Barcode";

const PDFUpperHeader = ({ confirmation, date }) => {
  const Nom = sessionStorage.getItem("name");
  const NomClient = sessionStorage.getItem("clientName");
  const LastNameClient = sessionStorage.getItem("clientLastName");
  const AdresseClient = sessionStorage.getItem("clientAdresse");
  const EntrepriseClient = sessionStorage.getItem("clientEntreprise");
  const Address = sessionStorage.getItem("adresse");
  const Role = sessionStorage.getItem("role");
  const Tel = sessionStorage.getItem("phone");
  const entreprise = sessionStorage.getItem("entreprise");
  const email = sessionStorage.getItem("email");

  const splitAddress = (address: string | null): string[] => {
    if (!address) return ["", ""];
    return address.split(", ");
  };
  const [street, city] = splitAddress(Address);

  const today = new Date();
  const formattedDate = today.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });

  return (
    <div className="w-full px-6 pt-2">
      <div className="flex justify-between items-start gap-x-8 border border-transparent shadow-md rounded-lg p-6">
        {/* Bloc Client */}
        <div className="text-[12px] leading-[1rem] w-[300px] flex flex-col justify-between">
          <div className="space-y-1">
            <h2 className="font-bold text-[#fab516] mb-1">Client</h2>
            {Role !== "picker" ? (
              <>
                <p className="font-bold uppercase text-sm">{entreprise}</p>
                <p>{street}</p>
                <p>{email}</p>
                <p>{Tel}</p>
              </>
            ) : (
              <>
                <p>{EntrepriseClient}</p>
                <p>
                  {NomClient} {LastNameClient}
                </p>
                {AdresseClient && (
                  <>
                    <p>{AdresseClient.split(", ")[0]}</p>
                    <p>{AdresseClient.split(", ")[1]}</p>
                  </>
                )}
              </>
            )}
          </div>

          <div className="mt-3 flex justify-start">
            <BarcodeComponent barcodeData={confirmation} />
          </div>
        </div>

        {/* Bloc Bon */}
        <div className="bg-[#215d74] text-white p-4 rounded-md w-[250px] text-[10px] space-y-2">
          <div className="flex justify-between">
            <span className="font-bold">Numéro du Bon :</span>
            <span>{confirmation}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-bold">Date d’émission :</span>
            <span >{formattedDate}</span>
          </div>
          <div className="text-[10px] text-white font-bold">
            <p className="flex justify-between items-start">
            <span>À retirer à :</span>
            <span className="font-normal text-right ml-2 w-[140px] leading-tight">
                Tremblay WMS, 53 AV DU BOIS DE LA PIE,<br />
                93290 TREMBLAY EN FRANCE
            </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFUpperHeader;
