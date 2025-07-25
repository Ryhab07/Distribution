import Image from "next/image";
import callOne from "@/assets/images/service-avant-tout.png";
import { Separator } from "../ui/separator";
import HoverButtonNew from "./HoverButtonNew";

const CallToActionNew = () => {
  return (
    <div className="w-full bg-[#f0f0f0] lg:px-50 lg:py-10 px-10 py-10">
      <div className="lg:max-w-[1280px] flex justify-center items-center  lg:gap-[95px] gap-10 mx-auto lg:flex-row flex-col ">
        <div className="lg:w-[45%] w-full text-left">
          <Image
            className="object-contain rounded-md"
            src={callOne}
            alt="icon"
            width={800}
            height={500}
          />
        </div>
        <div className="lg:w-[60%] w-full text-start ">
          <div className="lg:mb-20 mb-10">
            <div className="flex justify-start mb-4">
              <h1 className="lg:text-[40px] lg:font-bold text-[25px] font-semibold relative text-[#1E56A1] text-center">
                Le service avant tout
                <div className=" ">
                  <Separator className="lg:w-[200px] w-[120px] bg-[#1E56A1] " />
                  <Separator className="lg:w-[200px] w-[120px] bg-[#1E56A1] " />
                  <Separator className="lg:w-[200px] w-[120px] bg-[#1E56A1] " />
                </div>
              </h1>
            </div>
            <p className="text-[15px] font-[500]">
              Choix des produits, livraisons, service après vente, nous sommes
              avec vous de A à Z !
            </p>
          </div>
          <p className="font-[200] text-[16px]">
            Vous souhaitez recevoir notre catalogue ? Besoin d&apos;informations
            ou d&apos;un devis pour vos projets ? Remplissez notre formulaire en
            ligne pour obtenir notre catalogue et d&eacute;couvrir en
            d&eacute;tail nos services. Nous sommes pr&ecirc;ts &agrave; vous
            accompagner vers la r&eacute;ussite. Pour une assistance
            personnalis&eacute;e, contactez-nous d&egrave;s maintenant.
          </p>
          <div className="mt-10 ">
            <HoverButtonNew
                color="#FAB516"
                directTo='/contact'
                >
                Contactez-nous
                </HoverButtonNew>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CallToActionNew;
