import BannerTitle from "@/components/reusable/BannerTitle";
import Breadcrumb from "@/components/reusable/BreadCrumb"
import ResusableCard from "@/components/reusable/reusableCard";

const Page = () => {
  const breadcrumbPaths = [
    { name: 'Accueil', url: '/' },
    { name: 'Mon compte', url: '/admin/mon-compte' },
  ];
  return (
    <div className="min-h-screen flex-col justify-between lg:pt-[70px] pt-[60px] max-w-[1280px]">
      <BannerTitle tile = {"Portail collaborateur "} paragraph = {'Votre clé vers une gestion simplifiée de vos clients'} />
      <Breadcrumb paths={breadcrumbPaths} />
      <div className="lg:p-20 p-10">
      <div className="">
    <div className="flex justify-center gap-10 mx-auto flex-wrap">
        <ResusableCard title ="Liste des clients" image={"https://i.ibb.co/hFc6Q8n/liste-clients.png"} active={true} buttonText="Consulter" redirectTo="/admin/liste-des-clients"/>
        <ResusableCard title ="Ajouter un client" image={"https://i.ibb.co/rpdj3Ff/ajouter-client.png"} active={true} buttonText="Ajouter" redirectTo="/admin/nouveau-client"/>
    </div>
    <div className="flex justify-center gap-10 mx-auto flex-wrap">
        

    </div>
</div>

        
      </div>
    </div>
  )
}

export default Page