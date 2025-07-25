import Image from "next/image";
import DisabledButton from "./DisabledButton";
import Link from "next/link";
import HoverButtonNew from "./HoverButtonNew";
import { StaticImageData } from "next/image";

interface CardProps {
  title: string;
  image: string | StaticImageData;
  active: boolean;
  buttonText: string;
  redirectTo: string;
}

const ResusableCard: React.FC<CardProps> = ({
  title,
  image,
  active,
  buttonText,
  redirectTo,
}) => {
  return (
    <Link
      href={redirectTo}
      className="relative lg:w-[22%] w-[100%] md:w-[30%] mt-5 mb-[20px]"
    >
      <div>
        {/* Green div positioned outside of the parent div */}
        <div className="ml-[4px]  border-gray-300 absolute left-1/2 -translate-x-1/2 mt-[4px]  bg-[#25B4E4] z-10 h-[100%] rounded-lg w-[100%] mx-auto flex justify-center"></div>
        <div
          className={`mx-auto w-[95%] z-40 group cursor-pointer relative lg:w-full h-[265px] bg-[#B2EAFC] rounded-md border border-gray-300 overflow-hidden ${
            active
              ? "hover:rounded-t-[0px] hover:border-t-2 hover:border-t-[#FAB516]"
              : ""
          } transition-all duration-200 ease-out transform translate-x-0`}
        >
          <div>
            <Link href={redirectTo}>
              {active === true && (
                <div className="w-[60px] h-[60px] ml-auto mr-auto absolute top-8 lg:left-[90px] left-[120px] lg:group-hover:left-[100px] md:left-[80px] md:group-hover:left-[100px] group-hover:left-[180px] group-hover:top-[42px] bg-transparent bg-opacity-100 rounded-[22px] transition-all duration-300 group-hover:scale-150"></div>
              )}
              <div className="flex mt-8 justify-center h-full">
                <Image
                  /*style={{
                filter: !active ? "grayscale(100%)" : "none",
                opacity: !active ? 0.2 : 1,
              }}*/
                  className="mr-2 h-20 w-20 z-10"
                  src={image}
                  alt="icon"
                  width={100}
                  height={50}
                />
              </div>

              <div className="absolute bottom-20 left-0 right-0 text-center">
                <h2 className="text-[22px] font-bold relative">
                  <span className={`${!active ? "opacity-20" : ""} text-[#206DA7]`}>
                    {title === "Personnaliser Kits Photovoltaïque" ? (
                      <>
                        Personnaliser <br /> Kits Photovoltaïque
                      </>
                    ) : title === "Personnaliser Coffret AC" ? (
                      <>
                        Personnaliser <br /> Coffret AC
                      </>
                    ) : title === "Kits Photovoltaïque Prêt à l'emploi" ? (
                      <>
                        Kits Photovoltaïque <br /> Prêt à l&apos;emploi
                      </>
                    ) : title === "Kits de fixation Prêt à l'emploi" ? (
                      <>
                        Kits de fixation <br /> Prêt à l&apos;emploi
                      </>
                    ) : (
                      title
                    )}
                  </span>
                </h2>
              </div>
            </Link>
          </div>
          <div className="absolute bottom-4 flex items-center justify-center w-full">
            <div className="mx-auto">
              {active ? (
                <HoverButtonNew color="FAB517" directTo={redirectTo}>
                  {buttonText}
                </HoverButtonNew>
              ) : (
                <DisabledButton>{buttonText}</DisabledButton>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ResusableCard;
