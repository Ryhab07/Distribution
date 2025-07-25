import { Kit, ComponentQuantities } from "@/types/types";
//import { allowedNodeEnvironmentFlags } from "process";

export function calculateComponentQuantitiesPerso(
  kit: Kit
): ComponentQuantities {
  const {
    NbrePanneaux,
    puissance_panneau,
    nb_panneaux_micro_onduleur,
    puissance_panneau_label,
    name,
    nbLignes,
    nbPanneauxParLigne,
    quantity,
    microOnduleur,
    marque,
    typeTuilesChoice,
    productA3080518Available,
    productCV011522Available,
    optionBoitier,
  } = kit;

  const isBacs = typeTuilesChoice === "Bacs acier";
  const isFibro = typeTuilesChoice === "Fibro ciment";
  console.log("nb_panneaux_micro_onduleur", nb_panneaux_micro_onduleur);
  console.log("productA3080518Available", productA3080518Available);
  console.log("productCV011522Available", productCV011522Available)

  const puissanceKit = (puissance_panneau * (NbrePanneaux ?? 0)) / 1000;
  console.log("puissanceKit", puissanceKit)
  console.log("puissance_panneau", puissance_panneau);

  if (NbrePanneaux !== undefined && puissance_panneau === 425) {
    if (NbrePanneaux % 2 === 0) {
      console.log("pair");
    } else {
      console.log("unpair");
    }
  }

  // Check if name is undefined
  if (!name) {
    throw new Error("Kit name is missing.");
  }

  //const newNbPanneauxParLigne = nbPanneauxParLigne ? nbPanneauxParLigne : "2"

  //TODO: CM2010 - CM2011

  const productA3080518 = productA3080518Available;
  console.log("productA3080518", productA3080518);

  const productCV011522 = productCV011522Available
  console.log("productCV011522", productCV011522);


  const pair =
    NbrePanneaux !== undefined &&
    NbrePanneaux % 2 === 0 &&
    puissance_panneau === 425;
  const unpair =
    NbrePanneaux !== undefined &&
    NbrePanneaux % 2 !== 0 &&
    puissance_panneau === 425;

  const case350 =
    microOnduleur === "powernity-350" || microOnduleur === "powernity-350";
  const case450 =
    microOnduleur === "powernity-450" || microOnduleur === "hoymiles-450";
  const case400 =
    microOnduleur === "hoymiles-400" || microOnduleur === "powernity-400";

  const case800 =
    microOnduleur === "hoymiles-800" || microOnduleur === "powernity-800";
  const case1000 =
    microOnduleur === "hoymiles-1000" || microOnduleur === "powernity-1000";

  const case450500 =
    microOnduleur !== "powernity-400" &&
    microOnduleur !== "hoymiles-400" &&
    microOnduleur !== "hoymiles-800" &&
    puissance_panneau_label === "PANNEAU 500WC POWERNITY";

  const nbLignesValue = nbLignes ? nbLignes : 1;
  const nbQuantity = quantity ? quantity : 1;
  const NbrePanneauxcalculated = NbrePanneaux ? NbrePanneaux : 1;

  const nbPanneaux = NbrePanneauxcalculated * nbQuantity;

  //nbCableMicroOnduleur1 used to be {ref:"A3080510"}
  //const nbMicroOnduleur = Math.ceil(nbPanneaux / nb_panneaux_micro_onduleur);
  //TODO: Fix it floor is not taking the inf or the number needed example 4.5 is 4

  const nbMicroOnduleur =
  unpair && !case400 && !case450500 && !case1000
    ? (console.log("Case: unpair && !case400 && !case450500 && !case1000"),
       productCV011522 
         ? Math.ceil((nbPanneaux - 1) / 2) 
         : Math.ceil((nbPanneaux - 1) / 2) + 1)
    : (pair && !case800 && !case1000) || case350 || case450 || case400
    ? (console.log(
        "Case: (pair && !case800 && !case1000) || case350 || case450 || case400"
      ),
      nbPanneaux)
    : pair && (case800 || case1000)
    ? (console.log("Case: pair && (case800 || case1000)"),
      Math.ceil(nbPanneaux / 2))
    : (console.log("Default case"), Math.ceil(nbPanneaux / 2));


  console.log("nbPanneaux:", nbPanneaux);
  console.log("Calculated nbMicroOnduleur:", nbMicroOnduleur);

  const nbMicroOnduleurUnpair =
    unpair && !case400 && !case450500 && productCV011522
      ? (console.log(
          "Entered case: unpair && !case400 && !case450500 for nbMicroOnduleurUnpair"
        ),
        1)
      : (console.log("Entered default case for nbMicroOnduleurUnpair"), 0);

  console.log("nbMicroOnduleurUnpair:", nbMicroOnduleurUnpair);



  //const nbVisMicroOnduleur = nbMicroOnduleur + nbMicroOnduleurUnpair;

  const nbVisMicroOnduleur =
    microOnduleur === "powernity-350" ||
    microOnduleur === "powernity-450" ||
    microOnduleur === "powernity-1000"
      ? 0
      : nbMicroOnduleur + nbMicroOnduleurUnpair;

  /*const nbCableMicroOnduleur =
    microOnduleur === "powernity-350" ||
    microOnduleur === "powernity-450" ||
    microOnduleur === "powernity-700" ||
    microOnduleur === "hoymiles-700"
      ? 0
      : Math.max(0, nbMicroOnduleur - 1);
  const nbCableMicroOnduleur1 =
    microOnduleur === "powernity-350" ||
    microOnduleur === "powernity-450" ||
    microOnduleur === "powernity-700" ||
    microOnduleur === "hoymiles-700"
      ? 0
      : nbCableMicroOnduleur / 2;*/

  const nbCableMicroOnduleur3m = !productA3080518
    ? 0
    : microOnduleur === "powernity-350" ||
      microOnduleur === "powernity-450" ||
      microOnduleur === "powernity-1000"
    ? 0
    : nbMicroOnduleur + nbMicroOnduleurUnpair;

  // 511 idha puissance 5.4 else nhot 518

  /*const nbCableMicroOnduleurOther = (
      productA3080518 === false &&
      (microOnduleur === "powernity-350" || 
       microOnduleur === "powernity-450" || 
       microOnduleur === "powernity-1000") 
        ? 0 
        : (nbMicroOnduleur ?? 0) + (nbMicroOnduleurUnpair ?? 0)
    );*/

  const nbCableMicroOnduleurOther =
    productA3080518 === true ||
    microOnduleur === "powernity-350" ||
    microOnduleur === "powernity-450" ||
    microOnduleur === "powernity-1000"
      ? 0
      : (nbMicroOnduleur ?? 0) + (nbMicroOnduleurUnpair ?? 0);

  /*const nbCableMicroOnduleur803212633 = (
      productA3080518 === false &&
      (microOnduleur === "powernity-350" || 
       microOnduleur === "powernity-450" || 
       microOnduleur === "powernity-1000")
    ) 
      ? 0 
      : (puissanceKit <= 4.5 ? 0 :(NbrePanneaux ?? 0));
    */

  const nbCableMicroOnduleur803212633 = 0;

  const nbConnectMicroOnduleur = microOnduleur?.includes("powernity")
    ? 1 * (nbLignes ?? 0)
    : 0;

  const nbTour = microOnduleur?.includes("powernity")
    ? marque?.includes("Monophasé")
      ? 1
      : 3
    : 0;

  /*const nbHmsTrunkConnectorT =
    microOnduleur === "powernity-350" ||
    microOnduleur === "powernity-450" ||
    microOnduleur === "powernity-700" ||
    microOnduleur === "hoymiles-700"
      ? 0
      : microOnduleur === "hoymiles-1000"
      ? nbCableMicroOnduleur + nbCableMicroOnduleur1
      : Math.ceil(nbMicroOnduleur / 2);*/
  /*const nbHmsTrunkConnectorT = Math.max(0, nbMicroOnduleur - 1);*/
  const nbHmsTrunkConnectorT =
    microOnduleur === "powernity-350" ||
    microOnduleur === "powernity-450" ||
    microOnduleur === "powernity-1000"
      ? 0
      : nbMicroOnduleur + nbMicroOnduleurUnpair;

  /*const nbMhsSealingCap =
    microOnduleur === "powernity-350" ||
    microOnduleur === "powernity-450" ||
    microOnduleur === "powernity-700" ||
    microOnduleur === "hoymiles-700"
      ? 0
      : Math.ceil(nbPanneaux / 4);*/

  /*const nbMhsSealingCap =
    nbPanneauxParLigne && nbPanneauxParLigne.length > 0
      ? parseInt(nbPanneauxParLigne[0].value) * nbQuantity
      : 0;*/

  const nbMhsSealingCap = !(
    microOnduleur === "powernity-350" ||
    microOnduleur === "powernity-450" ||
    microOnduleur === "powernity-1000"
  )
    ? nbLignesValue
    : 0;

  /*const nbRails = name.includes("Portrait")
    ? nbPanneaux
    //: Math.ceil(nbPanneaux * 1.5);
    : Math.ceil(nbPanneaux * 2);*/

  //const nbRaccordRails = Math.ceil(nbRails / 2) * nbQuantity;
  const nbFixationsBlackExterV3 = 4 * nbLignesValue * nbQuantity;
  let nbFixationsBlackInterV3 = 0;

  const results = nbPanneauxParLigne?.map((item) => {
    let nombrePanneauxParLigne = parseInt(item.value, 10) || 0; // Default to 0 if parse fails

    // If nbLignes is 1, set nombrePanneauxParLigne to nbPanneaux
    if (nbLignes === 1) {
      nombrePanneauxParLigne = nbPanneaux;
    }

    // Calculate nbRails for this specific line
    const nbRailsPerLine = name.includes("Portrait")
      ? nombrePanneauxParLigne
      : Math.ceil(nombrePanneauxParLigne * 2);

    const isPair = name.includes("Portrait")
      ? nombrePanneauxParLigne % 2 === 0
      : nbRailsPerLine % 2 === 0;

    return {
      nbRailsPerLine,
      nombrePanneauxParLigne,
      isPair, // true if even, false if odd
      nbRaccordRail:
        nbLignes !== 2 ? (isPair ? nbRailsPerLine - 2 : nbRailsPerLine - 1) : 0, // Added default for when nbLignes === 2
    };
  });

  // Calculate the total of nbRaccordRail
  const totalNbRaccordRail =
    results?.reduce(
      (total, result) => total + (result.nbRaccordRail || 0), // Default to 0 if undefined
      0
    ) ?? 0;

  // Calculate the total of nbRails
  const totalNbRail =
    results?.reduce(
      (total, result) => total + (result.nbRailsPerLine || 0), // Default to 0 if undefined
      0
    ) ?? 0;

  const nbRails = isBacs
    ? 0
    : nbLignesValue > 2
    ? totalNbRail
    : name.includes("Portrait")
    ? nbPanneaux
    : Math.ceil(
        nbPanneaux * 2
        //(puissance_panneau === 375 || puissance_panneau === 425 ? 2 : 1.5)
      );

  const isPair = name.includes("Portrait")
    ? nbPanneaux % 2 === 0
    : nbRails % 2 === 0;

  const nbRaccordRails = isBacs
    ? 0
    : nbLignesValue > 2
    ? totalNbRaccordRail
    : nbLignesValue === 1
    ? Math.ceil(nbRails / 2) * nbQuantity
    : isPair
    ? nbRails - 2
    : nbRails === 1
    ? 0
    : nbRails === 2
    ? 1
    : nbRails - 3;

  // Calculate panels per line based on lines
  const nbPanneauxToUse =
    nbLignes === 2
      ? [Math.ceil(nbPanneaux / 2), Math.floor(nbPanneaux / 2)] // When nbLignes is 2
      : nbPanneauxParLigne;

  console.log("nbPanneauxParLigne", nbLignes);

  const nbminirailsResults = nbPanneauxToUse?.map((item) => {
    // Check if the item is an object (for the case when nbLignes !== 2)
    const nombrePanneauxParLigne =
      typeof item === "object"
        ? parseInt(item.value, 10) // Convert string value to number
        : item; // Use directly if it's a number

    // Calculate nbminirails based on nbLignes
    const nbminirailsPerLine = !isBacs
      ? 0
      : nbLignes === 2
      ? ((NbrePanneaux ?? 0) / 2 + 1) * 2 // Condition for nbLignes === 2
      : (nombrePanneauxParLigne + 1) * 2; // Condition for nbLignes !== 2

    return nbminirailsPerLine; // Return directly
  });

  // Log results before flattening

  // Check if nbminirailsResults is defined and has length greater than 0
  const flattenedResults =
    nbminirailsResults && nbminirailsResults.length > 0
      ? nbminirailsResults // No need to flatten if it's a single-level array
      : [];

  // Calculate the total nbminirails safely
  const nbminirails =
    // only if it's back
    nbLignes !== 1
      ? flattenedResults.reduce((sum, value) => {
          // Log each addition
          return sum + value;
        }, 0)
      : isBacs
      ? (nbPanneaux + 1) * 2
      : 0;

  // Log the final total

  // Log the results

  /*1 => -1 = 0 1.5
  2 => -2 = 0  1.5
  4 => -2 = 2 3
  3 => -1 = 2 3
  1 => -1 = 0*/
  /* 


  5
  1 => 2 rails 2 - 2 = 0 racord
  2 => 2 * 1 = 5 turn it to 6 = 6 - 2 = 4 racord
  4 = > 6 = 6 - 2 = 4racord
  3 = 3 *1.5 = 6 - 2 * 4 racord

  
  // Log the results
  console.log("checking ligne pair or unpair", results);

  //TODO: nbFixationsBlackInterV3 = ((((nbLignes/2) - 1) * 2) * 2) * nbQuantity;
  /*if (nbPanneauxParLigne) {
    if (nbLignes === 1) {
      nbFixationsBlackInterV3 =
        parseInt(nbPanneauxParLigne[0].value) * nbQuantity;
    } else if (nbLignes === 2) {
      nbFixationsBlackInterV3 = (4 - 1) * 2 * 2 * nbQuantity;
    } else {
      nbFixationsBlackInterV3 = nbPanneauxParLigne.reduce((total, item) => {
        const nombrePanneauxParLigne = parseInt(item.value);
        return total + (nombrePanneauxParLigne - 1) * 2 * nbQuantity;
      }, 0);
    }
  }*/

  /*if (nbPanneauxParLigne) {
    if (nbLignes === 1) {
      nbFixationsBlackInterV3 =
        parseInt(nbPanneauxParLigne[0].value) * nbQuantity;
    } else if (nbLignes === 2) {
      nbFixationsBlackInterV3 = (nbLignes / 2 - 1) * 2 * 2 * nbQuantity;
    } else {
      nbFixationsBlackInterV3 = nbPanneauxParLigne.reduce((total, item) => {
        const nombrePanneauxParLigne = parseInt(item.value);
        return total + (nombrePanneauxParLigne - 1) * 2 * nbQuantity;
      }, 0);
    }
  }*/

  if (nbPanneauxParLigne) {
    if (nbLignes === 1) {
      nbFixationsBlackInterV3 = (nbPanneaux - 1) * 2 * nbQuantity;
    } else if (nbLignes === 2) {
      nbFixationsBlackInterV3 = (nbPanneaux - 2) * 2 * nbQuantity;
    } else {
      nbFixationsBlackInterV3 = nbPanneauxParLigne.reduce((total, item) => {
        const nombrePanneauxParLigne = parseInt(item.value);
        return total + (nombrePanneauxParLigne - 1) * 2 * nbQuantity;
      }, 0);
    }
  }

  const nbCrochetsStandardTMHV3 = Math.ceil(nbRails * 2);
  const nbCoffretAC = 1 * nbQuantity;
  const nbPasserelle = Number(optionBoitier) * nbQuantity;

  //TODO: const nbHmsConnector = (microOnduleur === "powernity-350" || microOnduleur === "powernity-450" || microOnduleur === "hoymiles-700" )  ? 0 : triphasé === 3 : monophasé === 2;
  /*const nbHmsConnector =
    microOnduleur === "powernity-350" ||
    microOnduleur === "powernity-450" ||
    microOnduleur === "hoymiles-700"
      ? 0
      : 1 * nbQuantity;*/

  /*const nbHmsConnector =
    microOnduleur === "powernity-350" ||
    microOnduleur === "powernity-450" ||
    //microOnduleur === "hoymiles-700" ||
    microOnduleur === "powernity-1000"
      ? 0
      : marque?.includes("Triphasé")
      ? 3 * nbQuantity
      : 2 * nbQuantity;*/

  const nbHmsConnector =
    microOnduleur === "powernity-350" ||
    microOnduleur === "powernity-450" ||
    //microOnduleur === "hoymiles-700" ||
    microOnduleur === "powernity-1000"
      ? 0
      : nbLignes;

  const nbOutilDeDeconnection =
    microOnduleur === "powernity-350" ||
    microOnduleur === "powernity-450" ||
    //microOnduleur === "hoymiles-700" ||
    microOnduleur === "powernity-1000"
      ? 0
      : 1 * nbQuantity;

  const nbFinDeRailsBlack = 0 * nbQuantity;
  const nbVisABois = 0 * nbQuantity;
  const nbCrochetsTirfons = isBacs ? 0 : 16 * nbQuantity;
  const nbCrochetsTuileMecanique = 16 * nbQuantity;
  const nbBacALester = 8 * nbQuantity;
  const nbCrochetsTuilePlate = 16 * nbQuantity;
  const nbCrochetsTuileCanal = 16 * nbQuantity;
  const nbCrochetsTuileArdoise = 16 * nbQuantity;
  const nbCableMicroOnduleur = 0;
  const nbCableMicroOnduleur1 = 0;

  // crochet * 2
  const nbvISCrochets =
    isFibro || isBacs
      ? 0
      : (nbCrochetsStandardTMHV3 ||
          0 ||
          nbCrochetsTirfons ||
          0 ||
          nbCrochetsTuileMecanique ||
          0 ||
          nbCrochetsTuilePlate ||
          0 ||
          nbCrochetsTuileCanal ||
          0 ||
          nbCrochetsTuileArdoise ||
          0) * 2;

  console.log(`quantities: {
    nbPanneaux: ${nbPanneaux},
    nbMicroOnduleur: ${nbMicroOnduleur},
    nbVisMicroOnduleur: ${nbVisMicroOnduleur},  
    nbMicroOnduleurUnpair ${nbMicroOnduleurUnpair}
    nbCableMicroOnduleur3m: ${nbCableMicroOnduleur3m}
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
    nbCrochetsTuileArdoise ${nbCrochetsTuileArdoise},
    nbminirails ${nbminirails}
    nbCableMicroOnduleurOther ${nbCableMicroOnduleurOther}
    nbCableMicroOnduleur803212633 ${nbCableMicroOnduleur803212633}
    nbConnectMicroOnduleur ${nbConnectMicroOnduleur}
    nbTour ${nbTour}
    nbvISCrochets ${nbvISCrochets}
  }`);

  return {
    nbPanneaux,
    nbMicroOnduleur,
    nbMicroOnduleurUnpair,
    nbVisMicroOnduleur,
    nbCableMicroOnduleur,
    nbCableMicroOnduleur1,
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
    nbvISCrochets,
    nbminirails,
    nbCableMicroOnduleurOther,
    nbCableMicroOnduleur803212633,
    nbConnectMicroOnduleur,
    nbTour,
  };
}
