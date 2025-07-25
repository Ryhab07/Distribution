"use client";
import Breadcrumb from "@/components/reusable/BreadCrumb";
import { PanierTable } from "@/components/reusable/panierTable";
import { useEffect, useState } from "react";
//import HoverButton from "@/components/reusable/HoverButton";
import {
  calculateOverallTotal,
  calculateOverallTotalPreTax,
  //calculateSalesForItem,
  calculateSalesForItem375,
  calculateSalesForItem500,
} from "@/redux/store/cartSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { createOrder } from "@/utils/createOrder";
import { Button } from "@/components/ui/button";
import BannerTitle from "@/components/reusable/BannerTitle";
import CreatorClientDropDown from "@/components/reusable/CreatorClientDropDown";

interface CreateOrderResponse {}

interface ProductToDecrement {
  id: string;
  quantity: number;
}

const Page = () => {
  const [installateur] = useState("");
  const [chantier] = useState("");
  const [userData, setUserData] = useState<[]>([]);
  const [userId, setUserId] = useState("");
  const [selectedValue, setSelectedValue] = useState("");
  const [salesData375, setSalesData375] = useState("");
  const [salesData500, setSalesData500] = useState("");
  //const salesPesantage = sessionStorage.getItem("sales");
  const role = sessionStorage.getItem("role");
  const value = sessionStorage.getItem("value");



  sessionStorage.getItem("");

  const handleValueChange = (newValue) => {
    setSelectedValue(newValue);
    console.log(newValue);
  };

  useEffect(() => {
    // Retrieve userId from sessionStorage after component mounts
    const userIdFromStorage =
      role === "picker"
        ? selectedValue || ""
        : sessionStorage.getItem("id") || "";
    setUserId(userIdFromStorage);
  }, [selectedValue]);

  console.log("role", role);
  console.log("value: " + value);

  // Use useSelector to get the items from the Redux store
  const cartItems = useSelector((state: RootState) => state.cart.items);

  // Calculate the total values using the utility functions
  const totalTTC = calculateOverallTotal(cartItems);
  const totalPreTax = calculateOverallTotalPreTax(cartItems);
  /*const totalSales = cartItems.reduce(
    (total, item) => total + calculateSalesForItem(item),
    0
  );*/

  

  const totalSales = cartItems.reduce((total, item) => {
    if (
      item.name.includes("Kit") &&
      typeof item.kitPuissance === "number" &&
      (typeof salesData375 === "number" ||
       typeof salesData500 === "number" ||
       (typeof salesData375 === "undefined" && typeof salesData500 === "number") ||
       (typeof salesData375 === "number" && typeof salesData500 === "undefined"))
    ) {
      if (
        item.kitPuissance === 375 &&
        typeof salesData375 === "number" &&
        salesData375 > 0
      ) {
        return total + calculateSalesForItem375(item);
      } else if (
        item.kitPuissance === 500 &&
        typeof salesData500 === "number" &&
        salesData500 > 0
      ) {
        return total + calculateSalesForItem500(item);
      } else {
        return total + item.price; // Show item.price if salesData375 or salesData500 are not set or invalid
      }
    } else {
      return total + item.price; // Show item.price for non-Kit items or invalid data
    }
  }, 0);
  

  console.log("totalSales", totalSales);

  const PostDiscount = totalPreTax - totalSales;

  const TVA = (totalSales * 0.2).toFixed(2);

  const handleValiderCommande = async () => {
    try {
      // Check if the cart contains "Coffret AC Personnalisé"
      const hasCoffretACPersonnalise = cartItems.some(
        (item) => item.name === "Coffret AC Personnalisé"
      );

      // Make the server-side API request
      await processCart(cartItems);

      // Create order with the boolean indicating if "Coffret AC Personnalisé" is in the cart
      const response: CreateOrderResponse = await createOrder({
        installateur,
        refChantier: chantier,
        userId: userId,
        composer: hasCoffretACPersonnalise,
        createdBy: sessionStorage.getItem("id") || "",
      });

      console.log("response", response);

      // Redirect or perform any other actions after successful order creation
      console.log("Order created successfully!", response);
      sessionStorage.setItem("valide", "true");
      window.location.href = "/pdf";
    } catch (error) {
      // Handle errors
      console.error("Error creating order:", error.message);
    }
  };

  async function decrementProductStock(products) {
    try {
      const response = await fetch("/api/order/decProductComposantsStock", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(products),
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error decrementing product composants stock:", error);
    }
  }

  const fetchUserData = async () => {
    try {
      const response = await fetch("/api/admin/all-users");
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      const data = await response.json();
      
      const usersWithUserRole = data.users.filter(user => user.role === "user");
      
      setUserData(usersWithUserRole);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserRemise = async () => {
    try {
      const response = await fetch(`/api/admin/user-info/${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      const data = await response.json();
      setSalesData375(data.user.sales375);
      setSalesData500(data.user.sales500);
      
      sessionStorage.setItem("sales", data.user.sales);
      sessionStorage.setItem("sales375", data.user.sales375);
      sessionStorage.setItem("sales500", data.user.sales500);
      role === "picker" &&
        (sessionStorage.setItem("clientName", data.user.name),
        sessionStorage.setItem("clientLastName", data.user.lastname),
        sessionStorage.setItem("clientAdresse", data.user.adresse),
        sessionStorage.setItem("clientEmail", data.user.email),
        sessionStorage.setItem("clientEntreprise", data.user.entreprise));
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchUserRemise();
  }, [userId]);

  async function processCart(
    cart: { id: string; quantity: number; composants?: ProductToDecrement[] }[]
  ) {
    try {
      const productsToDecrement: ProductToDecrement[] = [];

      for (const item of cart) {
        if (item.composants) {
          for (const component of item.composants) {
            productsToDecrement.push({
              id: component.id,
              quantity: component.quantity,
            });
          }
        } else {
          productsToDecrement.push({ id: item.id, quantity: item.quantity });
        }
      }

      // Call the decrementProductStock function with the array of products
      await decrementProductStock(productsToDecrement);
    } catch (error) {
      console.error("Error processing cart:", error);
    }
  }

  const newTTC = (totalSales + parseFloat(TVA)).toFixed(2);

  localStorage.setItem("totalTTC", totalTTC.toFixed(2).toString());
  localStorage.setItem("totalPreTax", totalPreTax.toFixed(2).toString());
  localStorage.setItem("TVA", TVA.toString());
  localStorage.setItem("totalSales", totalSales.toFixed(2).toString());
  localStorage.setItem("PostDiscount", PostDiscount.toFixed(2).toString());
  localStorage.setItem("newTTC", newTTC.toString());

  return (
    <div className="flex-col justify-between lg:pt-[70px] pt-[60px]">
      <BannerTitle tile={"Mon Panier"} paragraph={""} />
      <Breadcrumb
        paths={[
          { name: "Accueil", url: "/" },
          { name: " Panier", url: "#" },
        ]}
      />
      <div className="p-10 max-w-[1280px] mx-auto">
        <div className=" mt-10">
          <PanierTable
            salesData375={salesData375}
            salesData500={salesData500}
          />

          {/*<div className="flex justify-start gap-2">
            <div className="mt-4 mb-4 flex justify-center w-1/2 items-center gap-2 ">
              <Label
                className="text-center text-[13px] font-bold"
                htmlFor="installateur"
              >
                Installateur:
              </Label>
              <Input
                type="text"
                placeholder="John Doe"
                value={installateur}
                onChange={(e) => { setInstallateur(e.target.value); localStorage.setItem("Installateur", e.target.value); }}
                className="border !border-[#DFDFDF] rounded-[10px]"
              />
            </div>

            <div className="mt-4 mb-4 flex justify-center w-1/2 items-center gap-2 ">
              <Label
                className="text-center text-[13px] font-bold"
                htmlFor="chantier"
              >
                Référence Chantier:
              </Label>
              <Input
                type="text"
                placeholder="Mourgues"
                value={chantier}
                onChange={(e) => { setChantier(e.target.value); localStorage.setItem("Chantier", e.target.value); }}



                className="border !border-[#DFDFDF] rounded-[10px]"
              />
            </div>
      </div>*/}

          <div className="flex lg:flex-row flex-col justify-end">
            <div className="p-2 bg-[#B2EAFC] border !border-[#206DA7] rounded-[10px] mt-1 lg:w-[30%] w-full">
              <div className="w-full flex justify-between font-bold text-[12px]">
                <p>Total EUR HT </p>
                <p>{totalPreTax.toFixed(2)} €</p>
              </div>


              <div className="w-full flex justify-between font-bold text-[12px]">
                <p>Total HT après Remise </p>
                <p>{totalSales.toFixed(2)}€</p>
              </div>
              <div className="w-full flex justify-between font-[400] text-[10px]">
                <p>TVA 20% </p>
                <p>{TVA} €</p>
              </div>
              <div className="w-full flex justify-between font-[400] text-[10px]">
                <p>Escompte sur TVA </p>
                <p>0,00 €</p>
              </div>

              <div className="w-full flex justify-between font-bold text-[12px] text-devinovGreen">
                <p>Total EUR TTC </p>
                {/*<p>{totalTTC.toFixed(2)}€</p>*/}
                <p>{newTTC}€</p>
              </div>
            </div>
          </div>

          {/*{role === "picker" && (
            <CreatorClientDropDown userData={userData}/>
          )}*/}

          {role === "picker" && (
            <CreatorClientDropDown
              userData={userData}
              onValueChange={handleValueChange}
            />
          )}

          <div className="flex justify-end mt-4">
            <div className="">
              {/* Conditionally render the button */}
              {cartItems.length > 0 && (
                <Button
                  color="#FAB516"
                  onClick={handleValiderCommande}
                  className="bg-white border-larnaBlue text-larnaBlue border hover:bg-larnaBlue hover:text-white font-bold"
                >
                  Valider la commande
                </Button>
              )}

              {cartItems.length === 0 && (
                <Button
                  disabled
                  className="bg-gray-300 text-gray-500 cursor-not-allowed"
                >
                  Valider la commande
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
