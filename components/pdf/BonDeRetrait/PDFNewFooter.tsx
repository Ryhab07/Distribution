import Image from "next/image";
import bgImagetwo from "@/assets/images/footer-br.png";

const PDFNewFooter = () => {
  return (
    <div className="relative w-full h-[80px] mt-[-20px]">
      <Image
        src={bgImagetwo}
        alt="Footer Background"
        layout="fill"
        objectFit="cover"
        quality={100}
        priority
      />
      <div className="flex justify-between relative z-10"></div>
    </div>
  );
};

export default PDFNewFooter;
