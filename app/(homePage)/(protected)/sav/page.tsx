import BannerTitle from "@/components/reusable/BannerTitle";
import Breadcrumb from "@/components/reusable/BreadCrumb";


const Page = () => {
  const breadcrumbPaths = [
    { name: "Accueil", url: "/" },
    { name: "SAV", url: "/sav" },
  ];
  return (
    <div className="min-h-screen flex-col justify-between lg:pt-[70px] pt-[60px] ">
      <BannerTitle
        tile={"Portail SAV"}
        paragraph={""}
      />
      <Breadcrumb paths={breadcrumbPaths} />
      <div className="lg:p-20 p-10 max-w-[1280px] mx-auto">
        <h3 className="text-red-500 text-center mt-10">vous n&apos;avez pas accès à cette page.</h3>
      </div>
    </div>
  );
};

export default Page;
