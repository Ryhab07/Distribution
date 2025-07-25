import { calculateComponentQuantitiesPerso } from "@/utils/KitPerso";
import { NextApiRequest, NextApiResponse } from "next";

type Product = {
  _id: string;
  name: string;
  oldname: string;
  stock_reel: number;
  stock: number;
  cost: number;
  use: string;
  image: string;
  ref: string;
  status: string;
};

type ProductWithPrices = Product & {
  quantity: number;
  totalPriceForComponent: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  try {
    // Extract data from the request body
    const {
      NbrePanneaux,
      puissance_panneau,
      puissance_panneau_label,
      micro,
      optionBoitier,
      marque,
      positionPanneauxChoice,
      typeTuilesChoice,
      nbLignes,
      nbPanneauxParLigne,
      quantity,
      microOnduleur,
    } = req.body;

    const panneaux = micro === 350 || micro === 450 ? 1 : 2;

    // Construct the kit object with the extracted data
    const kit = {
      NbrePanneaux,
      puissance_panneau,
      puissance_panneau_label,
      micro,
      microOnduleur,
      optionBoitier,
      marque,
      nb_panneaux_micro_onduleur: panneaux,
      name: `${positionPanneauxChoice} ${typeTuilesChoice}`,
      nbLignes: parseInt(nbLignes),
      nbPanneauxParLigne,
      quantity,
      typeTuilesChoice,
      productA3080518Available: false,
      productCV011522Available: false,
    };

    console.log("kit", kit)

    const puissanceKit = (puissance_panneau * NbrePanneaux) / 1000;

    // Fetch available products from the API
    const productsResponse = await fetch(
       "https://distribution.larna.fr/api/kits/productRoutes"
    );
    if (!productsResponse.ok) {
      throw new Error("Failed to fetch products");
    }
    const products: Product[] = await productsResponse.json();

    // Check if product A3080518 is available in stock
    const productA3080518 = products.find(
      (p) => p.ref.toLowerCase() === "a3080518"
    );
    const productCV011522 = products.find(
      (p) => p.ref === "CV011522"
    );
    console.log("Product A3080518");
    if (productA3080518 && (Number(productA3080518.stock_reel) > 0 && productA3080518.status === "available")) {
      console.log("Product A3080518 is available");
      kit.productA3080518Available = true;
      console.log("Product A3080518 available", kit.productA3080518Available);
    }

    if (productCV011522 && (Number(productCV011522.stock_reel) > 0 && productCV011522.status === "available")) {
      console.log("Product A3080518 is available");
      kit.productCV011522Available = true;
      console.log("Product A3080518 available", kit.productCV011522Available);
    }

    // Calculate component quantities based on the kit
    const componentQuantities = calculateComponentQuantitiesPerso(kit);


    // Construct the response object
    const componentsWithPrices: ProductWithPrices[] = [];
    let totalPrice = 0;

    for (const component in componentQuantities) {
      // Exclude specific properties from the loop
      if (
        component === "nbCrochetsTuileMecanique" ||
        component === "nbCrochetsTuilePlate" ||
        component === "nbCrochetsTuileCanal" ||
        component === "nbCrochetsTuileArdoise" ||
        component === "nbCrochetsTirfons" ||
        component === "nbBacALester"
      ) {
        continue;
      }

      const quantity = componentQuantities[component];
      const product: Product | undefined = products.find((prod: Product) => {
        if (component === "nbCoffretAC") {
          console.log("Entered nbCoffretAC block");
        
          if (prod.use !== component) {
            console.log("marque", marque);
            console.log("prod.use",prod.use);
            console.log("prod.use does not match component");
            return false;
          }
        
          if (marque === "Monophasé") {
            console.log("Marque is Monophasé");
        
            if (microOnduleur.includes("powernity")) {
              console.log("microOnduleur includes powernity");
              return prod.name === "POWERNITY COFFRET AC 3-6KW MONO 32A";
            } else {
              console.log("microOnduleur does NOT include powernity");
              return prod.name === "ECOYA COFFRET AC 3-6KW MONO 32A";
            }
          }
        
          if (marque === "Triphasé") {
            console.log("Marque is Triphasé");
        
            if (prod.oldname === "Coffret AC Triphasé") {
              console.log("prod.oldname is Coffret AC Triphasé");
        
              if (
                micro === 350 ||
                micro === 450 ||
                (micro === 1000 && microOnduleur === "powernity-1000")
              ) {
                console.log("Entered condition for micro === 350, 450, or powernity-1000");
                return prod.ref === "803212638";
              }
        
              if (
                micro === 400 ||
                micro === 700 ||
                micro === 800 ||
                (micro === 1000 && microOnduleur === "hoymiles-1000")
              ) {
                console.log("Entered condition for micro === 400, 700, 800, or hoymiles-1000");
                return prod.ref === "803212632";
              }
            }
          }
        
        
        } else if (component === "nbPanneaux") {
          return (
            prod.use === component &&
            (puissance_panneau === 500 &&
            puissance_panneau_label === "PANNEAU 500WC POWERNITY"
              ? prod.oldname ===
                "POWERNITY PANNEAU PHOTOVOLTAIQUE PANNEAU DE 500WC DIM 2094x1134x30MM"
              : puissance_panneau === 500 &&
                puissance_panneau_label === "PANNEAU 500WC ECOYA"
              ? prod.oldname === "Panneaux de 500 Wc"
              : puissance_panneau === 375 &&
                puissance_panneau_label === "PANNEAU 375WC POWERNITY"
              ? prod.oldname ===
                "POWERNITY PANNEAU PHOTOVOLTAIQUE 375WC DIM 1722x1134x30MM"
              : puissance_panneau === 375 &&
                puissance_panneau_label === "PANNEAU 375WC ECOYA"
              ? prod.oldname === "Panneaux de 375 Wc"
              : puissance_panneau === 425
              ? prod.oldname === "Panneaux de 425 Wc"
              : false)
          );
        } else if (component === "nbCableMicroOnduleurOther") {
          //todo tURN IT TO A3080518 IF NOT THERE TURN IT TO A3080511
          if (puissanceKit <= 4.5) {
            // Check for A3080511
            return prod.ref === "A3080511";
          } else {
            // Check for A3080510
            return prod.ref === "A3080511";
          }
        } else if (component === "nbMicroOnduleur") {
          console.log("entered nbCableMicroOnduleur");

          //hoymiles700

          if (microOnduleur === "powernity-350" && prod.ref === "PW360") {
            console.log("Matched powernity-350 with PW360");
            return true;
          } else if (
            microOnduleur === "powernity-450" &&
            prod.ref === "PW450"
          ) {
            console.log("Matched powernity-450 with PW450");
            return true;
          } else if (
            microOnduleur === "hoymiles-800" &&
            prod.ref === "CV011517"
          ) {
            console.log("Matched hoymiles-800 with CV011517");
            return true;
          }else if (
                microOnduleur === "hoymiles-700" &&
                prod.ref === "CV011265"
              ) {
                console.log("Matched hoymiles-700 with CV011265");
                return true;
          } else if (
            microOnduleur === "hoymiles-1000" &&
            prod.ref === "CV011515"
          ) {
            console.log("Matched hoymiles-1000 with CV011515");
            return true;
          } else if (
            microOnduleur === "hoymiles-400" &&
            prod.ref === "CV011522"
          ) {
            console.log("Matched hoymiles-400 with CV011522");
            return true;
          } else if (
            microOnduleur === "powernity-1000" &&
            prod.ref === "PW1000"
          ) {
            console.log("Matched powernity-1000 with PW1000");
            return true;
          } else {
            prod.ref === "PW1000";
          }
        } else if (component === "nbPasserelle") {
          return (
            prod.use === component &&
            (microOnduleur === "powernity-350" ||
              microOnduleur === "powernity-450"
              ? prod.oldname === "Boitier DTU POWERNITY"
              : microOnduleur === "hoymiles-700"
              ? prod.oldname === "Boitier DTU Pro-S"
              : microOnduleur === "hoymiles-1000"
              ? prod.oldname === "Boitier DTU Pro-S"
              : microOnduleur === "powernity-1000"
              ? prod.oldname === "Boitier DTU POWERNITY"
              : true)
          );
        } else if (component === "nbMicroOnduleurUnpair") {
          return (
            prod.use === component &&
            prod.oldname === "Micro-onduleur 400W HOYMILES"
          );
        } else {
          return prod.use === component;
        }
      });

      if (
        component === "Vis de micro-onduleur" &&
        product?.oldname.includes("powernity")
      ) {
        continue;
      }

      if (product) {
        // Set the name based on the type
        const name = product.name;

        const totalPriceForComponent = quantity * product.cost;

        // Add product details along with the calculated price to the array
        componentsWithPrices.push({
          ...product,
          name,
          quantity,
          totalPriceForComponent,
        });

        // Accumulate the total price
        totalPrice += totalPriceForComponent;
      }
    }

    // Send the response with quantities, prices, and total price
    res.json({ componentsWithPrices, totalPrice });
  } catch (error) {
    // Handle errors
    console.error("Error calculating kit:", error);
    res
      .status(500)
      .json({ error: "An error occurred while calculating the kit." });
  }
}