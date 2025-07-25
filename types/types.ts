export interface Kit {
  puissance?: number;
  puissance_panneau: number;
  nb_panneaux_micro_onduleur: number;
  name: string;
  nbLignes?: number;
  quantity?: number;
  NbrePanneaux?: number;
  nbPanneauxParLigne?: { label: string; value: string }[];
  microOnduleur?: string;
  marque?: string;
  puissance_panneau_label?: string;
  typeTuilesChoice?: string;
  productA3080518Available?: boolean;
  productCV011522Available?: boolean;
  optionBoitier?: string | number;

}

export interface ComponentQuantities {
  nbPanneaux: number;
  nbMicroOnduleur: number;
  nbVisMicroOnduleur: number;
  nbCableMicroOnduleur: number;
  nbCableMicroOnduleur3m: number;
  nbHmsTrunkConnectorT: number;
  nbMhsSealingCap: number;
  nbRails: number;
  nbRaccordRails: number;
  nbFixationsBlackExterV3: number;
  nbFixationsBlackInterV3: number;
  nbCrochetsStandardTMHV3: number;
  nbCoffretAC: number;
  nbPasserelle: number;
  nbHmsConnector: number;
  nbOutilDeDeconnection: number;
  nbFinDeRailsBlack: number;
  nbVisABois: number;
  nbCrochetsTirfons: number;
  nbBacALester: number;
  nbCrochetsTuileMecanique: number;
  nbCrochetsTuilePlate: number;
  nbCrochetsTuileCanal: number;
  nbCrochetsTuileArdoise: number;
  nbCableMicroOnduleur1: number;
  nbMicroOnduleurUnpair?: number;
  nbminirails?: number;
  nbCableMicroOnduleurOther?: number;
  nbCableMicroOnduleur803212633?: number;
  nbConnectMicroOnduleur?: number;
  nbTour?: number;
  nbvISCrochets?: number;
}

// types/Product.ts
export interface Product {
  _id: string;
  name: string;
  stock_reel: number;
  stock: number;
  cost: number;
  use: string;
  image: string;
  ref: string;
  cat: string;
  oldname: string;
  status: "available" | "unavailable";
}

export interface KitWithPriceAndQuantity extends Omit<Kit, "_id"> {
  totalPrice: number;
  quantities: ComponentQuantities;
}
