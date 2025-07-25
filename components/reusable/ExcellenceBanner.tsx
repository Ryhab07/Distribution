import Image from "next/image";
import { FC } from "react";
import badge from "@/assets/images/badge.png"

const ExcellenceBanner: FC = () => {
  return (
    <div className="bg-larnaCiel bg-opacity-30 py-10 px-6 text-center">
      <h2 className="text-2xl md:text-3xl font-bold text-larnaBlue">
        L&apos;excellence au meilleur prix !
      </h2>
      <p className="text-black mt-2 font-medium">
        Faites le choix de l&apos;intelligence pour vos achats :
        <span className="font-bold"> Qualité, Fiabilité & Économies </span>
        réunies !
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 mx-auto">
        {items.map((item, index) => (
          <div key={index} className="flex justify-center items-center gap-3">
            <Image
                  className="object-contain rounded-md lg:max-w-[100%] max-w-[100%] h-auto"
                  src={badge}
                  alt="icon"
                  width={40}
                  height={40}
                />
            <div className="text-left">
              <h3 className="font-bold text-larnaBl">{item.title}</h3>
              <p className="text-black">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
      
      <p className="text-devinovGreen font-medium mt-6 italic">
        Achetez malin, profitez pleinement !
      </p>
    </div>
  );
};

const items = [
  { title: "Des produits d’exception", description: "soigneusement sélectionnés" },
  { title: "Des prix ultra compétitifs", description: "pour en avoir plus sans dépenser plus" },
  { title: "Les plus grandes marques", description: "pour une totale confiance" },
  { title: "Une préparation express", description: "pour une livraison sans attente" },
  { title: "Un service après-vente premium", description: "à votre écoute" },
  { title: "Un stock toujours disponible", description: "commandez en toute sérénité" },
];

export default ExcellenceBanner;
