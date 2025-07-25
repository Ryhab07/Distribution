
import Image from "next/image";
import { Logos } from "@/constants";

const LogoShowcase: React.FC = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 lg:gap-x-40 mt-10 lg:gap-y-10 gap-10 p-[20px]">

      {Logos.map((product, index) => (
        <div key={index} className="bg-white rounded-lg p-6 shadow-md flex justify-center ">
          <Image
            src={product.image}
            alt={product.title}
            width={150}
            height={50}
          />
        </div>
      ))}
    </div>
  );
};

export default LogoShowcase;
