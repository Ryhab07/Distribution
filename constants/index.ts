
import kitPV from "../assets/images/panneau-solaire-full-black.png"
import Chaudieres from "../assets/icons/chaudieres-image.png"
import pompe from "../assets/icons/pompes-a-chaleur-image.png"
import ventilation from "../assets/icons/ventilation-image.png"
import isolationExterieure from "../assets/icons/isolation-exterieure-image.png"
import isolationInterieure from "../assets/icons/isolation-interieure-image.png"
import touslesproduits from "../assets/images/tous-les-produits.png"
import kitphoto from "../assets/images/onduleurs.png"
import microOnduleur from "../assets/images/kit-panneau-solaire-full-black.png"
import acPersonalise from "../assets/images/coffretacpersonnalise.png"

interface NavbarElement {
  label: string;
  icon: string;
  href: string;
  submenu?: SubmenuElement[];
}

interface SubmenuElement {
  name: string;
  icon: string;
  href: string;
  working: boolean;
  iconState: boolean;
  subcategories?: SubcategoryElement[];
}

interface SubcategoryElement {
  label: string;
  href: string;
  working: boolean;
}

interface CardProps {
  id: string;
  name: string;
  price: number;
  stock: number;
  image: string;
  desc: string;
}

// Navbar Elements
export const NAVBAR_ELEMENTS: NavbarElement[] = [
  {
    label: "Accueil",
    icon: "https://i.ibb.co/qJBJ9k8/eco-house-3326114.png",
    href: "/",
  },
  /*{
    label: "Profil",
    icon: "https://i.ibb.co/qJBJ9k8/eco-house-3326114.png",
    href: "/",
  },*/
  {
    label: "Produits",
    icon: "https://i.ibb.co/mqQJbnT/menu-tous-produits.png",
    href: "/#produits",
    submenu: [
      {
        name: "Personnaliser Kits Photovoltaïque",
        icon: "/produits/le-photovoltaique/kit-pv-personnalise",
        href: "/produits/le-photovoltaique/kit-pv-personnalise",
        working: true,
        iconState: true,
        /*subcategories: [
          {
            label: "Le Photovoltaique",
            href: "/produits/le-photovoltaique",
            working: true,
          },
          {
            label: "CESI",
            href: "/produits/solar-cesi",
            working: false,
          },
          {
            label: "SSC",
            href: "/produits/solar-ssc",
            working: false,
          },
          {
            label: "Chauffe eau solaire individuelle (Cesi)",
            href: "/produits/solar-individuelle-cesi",
            working: false,
          },
        ],*/
      },
      {
        name: "Kits Photovoltaïque Prêt à l'emploi",
        icon: "https://i.ibb.co/nC82CxL/PAC.png",
        href: "/produits/le-photovoltaique/kit-pv",
        working: true,
        iconState: true,
      },
      {
        name: "Personnaliser Coffret AC",
        icon: "https://i.ibb.co/nP7X6ND/Bois-1.png",
        href: "/produits/le-photovoltaique/coffret-ac-personnalise",
        working: true,
        iconState: true,
      },
      {
        name: "Kits de fixation Prêt à l'emploi",
        icon: "https://i.ibb.co/WPKPb28/Gaze.png",
        href: "/produits/le-photovoltaique/kit-de-fixation",
        working: true,
        iconState: true,
      },
      {
        name: "Tous les produits",
        icon: "https://i.ibb.co/GdV8yk3/Fuel.png",
        href: "/produits/le-photovoltaique/tous-les-produits",
        working: true,
        iconState: true,
      },
      {
        name: "Onduleurs / Micro-Onduleur",
        icon: "https://i.ibb.co/GTZgr2z/VMC.png",
        href: "/produits/le-photovoltaique/onduleur-micro-onduleur",
        working: true,
        iconState: true,
      },
      {
        name: "Batteries",
        icon: "https://i.ibb.co/GTZgr2z/VMC.png",
        href: "/produits/le-photovoltaique/batteries",
        working: true,
        iconState: true,
      },
      {
        name: "Pergola",
        icon: "https://i.ibb.co/GTZgr2z/VMC.png",
        href: "/produits/le-photovoltaique/pergola",
        working: true,
        iconState: true,
      },

    ],
  },
  {
    label: "Mon compte",
    icon: "https://i.ibb.co/fG7yXDb/account-12595798.png",
    href: "#",
    submenu: [
      {
        name: "Mon Profil",
        icon: "/path/to/mon-compte-icon.png",
        href: "/mon-compte/profil",
        working: true,
        iconState: false,
      },

      {
        name: "Mes commandes",
        icon: "/path/to/mon-compte-icon.png",
        href: "/mon-compte/mes-bons-de-livraison",
        working: true,
        iconState: false,
      },
    ],
  },
  {
    label: "Panier",
    icon: "https://i.ibb.co/rdPMk6n/panier-vide.png",
    href: "/panier",
  },
] as const;


