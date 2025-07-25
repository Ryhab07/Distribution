import BannerTitle from "@/components/reusable/BannerTitle";
import Breadcrumb from "@/components/reusable/BreadCrumb";
import ResusableCard from "@/components/reusable/reusableCard";
import SavImafe from "@/assets/images/sav-icon.png"

const Page = () => {
  const breadcrumbPaths = [
    { name: "Accueil", url: "/collaborateur/mon-compte" },
    { name: "Mon compte", url: "/collaborateur/mon-compte" },
  ];
  return (
    <div className="min-h-screen flex-col justify-between lg:pt-[70px] pt-[60px]">
      <BannerTitle
        tile={"Portail collaborateur"}
        paragraph={"Votre clé vers une gestion simplifiée de vos clients"}
      />
      <Breadcrumb paths={breadcrumbPaths} />
      <div className="lg:p-20 p-10 max-w-[1280px] mx-auto">
        <div className="">
          <div className="flex justify-center gap-10 mx-auto flex-wrap">
          <ResusableCard title ="Liste des clients" image={"https://i.ibb.co/hFc6Q8n/liste-clients.png"} active={true} buttonText="Consulter" redirectTo="/collaborateur/liste-des-clients"/>
          <ResusableCard title ="Ajouter un client" image={"https://i.ibb.co/rpdj3Ff/ajouter-client.png"} active={true} buttonText="Ajouter" redirectTo="/collaborateur/nouveau-client"/>
          <ResusableCard title ="SAV" image={SavImafe} active={true} buttonText="Ajouter / Consulter" redirectTo="/collaborateur/sav"/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
