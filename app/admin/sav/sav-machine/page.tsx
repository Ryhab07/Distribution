
import { SavMachinesForm } from "@/components/auth/sav-machine";
import BannerTitle from "@/components/reusable/BannerTitle";
import Title from "@/components/reusable/BigTitle";
import Breadcrumb from "@/components/reusable/BreadCrumb";

const Page = () => {
  const breadcrumbPaths = [
    { name: "Accueil", url: "/admin/mon-compte" },
    { name: "sav", url: "/admin/sav" },
    { name: "Formulaire de Retour Machine ", url: "/admin/sav/liste-sav-machine" },
  ];
  return (
    <div className="min-h-screen flex-col justify-between lg:pt-[70px] pt-[60px] ">
      <BannerTitle tile={"RETOUR MACHINE"} paragraph={"Formulaire De RETOUR MACHINE"} />

      <Breadcrumb paths={breadcrumbPaths} />
      <div className="lg:p-20 p-10 max-w-[1280px] mx-auto">
        <div className="flex justify-center mx-auto">
          <Title>Formulaire De Retour Machine</Title>
          
        </div>
        <div className="flex justify-center mx-auto mt-10">
        </div>
        <SavMachinesForm />
      </div>
    </div>
  );
};

export default Page;
