import Image from "next/image";
import logo from "@/assets/logo/Logo-Larna.png";

interface BannerProps {
  imageUrl: string;
}

const Banner: React.FC<BannerProps> = ({ imageUrl }) => {
  return (
    <div className="relative">
      {/* Banner with full-width responsive background image */}
      <div
        className="lg:pt-[60px] pt-[80px] bg-cover bg-center h-64 w-full md:h-96 lg:h-120 xl:h-160 relative flex justify-center"
        style={{ backgroundImage: `url(${imageUrl})` }}
      >
        <div className="flex lg:mt-10 lg:w-[50%] w-[80%] items-center flex-col">
          <Image className="mb-10" src={logo} alt="Logo" width={250} height={200} />

          <h1 className="xl:text-3xl text-center font-bold text-lg">
            Votre fournisseur pour vous accompagner dans la transition
            énergétique{" "}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Banner;
