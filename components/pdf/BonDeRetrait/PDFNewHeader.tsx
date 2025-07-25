import Image from "next/image";
import bgImagetwo from "@/assets/images/header-br.png";

const PDFNewHeader = () => {
  return (
    <div className="relative w-full h-[90px]">
      {/* Optimized Background Image */}
      <Image
        src={bgImagetwo}
        alt="Header Background"
        layout="fill"
        objectFit="cover"
        quality={100}
        priority
      />

      <div className="flex justify-between relative z-10"></div>
    </div>
  );
};

export default PDFNewHeader;
