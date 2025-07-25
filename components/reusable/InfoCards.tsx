import React from "react";
import Image from "next/image";
import { infoCards } from "@/constants";

const InfoCards: React.FC = () => {
  return (
    <div className="max-w-[1280px] lg:grid hidden lg:grid-cols-2 xl:grid-cols-4 gap-6 lg:mt-[-100px] mt-10 w-[90%] ml-auto mr-auto">
      {infoCards.map((product, index) => (
        <div
          className="group cursor-normal bg-white rounded-md border border-gray-300 overflow-hidden relative"
          key={index}
        >
          <div className="flex justify-center h-[120px]">
            <Image
              className="object-contain"
              src={product.image}
              alt="icon"
              width={80}
              height={80}
            />
          </div>

          <div className="p-4">
            <h2 className="text-xl font-bold mb-2 text-center">{product.title}</h2>
            <p className="text-gray-500 text-center">{product.paragraphe}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default InfoCards;
