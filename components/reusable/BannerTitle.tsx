interface BannerProps {
  tile: string;
  paragraph: string;
}

const BannerTitle: React.FC<BannerProps> = ({ tile, paragraph }) => {

  console.log("paragraph", paragraph)
  return (
    <div className="relative">
      <div className="lg:pt-[60px] pt-[80px] bg-cover bg-center lg:h-[20rem] h-[20rem]  w-full md:h-96 lg:h-120 xl:h-160 relative flex justify-start bg-[#D0E5F2] mt-[-120px]">
        <div className="lg:pl-[120px] pl-[30px] lg:pt-10 text-start  lg:mt-[52px] mt-[30px]  lg:font-bold font-bold lg:text-[50px] text-[30px] text-white">
          <h1 className="text-[25px] text-black  lg:pl-0 lg:ml-[70px] xl:ml-0 pl:ml-0 2xl:text-[30px] md:text-[30px] 4xl-devinov:text-[40px] 5xl-devinov:ml-[200px] 2xl:ml-0 2xl:pl-0 4xl-devinov:ml-[70px]">{tile}</h1>
          {paragraph !== "undefined" && (
            <p className="text-start  font-[500] lg:text-[20px] text-[14px] text-black 4xl-devinov:text-[40px] 5xl-devinov:ml-[200px] 2xl:ml-0 2xl:pl-0 4xl-devinov:ml-[70px]">
              {paragraph}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BannerTitle;
