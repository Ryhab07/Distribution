import logo from "@/assets/logo/Logo-Larna.png";
import adresse from "@/assets/icons/adresse.png";
import telephone from "@/assets/icons/telephone.png";
import email from "@/assets/icons/email-contact.png";
import web from "@/assets/icons/site-web.png";
import Link from "next/link";
import Image from "next/image";
import { Separator } from "../ui/separator";

const Footer = () => {
  return (
    <footer className="bg-black text-white py-4 text-center flex justify-center mt-auto">
      <div className="flex flex-col">
        <div className=" flex justify-center mb-4">
          <Link href="/Accueil">
            <Image className="" src={logo} alt="Logo" width={200} height={50} />
          </Link>
        </div>
        <div className="flex justify-center">
          <p className="text-white text-center font-light text-sm lg:text-[16px] hidden lg:flex">
            Votre partenaire Professionnel (B2B) en rénovation énergétique.
          </p>
        </div>
        <div className="flex items-center mt-4 lg:gap-8 gap-4 lg:flex-row flex-col">
          <div className="flex justify-center items-center gap-1 mb-4 lg:mb-0">
            <Image
              className=""
              src={adresse}
              alt="adresse"
              width={30}
              height={30}
            />
            <p className="text-sm lg:text-[16px] font-light">12 rue Paul Langevin 93270 Sevran</p>
          </div>
          <div className="flex justify-center items-center gap-1 mb-4 lg:mb-0">
            <Image className="" src={web} alt="web" width={30} height={30} />
            <Link href="http://www.econegoce.com">
              <p className="text-sm lg:text-[16px] font-light">www.econegoce.com</p>
            </Link>
          </div>
          <div className="flex justify-center items-center gap-1 mb-4 lg:mb-0">
            <Image
              className=""
              src={telephone}
              alt="telephone"
              width={30}
              height={30}
            />
            <p className="text-sm lg:text-[16px] font-light">+33 (0)1 88 83 88 58</p>
          </div>
          <div className="flex justify-center items-center gap-1 mb-4 lg:mb-0">
            <Image
              className=""
              src={email}
              alt="email"
              width={30}
              height={30}
            />
            <p className="text-[sm] lg:text-[16px] font-light">contact@larna.fr</p>
          </div>
        </div>
        <Separator className="w-[25%] ml-auto mr-auto mt-8"/>
        <div className="mt-4">
        <p className="text-[9px] font-light">
          LARNA  © {new Date().getFullYear()}. All Rights Reserved. Créer par{' '}
          <Link href="http://www.devinov.fr">
            <span> DEVINOV </span>
          </Link>
        </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