export const ADMIN_NAVBAR_ELEMENTS: NavbarElement[] = [
  {
    label: "Accueil",
    icon: "https://i.ibb.co/qJBJ9k8/eco-house-3326114.png",
    href: "/admin/mon-compte",
  },
  {
    label: "Clients",
    icon: "https://i.ibb.co/fG7yXDb/account-12595798.png",
    href: "/admin/liste-des-clients",
  },  
  {
    label: "Collaborateur",
    icon: "https://i.ibb.co/fG7yXDb/account-12595798.png",
    href: "/admin/liste-des-collaborateur",
  },  
  {
    label: "Préparateur de commande",
    icon: "https://i.ibb.co/fG7yXDb/account-12595798.png",
    href: "/admin/liste-des-preparateurs-de-commande",
  },  
  
  {
    label: "Mon Profil",
    icon: "https://i.ibb.co/fG7yXDb/account-12595798.png",
    href: "/admin/mon-compte/profil",
  },


] as const;

export const COLLAB_NAVBAR_ELEMENTS: NavbarElement[] = [
  {
    label: "Accueil",
    icon: "https://i.ibb.co/qJBJ9k8/eco-house-3326114.png",
    href: "/collaborateur/mon-compte",
  },
  {
    label: "Mon Profil",
    icon: "https://i.ibb.co/fG7yXDb/account-12595798.png",
    href: "/collaborateur/mon-compte/profil",
  },
  {
    label: "Liste des clients",
    icon: "https://i.ibb.co/fG7yXDb/account-12595798.png",
    href: "/collaborateur/liste-des-clients",
  },  
  {
    label: "Ajouter Client",
    icon: "https://i.ibb.co/fG7yXDb/account-12595798.png",
    href: "/collaborateur/nouveau-client",
  },  

 

] as const;

export const USERPRO_NAVBAR_ELEMENTS: NavbarElement[] = [
  {
    label: "Accueil",
    icon: "https://i.ibb.co/qJBJ9k8/eco-house-3326114.png",
    href: "/user-pro/sav/",
  },

  
 

] as const;

// Category Constants
export const CATEGORIES = {
  SOLAIRE: {
    name: "Solaire",
    icon: "/path/to/solaire-icon.png",
    subcategories: [
      "Solaire Le Photovoltaique",
      "Solaire CESI",
      "Solaire SSC",
      "Solaire Chauffe eau solaire individuelle (Cesi)",
    ],
  },
  PAC: { label: "PAC", icon: "/path/to/pac-icon.png", href: "/pac" },
  BOIS: { label: "BOIS", icon: "/path/to/bois-icon.png", href: "/bois" },
  GAZ: { label: "Gaz", icon: "/path/to/gaz-icon.png", href: "/gaz" },
  FUEL: { label: "Fuel", icon: "/path/to/fuel-icon.png", href: "/fuel" },
  VMC: { label: "VMC", icon: "/path/to/vmc-icon.png", href: "/vmc" },
  IRVE: { label: "IRVE", icon: "/path/to/irve-icon.png", href: "/irve" },
} as const;

// Mon compte Constants
export const MON_COMPTE = {
  name: "Mon compte",
  icon: "/path/to/mon-compte-icon.png",
  subcategories: [
    {
      label: "Mon Profil",
      icon: "/path/to/mon-profil-icon.png",
      href: "/mon-profil",
    },
    {
      label: "Mes Bons de Livraison",
      icon: "/path/to/bons-livraison-icon.png",
      href: "/bons-livraison",
    },
  ],
} as const;

