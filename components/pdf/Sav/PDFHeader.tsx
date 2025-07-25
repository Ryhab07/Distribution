"use client";
import Image from "next/image";
import logo from "@/assets/logo/Logo-Larna.png";
//import bgImage from "@/assets/images/top-br-bl.png";
//import bgImagetwo from "@/assets/images/top-br-bls.png";

export function PDFHeader({ data, type }) {
  console.log("data", data);

  // Example usage

  // Get today's date
  const today = new Date();

  // Format the date
  const formattedDate = today.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });

  const formatDate = (dateString: string) => {
    const dateObject = new Date(dateString);
    const day = dateObject.getDate().toString().padStart(2, "0");
    const month = (dateObject.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based
    const year = dateObject.getFullYear();
    return `${day}/${month}/${year}`;
  };

  console.log("formattedDate", formattedDate);

  return (
    <div className="w-full mb-10  ">
      <div className=" ">
        <div className="pt-0 pl-5 flex justify-between w-full ">
          <div className="w-[360px]">
            <Image
              className="mt-1"
              src={logo}
              alt="Logo"
              width={300}
              height={200}
            />
          </div>

          <div className="!w-[280px]">
            <h1 className="text-[18px] font-bold mb-[30px]">
            {type}
            </h1>

          </div>
        </div>
        {/*<div
          className="pt-20 pl-5 flex justify-between bg-contain bg-right-bottom w-full relative bg-image h-[100px]"
          style={{ backgroundImage: `url(${bgImagetwo.src})` }}
        ></div>*/}
      </div>
      <div>
        <div className=" pl-5 pr-5 flex justify-between ">
          <div className=" flex flex-col mt-20 items-center ">
            <p className="font-bold text-[18px] ">Date : </p>
            {formatDate(data?.created_at)}
          </div>

          <div className="bg-[#fab516] p-4 rounded !w-[480px] h-[200px] items-center  mt-20 pt-10 pb-10">
            <div className="flex justify-start flex-col text-[12px] font-bold items-start">
              <h1 className="text-[26px] items-start flex  text-start">
                Retrait
              </h1>
              <p className="text-[26px] mt-4"> {data?.adresseRetrait? data?.adresseRetrait : "1 avenue de la gare <br /> 95380 Louvres"}</p>

            </div>
          </div>
          <div className="bg-[#397CC0] text-white p-4 rounded !w-[480px] h-[200px] items-center  gap-4 mt-20 pt-10 pb-10">
            <div className="flex justify-between text-[12px] font-bold">
              <p className="text-[22px]">SOCIETE</p>
              <p className="text-[22px]">{data?.installateur || data?.societe} </p>
            </div>
            <div className="flex justify-between mt-2">
              <p className="text-[22px] font-bold">NOM CLIENT </p>
              <p className="text-[22px]">{data?.client}</p>
            </div>
            <div className="flex justify-between  mt-2">
              <p className="text-[22px] font-bold">N° BL INITIAL </p>
              <p className="text-[22px]">{data?.numeroBlOuFacture} </p>
            </div>
          </div>
          </div>
        </div>
      </div>

  );
}
