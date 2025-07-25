import plus from "@/assets/icons/partenaire-ideal.png";
import { newInfoCarfs } from "@/constants";
import Image from "next/image";

const InfoCardsNew: React.FC = () => {
  return (
    <div className="lg:max-w-[1280px] ml-auto mr-auto mt-10">
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 md:grid-cols-4 ">
        <div className="text-[13px] font-[200] flex justify-start gap-[2px] text-start">
          <Image
            className="mr-2 h-8 w-8"
            src={plus}
            alt="icon"
            width={50}
            height={50}
          />
          <p>Une prestation de haute qualité</p>
        </div>
        <div className="text-[13px] font-[200] flex justify-start gap-[2px] text-start">
          <Image
            className="mr-2 h-8 w-8"
            src={plus}
            alt="icon"
            width={50}
            height={50}
          />
          <p>Des marques reconnues</p>
        </div>
        <div className="text-[13px] font-[200] flex justify-start gap-[2px] text-start">
          <Image
            className="mr-2 h-8 w-8"
            src={plus}
            alt="icon"
            width={50}
            height={50}
          />
          <p>Un SAV haut de gamme</p>
        </div>
        <div className="text-[13px] font-[200] flex justify-start gap-[2px] text-start">
          <Image
            className="mr-2 h-8 w-8"
            src={plus}
            alt="icon"
            width={50}
            height={50}
          />
          <p>Des produits à faible coûts</p>
        </div>
        <div className="text-[13px] font-[200] flex justify-start gap-[2px] text-start">
          <Image
            className="mr-2 h-8 w-8"
            src={plus}
            alt="icon"
            width={50}
            height={50}
          />
          <p>Un partenaire de confiance</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 lg:gap-4 md:grid-cols-2 gap-4 mt-10">
        {newInfoCarfs.map((product, index) => (
          <div
            key={index}
            className={`group cursor-pointer relative rounded-md border bg-[#f0f0f0] overflow-hidden p-2 flex gap-4 lg:w-[235px] w-full border-[#dfdfdf] transition-transform duration-500 ease-in-out transform rotate-0 `}
          >
            {/* Black overlay */}
            <div className="absolute top-0 left-0 flex w-0 h-full transition-all duration-200 ease-out transform translate-x-0 bg-black bg-opacity-20 group-hover:w-full opacity-90 z-10"></div>

            {/* Image */}
            <div className="group w-[30%] h-auto  my-auto relative z-20">
              <Image
                className="mr-2 w-[80px] h-auto my-auto transition-transform duration-500 ease-in-out transform rotate-0 group-hover:rotate-90"
                src={product.image}
                alt="icon"
                width={100}
                height={50}
              />
            </div>

            {/* Content */}
            <div className="w-[60%]">
              <h2 className="text-[15px] font-[500] text-start">
                {product.title}
              </h2>
              <p className="text-[13px] font-[200] text-start">
                {product.paragraphe}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfoCardsNew;