export const products = [
  {
    title: "Le Photovoltaique",
    image: kitPV,
    active: true,
    href: "/produits/le-photovoltaique/",
    subcategories: [
      {
        id: "1",
        label: "Personnaliser Kits Photovoltaïque",
        icon: microOnduleur,
        href: "/produits/le-photovoltaique/kit-pv-personnalise",
        filter: "SOLAIRE",
        buttonText: "Personnaliser",

      },  

      {
        id: "3",
        label: "Personnaliser Coffret AC",
        icon: acPersonalise,
        href: "/produits/le-photovoltaique/coffret-ac-personnalise",
        filter: "None",
        buttonText: "Personnaliser",
      },
      {
        id: "2",
        label: "Kits Photovoltaïque Prêt à l'emploi",
        icon: microOnduleur,
        href: "/produits/le-photovoltaique/kit-pv",
        filter: "SOLAIRE",
        buttonText: "Consulter",

      },
  
      {
        id: "4",
        label: "Kits de fixation Prêt à l'emploi",
        icon: "https://i.ibb.co/hXCdvbC/kit-fixation.png",
        href: "/produits/le-photovoltaique/kit-de-fixation",
        filter: "ACCESSOIRES",
        buttonText: "Consulter",        
      },
      {
        id: "5",
        label: "Tous Les Produits",
        icon: touslesproduits,
        href: "/produits/le-photovoltaique/tous-les-produits",
        filter: "All",
        buttonText: "Consulter",
      }, 
         

    

      {
        id: "6",
        label: "Onduleur / micro onduleur",
        icon: kitphoto,
        href: "/produits/le-photovoltaique/onduleur-micro-onduleur",
        filter: "VMC",
        buttonText: "Consulter",          
      },     
      {
        id: "7",
        label: "Batteries",
        icon: "https://i.ibb.co/tDVDPF8/batterie.png",
        href: "/produits/le-photovoltaique/batteries",
        filter: "None",
        buttonText: "Consulter",        
      },       
      {
        id: "8",
        label: "Pergola",
        icon: "https://i.ibb.co/TvJ4L80/pergola.png",
        href: "/produits/le-photovoltaique/pergola",
        filter: "ISOLATION",
        buttonText: "Consulter",        
      },

    ],
  },
  {
    title: "Chaudières",
    image: Chaudieres,
    active: false,
    href: "/produits/chaudiere/",
  },
  {
    title: "Pompes à chaleur",
    image: pompe,
    active: false,
    href: "/produits/chauffe-eau-electrique/",

  },
  {
    title: "Ventilation",
    image: ventilation,
    active: false,
    href: "/produits/chauffe-eau-solaire/",
  },
  {
    title: "Isolation intérieure",
    image: isolationExterieure,
    active: false,
    href: "/produits/pac-air-air/",    
  },
  {
    title: "Isolation extérieure",
    image: isolationInterieure,
    active: false,
    href: "/produits/pac-air-eau/",        
  }
] as const;

export const infoCards = [
  {
    title: "Tarifs attractifs",
    image: "https://i.ibb.co/zFZ59xM/Tarifs-attractifs.png",
    paragraphe:
      "Nous négocions des tarifs de gros pour vous faire profiter de remises",
  },
  {
    title: "Support de qualité",
    image: "https://i.ibb.co/LtHFn0M/Support-de-qualite.png",
    paragraphe: "Notre équipe vous accompagne dans tous vos projets",
  },
  {
    title: "Préparation Rapide",
    image: "https://i.ibb.co/g3vx0v9/Service-rapide.png",
    paragraphe: "Votre commande est prête pour retrait immédiat.",
  },
  {
    title: "Stock Garanti",
    image: "https://i.ibb.co/9wQvy45/stocks-produits.png",
    paragraphe: "Tous nos produits sont en stock et disponibles rapidement.",
  },
] as const;

export const newInfoCarfs = [
  {
    title: "Tarifs attractifs",
    image: "https://i.ibb.co/VWcNWV4/tarifs-attractifs-1.png",
    paragraphe:
      "Nous négocions des tarifs de gros pour vous faire profiter de remises",
  },
  {
    title: "Support de qualité",
    image: "https://i.ibb.co/xGFT24Q/support-de-qualite-1.png",
    paragraphe: "Notre équipe vous accompagne dans tous vos projets",
  },
  {
    title: "Préparation Rapide",
    image: "https://i.ibb.co/7Xdj5VS/service-rapide-1.png",
    paragraphe: "Votre commande est prête pour retrait immédiat.",
  },
  {
    title: "Stock Garanti",
    image: "https://i.ibb.co/DVYF4tt/stocks-produits-1.png",
    paragraphe: "Tous nos produits sont en stock et disponibles rapidement.",
  },
] as const;

