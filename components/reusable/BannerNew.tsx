import { useEffect, useState } from "react";

interface BannerProps {
  imageUrl: string;
  overlayUrl: string;
}


const BannerNew: React.FC<BannerProps> = ({ imageUrl, overlayUrl }) => {
  const [showImage, setShowImage] = useState(true);

  console.log("showImage", showImage)
  console.log("overlayUrl", overlayUrl)  

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 798) {
        // Adjust the breakpoint as needed
        setShowImage(false);
      } else {
        setShowImage(true);
      }
    };

    // Initial check
    handleResize();

    // Event listener for window resize
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
<div className="relative">
      {/* Background Image Section */}
      <div
        className="lg:pt-[60px] pt-[80px] bg-cover bg-center h-64 w-full md:h-96 lg:h-120 xl:h-160 relative flex justify-center lg:bg-transparent"
        style={{ backgroundImage: `url(${imageUrl})` }}
      >
        {/* Container for Overlay */}
        <div className="relative flex items-center justify-start ml-40 w-full h-full">
          <div className="bg-[rgba(208,229,242,0.8)] w-full max-w-[40%] py-4 rounded-[10px] flex items-start justify-start">
            <h1 className="text-start text-[20px] font-bold text-black px-5">
              Votre fournisseur pour vous accompagner dans la transition
              énergétique
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerNew;
