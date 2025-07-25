
import Image from "next/image";
import notFound from "@/assets/icons/404-introuvable-2.png";


const page = () => {

  return (
    <div className="min-h-screen mb-20 ">

      <div className="flex justify-center items-center flex-col gap-8 lg:w-[70%] w-[90%] mx-auto mt-20">
        <Image
          className="object-contain"
          src={notFound}
          alt="not-found-image"
          width={200}
          height={200}
        />
        <h1 className="lg:text-3xl text-lg font-[600] lg:font-bold text-center">
          OOOOPS ! PAGE INTROUVABLE
        </h1>
        <p className="text-center leading-[32px] mb-4 text-[14px]">
          Nous ne trouvons pas la page que vous cherchez. <br/> Elle a peut-être été
          déplacée, renommée ou n&apos;existe tout simplement pas.<br/> Mais ne vous
          inquiétez pas, vous pouvez retourner à notre page d&apos;accueil ou
          utiliser notre barre de recherche pour trouver ce dont vous avez
          besoin. <br/>Si vous avez besoin d&apos;aide, n&apos;hésitez pas à nous
          contacter.
        </p>
        <div className="mt-8 flex justify-center gap-40">
            <div>
              <a
                href="/"
                className={`border border-[#fab516] hidden lg:inline-block px-5 py-2 relative rounded-[4px] group overflow-hidden font-medium bg-transparent text-[#fab516]  `}
              >
                <span
                  className={`text-[#fab516] absolute top-0 left-0 flex w-0 h-full mr-0 transition-all duration-200 ease-out transform translate-x-0 bg-[#fab516] group-hover:w-full opacity-90`}
                ></span>
                <span
                  className={`text-[#fab516] relative group-hover:text-white flex gap-2`}
                >
                  Accueil
                </span>
              </a>

              <a
                href="/"
                className={`lg:hidden px-5 py-2.5 relative rounded group overflow-hidden font-medium bg-[#fab516] text-white inline-block`}
              >
                {/* Background fill */}
                <span
                  className={`text-[#fab516] absolute top-0 left-0 flex w-full h-full transition-all duration-200 ease-out transform translate-x-0 opacity-90`}
                ></span>
                {/* Text content */}
                <span className={`relative flex gap-2`}>Accueil</span>
              </a>
            </div>
          </div>
      </div>
    </div>
  );
};

export default page;