export const Logos = [
  {
    title: "samsung",
    image: "https://i.ibb.co/0sBsrsF/samsung-project.jpg",
    paragraphe:
      "Nous négocions des tarifs de gros pour vous faire profiter de remises",
  },
  {
    title: "de-dietrich",
    image: "https://i.ibb.co/ZVBgKkf/de-dietrich.png",
    paragraphe: "Notre équipe vous accompagne dans tous vos projets",
  },
  {
    title: "ursa",
    image: "https://i.ibb.co/bHXXzyV/ursa.png",
    paragraphe: "Votre commande est prête pour retrait immédiat.",
  },
  {
    title: "daikin",
    image: "https://i.ibb.co/bHXXzyV/ursa.png",
    paragraphe: "Tous nos produits sont en stock et disponibles rapidement.",
  },
  {
    title: "chaffoteaux",
    image: "https://i.ibb.co/RpQW3v1/chaffoteaux.png",
    paragraphe: "Tous nos produits sont en stock et disponibles rapidement.",
  },
  {
    title: "ariston",
    image: "https://i.ibb.co/YhdVfb8/ariston.png",
    paragraphe: "Tous nos produits sont en stock et disponibles rapidement.",
  },
  {
    title: "edilteco",
    image: "https://i.ibb.co/NjypNsj/edilteco.png",
    paragraphe: "Tous nos produits sont en stock et disponibles rapidement.",
  },
] as const;

export const MOBILE_NAVBAR_ELEMENTS: NavbarElement[] = [
  {
    label: "Accueil",
    icon: "https://i.ibb.co/tXT00QY/accueil-icone-blanc.png",
    href: "/",
  },
  {
    label: "Toutes les Catégories",
    icon: "https://i.ibb.co/zbMLXrm/menu-tous-produits-blanc.png",
    href: "#productsContainer",
    submenu: [
      {
        name: "Solaire",
        icon: "https://i.ibb.co/86wvdfy/PV-1.png",
        href: "/solaire",
        working: true,
        iconState: true,
        subcategories: [
          {
            label: "Le Photovoltaique",
            href: "/solar-panel",
            working: true,
          },
          {
            label: "CESI",
            href: "/solar-cesi",
            working: false,
          },
          {
            label: "SSC",
            href: "/solar-ssc",
            working: false,
          },
          {
            label: "Chauffe eau solaire individuelle (Cesi)",
            href: "/solar-individuelle-cesi",
            working: false,
          },
        ],
      },
      {
        name: "PAC",
        icon: "https://i.ibb.co/nC82CxL/PAC.png",
        href: "/pac",
        working: false,
        iconState: true,
      },
      {
        name: "BOIS",
        icon: "https://i.ibb.co/nP7X6ND/Bois-1.png",
        href: "/bois",
        working: false,
        iconState: true,
      },
      {
        name: "Gaz",
        icon: "https://i.ibb.co/WPKPb28/Gaze.png",
        href: "/gaz",
        working: false,
        iconState: true,
      },
      {
        name: "Fuel",
        icon: "https://i.ibb.co/GdV8yk3/Fuel.png",
        href: "/fuel",
        working: false,
        iconState: true,
      },
      {
        name: "VMC",
        icon: "https://i.ibb.co/GTZgr2z/VMC.png",
        href: "/vmc",
        working: false,
        iconState: true,
      },
      {
        name: "IRVE",
        icon: "https://i.ibb.co/27W8R29/IRVE.png",
        href: "/irve",
        working: false,
        iconState: true,
      },
    ],
  },
  {
    label: "Mon Profil",
    icon: "https://i.ibb.co/vH3mBzF/mon-compte-blanc.png",
    href: "/mon-compte/profil",
    submenu: [
      {
        name: "Mon Profil",
        icon: "/path/to/mon-compte-icon.png",
        href: "/mon-profil",
        working: true,
        iconState: false,
      },

      {
        name: "Mes commandes",
        icon: "https://i.ibb.co/vH3mBzF/mon-compte-blanc.png",
        href: "/mon-compte/mes-bons-de-livraison",
        working: false,
        iconState: false,
      },
    ],
  },
  {
    label: "Mes commandes",
    icon: "https://i.ibb.co/vH3mBzF/mon-compte-blanc.png",
    href: "/mon-compte/mes-bons-de-livraison",
  }
] as const;

