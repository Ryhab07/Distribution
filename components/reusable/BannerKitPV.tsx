import bannerImg from "@/assets/images/pv-banner.png";
import { Button } from "../ui/button";
import Link from 'next/link';


function BannerKitPV() {
  return (
<div
  className="relative max-w-[1280px] !h-[250px] mx-auto md:h-96 bg-cover bg-top   mt-10 rounded-lg"
  style={{ backgroundImage: `url(${bannerImg.src})` }}
>
      <div className="lg:hidden block absolute inset-0 bg-black opacity-50"></div>
      <div className="absolute inset-0 flex items-center justify-start p-10 text-white text-2xl font-semibold ">
        <div className="lg:w-[40%] w-full lg:text-start text-center mt-10">
          <p className="lg:text-[30px] text-2xl mb-10 mt-5">Créez Votre Kit Photovoltaïque Sur Mesure !</p>
          <Link href="/produits/le-photovoltaique/kit-pv-personnalise" passHref>
            <Button className="bg-[#1e56a1]">Personnaliser mon Kit</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default BannerKitPV;
