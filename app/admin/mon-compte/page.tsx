import BannerTitle from "@/components/reusable/BannerTitle";
import Breadcrumb from "@/components/reusable/BreadCrumb"
import ResusableCard from "@/components/reusable/reusableCard";
import SavImafe from "@/assets/images/sav-icon.png"
import ListeProduits from "@/assets/images/liste-produits.png"
import Listecommandes from "@/assets/images/liste-commandes.png"

const Page = () => {
  const breadcrumbPaths = [
    { name: 'Accueil', url: '/admin/mon-compte' },
    { name: 'Mon compte', url: '/admin/mon-compte' },
  ];
  return (
    <div className="min-h-screen flex-col justify-between lg:pt-[70px] pt-[60px] ">
      <BannerTitle tile = {"Portail Administrateur"} paragraph = {'Votre clé vers une gestion simplifiée de vos clients'} />
      <Breadcrumb paths={breadcrumbPaths} />
      <div className="lg:p-20 p-10 max-w-[1280px] mx-auto">
      <div className="">
    <div className="flex justify-center gap-10 mx-auto flex-wrap">
        <ResusableCard title ="Liste des clients" image={"https://i.ibb.co/hFc6Q8n/liste-clients.png"} active={true} buttonText="Consulter" redirectTo="/admin/liste-des-clients"/>
        <ResusableCard title ="Liste des collaborateur" image={"https://i.ibb.co/hFc6Q8n/liste-clients.png"} active={true} buttonText="Consulter" redirectTo="/admin/liste-des-collaborateur"/>
        <ResusableCard title ="Liste des préparateurs de commande" image={"https://i.ibb.co/hFc6Q8n/liste-clients.png"} active={true} buttonText="Consulter" redirectTo="/admin/liste-des-preparateurs-de-commande"/>
        <ResusableCard title ="Liste des clients pro" image={"https://i.ibb.co/hFc6Q8n/liste-clients.png"} active={true} buttonText="Consulter" redirectTo="/admin/liste-des-clients-pro"/>
    </div>
    <div className="flex justify-center gap-10 mx-auto flex-wrap">
        <ResusableCard title ="Ajouter un client" image={"https://i.ibb.co/rpdj3Ff/ajouter-client.png"} active={true} buttonText="Ajouter" redirectTo="/admin/nouveau-client"/>
        <ResusableCard title ="Ajouter un collaborateur" image={"https://i.ibb.co/rpdj3Ff/ajouter-client.png"} active={true} buttonText="Ajouter" redirectTo="/admin/nouveau-collaborateur"/>
        <ResusableCard title ="Ajouter un préparateur de commande" image={"https://i.ibb.co/rpdj3Ff/ajouter-client.png"} active={true} buttonText="Ajouter" redirectTo="/admin/nouveau-preparateurs-de-commande"/>
        <ResusableCard title ="Ajouter un client pro" image={"https://i.ibb.co/rpdj3Ff/ajouter-client.png"} active={true} buttonText="Ajouter" redirectTo="/admin/nouveau-client-pro"/>
    </div>

    <div className="flex justify-center gap-10 mx-auto flex-wrap">
    <ResusableCard title ="Ajouter des kits photovoltaïque" image={ListeProduits} active={true} buttonText="Ajouter" redirectTo="/admin/nouveau-kit-photovoltaique"/>      
    <ResusableCard title ="Liste des commandes" image={Listecommandes} active={true} buttonText="Consulter" redirectTo="/admin/liste-des-commandes"/>        
    <ResusableCard title ="Liste des produits" image={ListeProduits} active={true} buttonText="Consulter" redirectTo="/admin/liste-des-produits"/>  
    {/*<ResusableCard title ="SAV" image={SavImafe} active={true} buttonText="Ajouter / Consulter" redirectTo="/admin/sav"/>*/}
    </div>
    
</div>

        
      </div>
    </div>
  )
}

export default Page