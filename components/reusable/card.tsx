import Image from "next/image";

import Link from "next/link";
import HoverButtonNew from "./HoverButtonNew";
import { StaticImageData } from "next/image";

interface CardProps {
  title: string;
  image: string | StaticImageData;
  active: boolean;
  directTo: string;
}

const Card: React.FC<CardProps> = ({ title, image, active, directTo }) => {
  return (
    <div className="relative lg:w-[30%] md:w-[30%] mt-10 ">
      {/* Green div positioned outside of the parent div */}
      <div className="border-gray-300 absolute left-1/2 -translate-x-1/2 mt-[250px] bg-devinovGreen z-10 h-[10%] rounded-lg w-[80%] mx-auto flex justify-center"></div>

      <div
        className={`z-40 group cursor-pointer relative w-full h-[265px] bg-white rounded-md border border-gray-300 overflow-hidden ${
          active
            ? "hover:rounded-t-[0px] hover:border-t-2 hover:border-t-[#fab516]"
            : ""
        } transition-all duration-200 ease-out transform translate-x-0`}
      >
        <Link href={active ? directTo : '#'} passHref>
          {active === true && (
            <div className="w-[60px] h-[60px] ml-auto mr-auto absolute top-8  lg:left-[120px] left-[120px] md:left-[80px] md:group-hover:left-[100px] lg:group-hover:left-[140px] group-hover:left-[150px] group-hover:top-[42px] bg-[#fab516] bg-opacity-100 rounded-[22px] transition-all duration-300 group-hover:scale-150"></div>
          )}
          <div className="flex mt-8 justify-center h-full">
            <Image
              /*style={{
                filter: !active ? "grayscale(100%)" : "none",
                opacity: !active ? 0.2 : 1,
              }}*/
              className="mr-2 h-20 w-20 z-40"
              src={image}
              alt="icon"
              width={100}
              height={50}
            />
          </div>

          <div className="absolute bottom-20 left-0 right-0 text-center">
            <h2 className="text-[16px] font-bold relative">
              <span className={` ${!active ? "opacity-100" : ""}`}>
                {title === "Panneaux Photovoltaique"
                  ? "Le Photovoltaique"
                  : title}
              </span>
            </h2>
          </div>

          {/* Overlay for "Coming Soon" text */}
          {!active && (
            <div className="lg:inset-0 lg:opacity-0 opacity-50 absolute top-0 left-0 flex w-full lg:w-[180px] h-full mr-0 transition-all duration-200 ease-out transform translate-x-0 bg-black lg:hover:w-full lg:hover:opacity-40 items-center justify-center">
              <span className="text-white font-bold text-center">
                Disponible <br /> Prochainement
              </span>
            </div>
          )}

          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-full">
            {active && (
              <HoverButtonNew color="#FAB516" directTo={directTo}>
                Voir les produits
              </HoverButtonNew>
            ) }
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Card;
