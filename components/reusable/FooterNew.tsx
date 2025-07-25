import logo from "@/assets/logo/larna-footer.png";
import mail from "@/assets/images/letter-footer.png";
import iphone from "@/assets/images/phone-footer.png";
import location from "@/assets/images/location-footer.png";
import Link from "next/link";
import Image from "next/image";

const FooterNew = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-larnaBlue text-white py-4 text-center flex justify-start mt-auto px-6 lg:pl-[50px] pl-2 pr-2 lg:pt-[35px] lg:pb-[15px]">
      <div className="flex flex-col max-w-[1280px]  justify-center mx-auto">
        <div className="flex lg:justify-start lg:flex-row md:flex-row flex-col gap-10">
          <div className="flex justify-center lg:mb-4 lg:mt-10">
            <Link href="/">
              <Image
                className=""
                src={logo}
                alt="Logo"
                width={300}
                height={0}
              />
            </Link>
          </div>
          <div className="lg:w-[30%] mb-10 w-full">
            <p className="text-white md:text-start text-center font-bold text-[18px] lg:text-[30px] lg:flex">
              LARNA DISTRIB
            </p>
            <p className="text-white text-start font-light text-sm lg:text-[16px] lg:flex">
              Votre partenaire professionnel pour des solutions photovoltaïques
              performantes.
            </p>
          </div>
        </div>
        <div className="flex items-center lg:gap-8 gap-4  lg:flex-row flex-col flex-wrap">
          <Link href="/contact">
            <div className="flex lg:justify-start items-center gap-1 mb-4 lg:mb-0 bg-devinovGreen p-2 rounded-xl lg:w-[300px] md:w-[350px] w-[350px]">
              <div className="bg-larnaBlue rounded-full p-4 h-14 w-14 flex items-center justify-center">
                <Image
                  className="object-contain"
                  src={iphone}
                  alt="iphone"
                  width={20}
                  height={20}
                />
              </div>

              <div className="ml-2">
                <p className="text-sm lg:text-[16px] font-light text-start">
                  Service Client et Support
                </p>
                <p className="text-sm lg:text-[16px] font-light text-start">
                  +33 (0)1 88 83 88 58
                </p>
              </div>
            </div>
          </Link>
          <Link href="/contact">
            <div className="flex lg:justify-start items-center gap-1 mb-4 lg:mb-0 bg-devinovGreen p-2 rounded-xl lg:w-[300px] md:w-[350px] w-[350px]">
              <div className="bg-larnaBlue rounded-full p-4 h-14 w-14 flex items-center justify-center">
                <Image
                  className="object-contain"
                  src={location}
                  alt="iphone"
                  width={20}
                  height={20}
                />
              </div>
              <p className="text-sm lg:text-[16px] font-light text-start ml-2">
                12 rue Paul Langevin 93270 Sevran
              </p>
            </div>
          </Link>
          <Link href="/contact">
            <div className="flex lg:justify-start items-center gap-1 mb-4 lg:mb-0 bg-devinovGreen p-2 rounded-xl lg:w-[300px] w-[350px]">
              <div className="bg-larnaBlue rounded-full p-4 h-14 w-14 flex items-center justify-center">
                <Image
                  className="object-contain"
                  src={mail}
                  alt="iphone"
                  width={20}
                  height={20}
                />
              </div>
              <div>
                <p className="text-[sm] lg:text-[16px] font-light ml-2 text-start">
                  Email:
                </p>
                <p className="text-[sm] lg:text-[16px] font-light ml-2">
                  contact@larna.fr
                </p>
              </div>
            </div>
          </Link>
        </div>

        <div className="mt-8 flex justify-start">
          <p className="font-light text-[16px]">
            © Copyright LARNA {currentYear} . Tous droits réservés, créé par
            <Link href="http://www.devinov.fr">
              <span> DEVINOV </span>
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterNew;
