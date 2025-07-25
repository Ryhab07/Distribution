import BannerTitle from "@/components/reusable/BannerTitle";
import Breadcrumb from "@/components/reusable/BreadCrumb";
import ResusableCard from "@/components/reusable/reusableCard";
import savMachine from "@/assets/images/sav-machine.png"
import savPiece from "@/assets/images/sav-pieces.png"
import savListeMachine from "@/assets/images/liste-sav-machine.png"
import savListePiece from "@/assets/images/liste-sav-pieces.png"
import interventionList from "@/assets/images/interventions-list.png"
import interventionForm from "@/assets/images/interventions-form.png"

const Page = () => {
  const breadcrumbPaths = [
    { name: "Accueil", url: "/admin/mon-compte" },
    { name: "SAV", url: "/admin/sav" },
  ];
  return (
    <div className="min-h-screen flex-col justify-between lg:pt-[70px] pt-[60px] ">
      <BannerTitle
        tile={"Portail SAV"}
        paragraph={"Votre clé pour une gestion simplifiée de votre SAV"}
      />
      <Breadcrumb paths={breadcrumbPaths} />
      <div className="lg:p-20 p-10 max-w-[1280px] mx-auto">
        <div className="">
          <div className="lg:flex lg:justify-center lg:gap-10 lg:mx-auto lg:flex-wrap">
          <ResusableCard title ="SAV MACHINE" image={savMachine} active={true} buttonText="Ajouter" redirectTo="/admin/sav/sav-machine"/>
          <ResusableCard title ="SAV PIECES DETACHEES" image={savPiece} active={true} buttonText="Ajouter" redirectTo="/admin/sav/sav-piece"/>
          <ResusableCard title ="INTERVENTIONS" image={interventionForm} active={true} buttonText="Ajouter" redirectTo="/admin/sav/sav-intervention"/>
          </div>
        </div>
        <div className="">
          <div className="lg:flex lg:justify-center lg:gap-10 lg:mx-auto lg:flex-wrap">
          <ResusableCard title ="Liste SAV MACHINE" image={savListeMachine} active={true} buttonText="Consulter" redirectTo="/admin/sav/liste-sav-machine"/>
          <ResusableCard title ="Liste SAV PIECES DETACHEES" image={savListePiece} active={true} buttonText="Consulter" redirectTo="/admin/sav/liste-sav-piece"/>
          <ResusableCard title ="Liste INTERVENTIONS" image={interventionList} active={true} buttonText="Consulter" redirectTo="/admin/sav/liste-intervention"/>      
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
