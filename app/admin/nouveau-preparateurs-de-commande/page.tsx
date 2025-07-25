import { UserAuthFormPicker } from "@/components/auth/user-auth-form-picker";
import BannerTitle from "@/components/reusable/BannerTitle";
import Title from "@/components/reusable/BigTitle";
import Breadcrumb from "@/components/reusable/BreadCrumb";

const Page = () => {
  const breadcrumbPaths = [
    { name: "Accueil", url: "/admin/mon-compte" },
    { name: "Mon compte", url: "/admin/mon-compte" },
    { name: "Ajouter un préparateur de commande", url: "#" },
  ];
  return (
    <div className="min-h-screen flex-col justify-between lg:pt-[70px] pt-[60px]">
      <BannerTitle tile={"Ajouter un préparateur de commande"} paragraph={""} />

      <Breadcrumb paths={breadcrumbPaths} />
      <div className="lg:p-20 p-10 max-w-[1280px] mx-auto">
        <div className="flex justify-center mx-auto">
          <Title>Créer un nouveau préparateur de commande</Title>
        </div>
        <UserAuthFormPicker />
      </div>
    </div>
  );
};

export default Page;
