import Image from "next/image";
import callOne from "@/assets/images/page-servelite.jpg";
import callTwo from "@/assets/images/homme-professionnel-tapant-ordinateur-portable.png";
import { ArrowRight} from "lucide-react";
import HoverButton from "./HoverButton";

const CallToAction = () => {
  return (
    <div className="relative w-full flex flex-col gap-20 lg:gap-0 lg:flex-row justify-between mt-10 mb-10">
      <div className="lg:w-1/2 w-full  mb-4 lg:mb-0">
        <div className=" relative">
          <div className="relative">
            <Image
              className="object-contain rounded-md"
              src={callOne}
              alt="icon"
              width={800}
              height={500}
            />
            <div className="absolute lg:bottom-[-50px] bottom-[-100px] left-1/2 transform -translate-x-1/2 bg-[#255D74] rounded-[10px] p-4 w-[90%] lg:w-[70%] text-center">
              <h3 className="text-white font-bold text-[16px]">
                Vous souhaitez recevoir notre catalogue
              </h3>
              <p className="text-white font-light text-[14px] lg:mb-0 mb-6">
                Vous désirez en savoir plus sur les prestations et les services
                que nous proposons? N’hésitez pas à nous transmettre vos
                coordonnées afin que nous puissions vous envoyer plus de
                détails.
              </p>
            </div>
          </div>
        </div>
        <div className="flex justify-center lg:mt-14 mt-[70px] gap-2  cursor-pointer ">
            <HoverButton color="#FAB516" directTo="/contact">
            <div className="bg-[#fab516] rounded-full opacity-90">
            <ArrowRight className="text-white w-6 h-6" />
          </div>
            Demandez le Catalogue
          </HoverButton>
        </div>
      </div>
      <div className="lg:w-[40%] w-full ">
        <div className="relative">
          <div className="relative">
            <Image
              className="object-contain rounded-md"
              src={callTwo}
              alt="icon"
              width={800}
              height={500}
            />
            <div className="absolute bottom-[-50px] left-1/2 transform -translate-x-1/2 bg-[#fab516] rounded-[10px] p-4 w-[90%] lg:w-[70%] text-center ">
              <h3 className="text-white font-bold text-[16px]">
                Besoin d’aide ?
              </h3>
              <p className="text-white font-light text-[14px] lg:mb-0 mb-4">
                Remplissez notre formulaire en ligne et obtenez un devis pour
                votre projet.
              </p>
            </div>
          </div>
        </div>
        <div className="flex justify-center lg:mt-14 mt-8 gap-2   cursor-pointer">
          <HoverButton color="2176A5" directTo="/contact">
          <div className="bg-[#255D74] rounded-full opacity-90">
          <ArrowRight className="text-white w-6 h-6"/>
          </div>
            Contactez-nous
          </HoverButton>
        </div>
      </div>
    </div>
  );
};

export default CallToAction;
