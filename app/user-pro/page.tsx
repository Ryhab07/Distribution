import BannerTitle from "@/components/reusable/BannerTitle";
import Breadcrumb from "@/components/reusable/BreadCrumb"
import ResusableCard from "@/components/reusable/reusableCard";

const Page = () => {
  const breadcrumbPaths = [
    { name: 'Accueil', url: '/' },
    { name: 'Mon compte', url: '/admin/mon-compte' },
  ];
  return (
    <div className="min-h-screen flex-col justify-between lg:pt-[70px] pt-[60px]">
      <BannerTitle tile = {"Portail Administrateur"} paragraph = {'Votre clé vers une gestion simplifiée de vos clients'} />
      <Breadcrumb paths={breadcrumbPaths} />
      <div className="lg:p-20 p-10">
      <div className="">
    <div className="flex justify-center gap-10 mx-auto flex-wrap">
        <ResusableCard title ="Liste des clients" image={"https://i.ibb.co/hFc6Q8n/liste-clients.png"} active={true} buttonText="Voir les clients" redirectTo="/user-pro/liste-des-clients"/>
        <ResusableCard title ="Liste des collaborateur" image={"https://i.ibb.co/hFc6Q8n/liste-clients.png"} active={true} buttonText="Voir les clients" redirectTo="/user-pro/liste-des-clients"/>
        <ResusableCard title ="Liste des préparateurs de commande" image={"https://i.ibb.co/hFc6Q8n/liste-clients.png"} active={true} buttonText="Voir les clients" redirectTo="/user-pro/liste-des-clients"/>
    </div>
    <div className="flex justify-center gap-10 mx-auto flex-wrap">
        <ResusableCard title ="Ajouter un client" image={"https://i.ibb.co/rpdj3Ff/ajouter-client.png"} active={true} buttonText="Ajouter" redirectTo="/user-pro/nouveau-client"/>
        <ResusableCard title ="Ajouter un collaborateur" image={"https://i.ibb.co/rpdj3Ff/ajouter-client.png"} active={true} buttonText="Ajouter" redirectTo="/user-pro/nouveau-client"/>
        <ResusableCard title ="Ajouter un préparateur de commande" image={"https://i.ibb.co/rpdj3Ff/ajouter-client.png"} active={true} buttonText="Ajouter" redirectTo="/user-pro/nouveau-client"/>
    </div>
</div>

        
      </div>
    </div>
  )
}

export default Page