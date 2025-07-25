import Image from "next/image";
import callOne from "@/assets/images/contact.png";
import mail from "@/assets/images/cta-mail.png"
import phone from "@/assets/images/cta-phone.png"
//import { Separator } from "../ui/separator";
//import HoverButtonNew from "./HoverButtonNew";

const CallToActionBottomNew = () => {
  return (
    <div>
      
      <div className="lg:w-[80%] w-[100%] lg:h-[280px] h-auto mx-auto relative flex items-center justify-between bg-[#D0E5F2] text-white lg:p-8 px-4 pt-6 rounded-3xl z-30">
        <div className="lg:max-w-[1280px] flex justify-center items-center  lg:gap-[10px] gap-10 mx-auto lg:flex-row flex-col ">
          <div className="lg:w-[80%] w-full text-center ">
            <div className="">
              <div className="flex justify-center mb-4">
                <h1 className="lg:text-[30px] lg:font-bold text-[25px] font-semibold relative text-devinovGreen text-end">
                Besoin d&apos;infos ou de notre catalogue ? !
                </h1>
              </div>
              <p className="lg:text-[14px] text-[12px]  mt-6 lg:mt-0 text-black font-semibold italic">
              Une question ? Une demande ? Nous sommes là pour vous répondre !
              </p>
            </div>
            <p className="font-[200] lg:text-[13px] text-[10px] mt-4 italic text-black">
            Que ce soit pour une demande de catalogue ou un conseil personnalisé, contactez-nous sans hésiter :
            </p>

            <div className="flex flex-col gap-2 mt-2">
              <div className="flex justify-start gap-2 items-center">
                <Image
                  className="object-contain rounded-md lg:max-w-[100%] max-w-[100%] h-auto"
                  src={mail}
                  alt="icon"
                  width={40}
                  height={40}
                />
                <p className="text-black"><span className="font-bold text-[#255D74]">Par e-mail: </span>contact@larna.fr</p>
              </div>
              <div className="flex justify-start gap-2 items-center">
              <Image
                  className="object-contain rounded-md lg:max-w-[100%] max-w-[100%] h-auto"
                  src={phone}
                  alt="icon"
                  width={40}
                  height={40}
                />
                <p className="text-black"><span className="font-bold text-[#255D74]">Par téléphone: </span>+33 (0)1 85 10 56 45</p>
              </div>
            </div>

          </div>
          <div className="lg:w-[30%] w-full text-end flex lg:justify-end justify-center lg:mt-[0px] ">
            <Image
              className="object-contain rounded-md lg:max-w-[100%] max-w-[100%] h-auto"
              src={callOne}
              alt="icon"
              width={900}
              height={500}
            />
          </div>
        </div>
      </div>
      <div className="lg:w-[80%] h-[280px] ml-[10.5%] w-[80%] mx-auto relative flex items-center justify-between bg-[#FEE2B7] text-white p-20 rounded-[30px] mt-[-275px] z-20"></div>
    </div>
  );
};

export default CallToActionBottomNew;