export const ADMIN_MOBILE_NAVBAR_ELEMENTS: NavbarElement[] = [
  {
    label: "Accueil",
    icon: "https://i.ibb.co/qJBJ9k8/eco-house-3326114.png",
    href: "/admin/mon-compte",
  },
  {
    label: "Clients",
    icon: "https://i.ibb.co/fG7yXDb/account-12595798.png",
    href: "/admin/liste-des-clients",
  },  
  {
    label: "Collaborateur",
    icon: "https://i.ibb.co/fG7yXDb/account-12595798.png",
    href: "/admin/liste-des-collaborateur",
  },  
  {
    label: "Préparateur de commande",
    icon: "https://i.ibb.co/fG7yXDb/account-12595798.png",
    href: "/admin/liste-des-preparateurs-de-commande",
  },   
] as const;

export const USERPRO_MOBILE_NAVBAR_ELEMENTS: NavbarElement[] = [
  {
    label: "Accueil",
    icon: "https://i.ibb.co/qJBJ9k8/eco-house-3326114.png",
    href: "/user-pro/sav/",
  },
  
] as const;



export const mockProducts = [
  {
    id: "1",
    name: "Kit PV 1",
    price: 100,
    stock: 200,
    image: "https://i.ibb.co/2drFYc2/pv.png",
    desc: "KIT 16 PANNEAUX ET 8 MICRO ONDULEURSpour une puissance totale de : 6KW",
  },
  {
    id: "2",
    name: "Kit PV 2",
    price: 100,
    stock: 200,
    image: "https://i.ibb.co/2drFYc2/pv.png",
    desc: "KIT 16 PANNEAUX ET 8 MICRO ONDULEURSpour une puissance totale de : 6KW",
  },
  {
    id: "3",
    name: "Kit PV 3",
    price: 100,
    stock: 200,
    image: "https://i.ibb.co/2drFYc2/pv.png",
    desc: "KIT 16 PANNEAUX ET 8 MICRO ONDULEURSpour une puissance totale de : 6KW",
  },
  {
    id: "4",
    name: "Kit PV 4",
    price: 100,
    stock: 200,
    image: "https://i.ibb.co/2drFYc2/pv.png",
    desc: "KIT 16 PANNEAUX ET 8 MICRO ONDULEURSpour une puissance totale de : 6KW",
  },
  {
    id: "5",
    name: "Kit PV 5",
    price: 100,
    stock: 200,
    image: "https://i.ibb.co/2drFYc2/pv.png",
    desc: "KIT 16 PANNEAUX ET 8 MICRO ONDULEURSpour une puissance totale de : 6KW",
  },
  {
    id: "6",
    name: "Kit PV 6",
    price: 100,
    stock: 200,
    image: "https://i.ibb.co/2drFYc2/pv.png",
    desc: "KIT 16 PANNEAUX ET 8 MICRO ONDULEURSpour une puissance totale de : 6KW",
  },
  {
    id: "7",
    name: "Kit PV 7",
    price: 100,
    stock: 200,
    image: "https://i.ibb.co/2drFYc2/pv.png",
    desc: "KIT 16 PANNEAUX ET 8 MICRO ONDULEURSpour une puissance totale de : 6KW",
  },
  {
    id: "8",
    name: "Kit PV 8",
    price: 100,
    stock: 200,
    image: "https://i.ibb.co/2drFYc2/pv.png",
    desc: "KIT 16 PANNEAUX ET 8 MICRO ONDULEURSpour une puissance totale de : 6KW",
  },
  {
    id: "9",
    name: "Kit PV 9",
    price: 100,
    stock: 200,
    image: "https://i.ibb.co/2drFYc2/pv.png",
    desc: "KIT 16 PANNEAUX ET 8 MICRO ONDULEURSpour une puissance totale de : 6KW",
  },
  {
    id: "10",
    name: "Kit PV 10",
    price: 100,
    stock: 200,
    image: "https://i.ibb.co/2drFYc2/pv.png",
    desc: "KIT 16 PANNEAUX ET 8 MICRO ONDULEURSpour une puissance totale de : 6KW",
  },
  {
    id: "11",
    name: "Kit PV 11",
    price: 100,
    stock: 200,
    image: "https://i.ibb.co/2drFYc2/pv.png",
    desc: "KIT 16 PANNEAUX ET 8 MICRO ONDULEURSpour une puissance totale de : 6KW",
  },
] as CardProps[];


