"use client";
import React, { useEffect, useState } from "react";
import { getKitsWithPricesAndQuantities } from "@/utils/kitService";



const Home: React.FC = () => {
  const [kits, setKits] = useState<any[]>([]);
  const [kitproducts, setKitProducts] = useState<any[]>([]);
  //const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseKits = await fetch(
          "/api/kits/kitRoutes?type=fixation"
        );
        const responseProducts = await fetch("/api/kits/productRoutes");
        const dataKits = await responseKits.json();
        const dataProducts = await responseProducts.json();
        setKits(dataKits);
        setKitProducts(dataProducts);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  /*const handleAddToCart = (kit: any) => {
    // Calculate the total price for the kit
    const totalPrice = getTotalPriceForKit(kit.quantities, kit?.kit?.composants);
    
    // Dispatch the addToCart action with the kit information
    dispatch(
      addKitToCart({
        kitName: kit.name,
        totalPrice: totalPrice,
        quantity: 1,
      })
    );
  };*/



  /*const handleAddToCart = (kit: any) => {
    // Calculate the total price for the kit
    const totalPrice = getTotalPriceForKit(
      kit.quantities,
      kit?.kit?.composants,
      kit?.kit?.composants.use
    );
    
    // Create an array of composants for the payload
    const composants =
      kit?.kit?.composants?.map((composant: any) => {
        const { quantity, totalPrice } = getComponentQuantityAndPrice(
          kit.quantities,
          composant.cost,
          composant.name,
          composant.use
        );
  
        // Return the composant information along with its quantity
        return {
          id: composant._id,
          name: composant.name,
          quantity: quantity,
          price: composant.cost,
          totalPrice: totalPrice,
          stock: 0,
          image: "",
          desc: "",
          typeStock: "",
          option1: null,
          option2: null,
          sales: 0,
        };
      }) || [];

    // Dispatch the addToCart action with the kit information
    dispatch(
      addKitToCart({
        kitName: kit.name,
        totalPrice: totalPrice,
        quantity: 1,
        composants: composants, // Include the composants in the payload
      })
    );
  };*/

  useEffect(() => {
    const updateKitsWithPricesAndQuantities = async () => {
      if (kits.length > 0 && kitproducts.length > 0) {
        const kitsWithPricesAndQuantities =
          await getKitsWithPricesAndQuantities(kitproducts, kits);
        // Check if kitsWithPricesAndQuantities is an array before mapping
        if (Array.isArray(kitsWithPricesAndQuantities)) {
          // Modify kitsWithPricesAndQuantities to include the 'stock' property
          const updatedKits = kitsWithPricesAndQuantities.map((kit) => ({
            ...kit,
            stock: "available",
          }));
          setKits(updatedKits);
        }
      }
    };

    updateKitsWithPricesAndQuantities();
  }, [kits, kitproducts]);

  // Function to get component quantity and price
  const getComponentQuantityAndPrice = (
    quantities: any,
    cost: number,
    componentName: string,
    use: string
  ) => {
    
    const normalizedComponentName = componentName
      .toLowerCase()
      .replace(/\s/g, ""); 
    const usage = use// Normalize component name
    if (normalizedComponentName === "outildedéconnexion") {
      const matchingKey = Object.keys(quantities).find(
        
        (key) => key.toLowerCase() === "nboutildeconnexion"
      );
      
      if (matchingKey) {
        const quantity = quantities[matchingKey];
        const totalPrice = quantity * cost;
        return { quantity: quantity, totalPrice: totalPrice };
      }
    } else {
      const matchingKey = Object.keys(quantities).find((key) => {
        const normalizedKey = key.toLowerCase().replace(/^nb/, "");
        const normalKey = key
        // Normalize quantity key
        // Check if the normalized component name contains the normalized key or vice versa
        return (

          normalizedKey.includes(normalizedComponentName) || normalKey === usage
        );
      });
      if (matchingKey) {
        const quantity = quantities[matchingKey];
        const totalPrice = quantity * cost;
        return { quantity: quantity, totalPrice: totalPrice };
      }
    }
    
    return { quantity: 0, totalPrice: 0 }; 
  };

  /*onst getTotalPriceForKit = (quantities: any, components: any[], use: string) => {
    let totalPrice = 0;
    components?.forEach((composant) => {
      const normalizedComponentName = composant.name
        .toLowerCase()
        .replace(/\s/g, "");
        const usage = use // Normalize component name
      const matchingKey = Object.keys(quantities).find((key) => {
        const normalizedKey = key.toLowerCase().replace(/^nb/, "");
        const normalKey = key
        // Check if the normalized component name contains the normalized key or vice versa
        return (
          normalizedComponentName.includes(normalizedKey) ||
          normalizedKey.includes(normalizedComponentName) || normalKey === usage
        );
      });
      if (matchingKey) {
        const quantity = quantities[matchingKey];
        totalPrice += quantity * composant.cost;
      }
    });
    return totalPrice;
  };*/

  return (
    <>
    <div>
      <h1>Kits</h1>
      <div>
        {kits.map((kit) => (
          <div key={kit._id} className="mb-10">
            <p>Name: {kit.name}</p>

            <p>Total Price {
          kit?.kit?.composants &&
            kit.kit.composants.reduce((total, composant) => {
            const { totalPrice } = getComponentQuantityAndPrice(
              kit.quantities,
              composant.cost,
              composant.name,
              composant.use
            );
            return total + totalPrice;
          }, 0).toFixed(0) 
        } €</p>

            <p>
              Components:
              <ul className="pl-12">
                {kit?.kit?.composants &&
                  kit.kit.composants.map((composant) => {
                    const { quantity, totalPrice } =
                      getComponentQuantityAndPrice(
                        kit.quantities,
                        composant.cost,
                        composant.name,
                        composant.use
                      );
                    return (
                      <div key={composant._id} className="w-full flex ">
                        <div className="font-[600] mr-6 w-80">{composant.name} </div>
                        <div className="w-20">{quantity}</div>
                        <div className="w-20">{composant.cost} </div>
                        <div>{totalPrice}€</div>
                        
                      </div>
                    );
                  })}
              </ul>
            </p>

            

            <p>Stock: {kit.stock}</p>
            {/*<button onClick={() => handleAddToCart(kit)}>Add to Cart</button>*/}
          </div>
        ))}
      </div>
    </div>

{/*<div className="p-10 lg:max-w-[1280px] w-full mx-auto">
      
      <div >
        <div className="flex lg:justify-start justify-center mt-10 flex-wrap gap-2 lg:gap-3">
            {Array.isArray(kits) &&
              kits.map((user, index) => (
                <ProductCard
                  key={index}
                  id={user._id}
                  name={user.name}
                  price={user.Unit_Price}
                  totalPrice={
                    user.kit &&
                    user.kit.composants &&
                    user.kit.composants.reduce((total, composant) => {
                      const { totalPrice } = getComponentQuantityAndPrice(
                        user.quantities,
                        composant.cost,
                        composant.name,
                        composant.use
                      );
                      return total + totalPrice;
                    }, 0).toFixed(0)
                  }
                  stock={user.InventoryField}
                  typeStock={user.Base_Unit_of_Measure}
                  image={imagesrc}
                  desc={user.Search_Description}

                  type='kit'
                />
              ))}
        </div>
      </div>
    </div>*/}
    </>
  );
};

export default Home;
