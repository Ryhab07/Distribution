import { Kit, ComponentQuantities } from "@/types/types";
//import { allowedNodeEnvironmentFlags } from "process";

export function calculateComponentQuantities(kit: Kit): ComponentQuantities {
  const {
    puissance,
    puissance_panneau,
    //nb_panneaux_micro_onduleur,
    name 
  } = kit;

  // Check if name is undefined
  if (!name) {
    throw new Error("Kit name is missing.");
  }

  const puissanceFin = puissance ? puissance : 1;

  const nbPanneaux = Math.ceil(puissanceFin / puissance_panneau);
  //TODO: Update nbMicroOnduleur to be always Math.ciel(nbPanneaux /2) ex : 4.5 === 5
  //const nbMicroOnduleur = Math.ceil(nbPanneaux / nb_panneaux_micro_onduleur);
  const nbMicroOnduleur = Math.ceil(nbPanneaux / 2);
  const nbVisMicroOnduleur = nbMicroOnduleur;
    //TODO: Update new product Cable 3m === nbMicroOnduleur intead of nbCableMicroOnduleur && nbCableMicroOnduleur1
  //const nbCableMicroOnduleur = Math.max(0, nbMicroOnduleur - 1);
  const nbCableMicroOnduleur3m = nbMicroOnduleur;
    //TODO nbHmsTrunkConnectorT === Math.max(0, nbMicroOnduleur - 1);
  //const nbHmsTrunkConnectorT = Math.ceil(nbMicroOnduleur / 2);
  const nbHmsTrunkConnectorT = Math.max(0, nbMicroOnduleur - 1);

  const nbMhsSealingCap = Math.ceil(nbPanneaux / 4);
  //const nbRails = name.includes("Portrait") ? nbPanneaux : Math.ceil(nbPanneaux * 1.5);
  //const nbRails = kit.name.includes("Kit Photovoltaïque") ? (name.includes("Portrait") ? nbPanneaux : Math.ceil(nbPanneaux * 1.5)) : 8;
  //const nbRaccordRails = Math.ceil(nbRails / 2);
  //const nbRaccordRails = (kit.name.includes("Kit Photovoltaïque") ? Math.ceil(nbRails / 2) : 4 );

  const nbRails = kit.name.includes("Kit Photovoltaïque") ? (name.includes("Portrait") ? nbPanneaux : Math.ceil(nbPanneaux * 2)) : 8;

console.log("nbRails:", nbRails);
console.log("nbPanneaux", nbPanneaux)
// Determine if nbRails is even or odd
const isPair = name.includes("Portrait")
  ? nbPanneaux % 2 === 0
  : nbRails % 2 === 0;

// Calculate nbRaccordRails based on whether nbRails is even or odd
const nbRaccordRails = isPair ? nbRails - 2 : nbRails - 3;


  //const nbFixationsBlackExterV3 = nbPanneaux >= 4 ? 8 : 4;
  const nbFixationsBlackExterV3 = ( (kit.name.includes("Kit Photovoltaïque") && nbPanneaux >= 4) || kit.name.includes("Kit de fixation")) ? 8 : 4;
  //const nbFixationsBlackInterV3 = Math.ceil(nbPanneaux % 2 === 0 ? (nbPanneaux - 2) * 2 : (nbPanneaux * 2) - 2);
  const nbFixationsBlackInterV3 = (kit.name.includes("Kit Photovoltaïque") ? Math.ceil(nbPanneaux % 2 === 0 ? (nbPanneaux - 2) * 2 : (nbPanneaux * 2) - 2) : 12 );
  const nbCrochetsStandardTMHV3 = Math.ceil(nbRails * 2);
  const nbCoffretAC = 1;
  const nbPasserelle = 1;
  const nbHmsConnector = 1;
  const nbOutilDeDeconnection = 1;
  const nbFinDeRailsBlack = 0;
  const nbVisABois = 0;
  const nbCrochetsTirfons = 16;
  const nbCrochetsTuileMecanique = 16;
  const nbBacALester = 8;
  const nbCrochetsTuilePlate = 16;
  const nbCrochetsTuileCanal = 16;
  const nbCrochetsTuileArdoise = 16;
  const nbCableMicroOnduleur = 0;
  const nbCableMicroOnduleur1 = 0;
  //const nbMiniRails

  console.log(`quantities: {
    nbPanneaux: ${nbPanneaux},
    nbMicroOnduleur: ${nbMicroOnduleur},
    nbVisMicroOnduleur: ${nbVisMicroOnduleur},
    nbCableMicroOnduleur: ${nbCableMicroOnduleur3m},
    nbHmsTrunkConnectorT: ${nbHmsTrunkConnectorT},
    nbMhsSealingCap: ${nbMhsSealingCap},
    nbRails: ${nbRails},
    nbRaccordRails: ${nbRaccordRails},
    nbFixationsBlackExterV3: ${nbFixationsBlackExterV3},
    nbFixationsBlackInterV3: ${nbFixationsBlackInterV3},
    nbCrochetsStandardTMHV3: ${nbCrochetsStandardTMHV3},
    nbCoffretAC: ${nbCoffretAC},
    nbPasserelle: ${nbPasserelle},
    nbHmsConnector: ${nbHmsConnector},
    nbOutilDeDeconnection: ${nbOutilDeDeconnection},
    nbFinDeRailsBlack ${nbFinDeRailsBlack},
    nbVisABois ${nbVisABois},
    nbCrochetsTirfons ${nbCrochetsTirfons},
    nbBacALester ${nbBacALester},
    nbCrochetsTuileMecanique ${nbCrochetsTuileMecanique},
    nbCrochetsTuilePlate ${nbCrochetsTuilePlate},
    nbCrochetsTuileCanal ${nbCrochetsTuileCanal},
    nbCrochetsTuileArdoise ${nbCrochetsTuileArdoise}
  }`)


  return {
    nbPanneaux,
    nbMicroOnduleur,
    nbVisMicroOnduleur,
    nbCableMicroOnduleur1,
    nbCableMicroOnduleur,
    nbCableMicroOnduleur3m,
    nbHmsTrunkConnectorT,
    nbMhsSealingCap,
    nbRails,
    nbRaccordRails,
    nbFixationsBlackExterV3,
    nbFixationsBlackInterV3,
    nbCrochetsStandardTMHV3,
    nbCoffretAC,
    nbPasserelle,
    nbHmsConnector,
    nbOutilDeDeconnection,
    nbFinDeRailsBlack,
    nbVisABois,
    nbCrochetsTirfons,
    nbBacALester,
    nbCrochetsTuileMecanique,
    nbCrochetsTuilePlate,
    nbCrochetsTuileCanal,
    nbCrochetsTuileArdoise,

  };
}




