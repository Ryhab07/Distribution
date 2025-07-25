import Product, { ProductDocument } from "@/models/product";
import connectDB from "@/lib/db"; // Import your connectDB function

interface Composant {
  product: ProductDocument; // Use the existing ProductDocument type
  quantity: number;
}

export async function calculateComposants(
  brand: string,
  powerKit: string,
  panelPower: string,
  panelsPerInverter: string,
  powerType: string,
  panelOrientation: string
): Promise<Composant[]> {
  // Connect to MongoDB
  await connectDB();

  const composants: Composant[] = [];
  const puissance = parseInt(powerKit);
  const puissancePanneau = parseInt(panelPower);
  const nbPanneaux = puissance / puissancePanneau;
  const nbPanneauxMicroOnduleur = parseInt(panelsPerInverter);

  console.log("brand", brand);
  console.log("powerKit", powerKit);
  console.log("panelPower", panelPower);
  console.log("panelsPerInverter", panelsPerInverter);
  console.log("powerType", powerType);
  console.log("panelOrientation", panelOrientation);

  // Helper function to fetch a product by reference
  const fetchProduct = async (ref: string): Promise<ProductDocument> => {
    console.log(`Fetching product with ref: ${ref}`); // Debug log
    const product = await Product.findOne({ ref });
    if (!product) {
      throw new Error(`Product with reference ${ref} not found`);
    }
    console.log(`Found product: ${product.name}`); // Debug log
    return product;
  };

  // Helper function to fetch cable micro-onduleur with stock check
  const fetchCableMicroOnduleur = async (): Promise<ProductDocument> => {
    const refA3080518 = "A3080518";
    const refA3080511 = "A3080511";

    const productA3080518 = await Product.findOne({ ref: refA3080518 });
    if (!productA3080518 || productA3080518.stock_reel === 0) {
      console.log(`Stock for ${refA3080518} is zero, using ${refA3080511}`);
      return fetchProduct(refA3080511);
    }
    return productA3080518;
  };

  try {
    // Coffret AC
    const coffretACRef =
      powerType === "Monophasé"
        ? brand === "POWERNITY"
          ? "803212631"
          : "793212631"
        : brand === "POWERNITY"
        ? "803212632"
        : "793212632";
    const coffretAC = await fetchProduct(coffretACRef);
    composants.push({ product: coffretAC, quantity: 1 });

    // Passerelle
    let passerelleRef;
    if (brand === "POWERNITY") {
      passerelleRef = "PWP300";
    } else if (brand === "ECOYA" && panelsPerInverter === "1") {
      passerelleRef = "PWP300"; // Use a different reference if needed
    } else {
      passerelleRef = "CD040975";
    }
    const passerelle = await fetchProduct(passerelleRef);
    composants.push({ product: passerelle, quantity: 1 });

    // Panels
    const panneauxRef =
      puissancePanneau === 375
        ? brand === "POWERNITY"
          ? "JKL108B375MH"
          : "1201020258"
        : brand === "POWERNITY"
        ? "JKL132A500MH"
        : "PNGMH66-B8-500";
    const panneaux = await fetchProduct(panneauxRef);
    composants.push({ product: panneaux, quantity: nbPanneaux });

    // Micro-onduleurs
    let microOnduleursRef: string;
    if (puissancePanneau === 375) {
      microOnduleursRef =
        nbPanneauxMicroOnduleur === 1
          ? brand === "POWERNITY"
            ? "PW360"
            : "PW360"
          : brand === "POWERNITY"
          ? "PW1000"
          : "CV011265";
    } else {
      microOnduleursRef =
        nbPanneauxMicroOnduleur === 1
          ? brand === "POWERNITY"
            ? "PW450"
            : "PW450"
          : brand === "POWERNITY"
          ? "PW1000"
          : "CV011515";
    }
    const microOnduleurs = await fetchProduct(microOnduleursRef);
    const microOnduleursQuantity =
      nbPanneauxMicroOnduleur === 1 ? nbPanneaux : nbPanneaux / 2;
    composants.push({
      product: microOnduleurs,
      quantity: microOnduleursQuantity,
    });

    // Rails and Raccords
    const nbRail =
      panelOrientation === "Portrait" ? nbPanneaux : nbPanneaux * 2;
    const rails = await fetchProduct("R59");
    const raccordsRail = await fetchProduct("R59-01");
    composants.push(
      { product: rails, quantity: nbRail },
      { product: raccordsRail, quantity: nbRail - 2 }
    );

    // Fixations
    const fixationsExterieures = await fetchProduct("Cm-2010");
    const fixationsInterieures = await fetchProduct("Cm-2011");
    composants.push(
      { product: fixationsExterieures, quantity: 8 },
      { product: fixationsInterieures, quantity: (nbPanneaux - 2) * 2 }
    );

    // Crochets and Vis
    const nbCrochet = nbRail * 2;
    const crochets = await fetchProduct("RH-304-0059");
    const visBois = await fetchProduct("FA0127");
    composants.push(
      { product: crochets, quantity: nbCrochet },
      { product: visBois, quantity: nbCrochet * 2 }
    );

    // Additional rules for ECOYA
    if (brand === "ECOYA") {
      const visMicroOnduleur = await fetchProduct("MAT01");
 
      if (nbPanneauxMicroOnduleur === 1) {
        const connecteurs = await fetchProduct("CONACEVT");
        const tor = await fetchProduct("2406-4045");
        composants.push(
          { product: visMicroOnduleur, quantity: microOnduleursQuantity },
          { product: tor, quantity: 1 },
          { product: connecteurs, quantity: 2 }
        );
      } else {
        const cableMicroOnduleur = await fetchCableMicroOnduleur();
        const hmsTrunkConnectorT = await fetchProduct("A3080507");
        const hmsSealingCap = await fetchProduct("A3080505");
        const outilDeconnection = await fetchProduct("A3080509");
        const hmsConnector = await fetchProduct("A3080536");
        composants.push(
          { product: visMicroOnduleur, quantity: microOnduleursQuantity },
          { product: cableMicroOnduleur, quantity: microOnduleursQuantity },
          { product: hmsTrunkConnectorT, quantity: microOnduleursQuantity },
          { product: hmsSealingCap, quantity: 2 },
          { product: hmsConnector, quantity: 2 },
          { product: outilDeconnection, quantity: 1 }
        );
      }
    }
    
    

    // Additional rules for POWERNITY
    if (brand === "POWERNITY") {
      console.log("entered");
      const connecteurs = await fetchProduct("CONACEVT");
      const tor = await fetchProduct("2406-4045");

      composants.push(
        { product: connecteurs, quantity: 2 },
        { product: tor, quantity: 1 }
      );
    }



    return composants;
  } catch (error) {
    console.error("Error in calculateComposants:", error);
    throw error; // Re-throw the error to handle it in the calling function
  }
}
