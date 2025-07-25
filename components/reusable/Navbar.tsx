"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MOBILE_NAVBAR_ELEMENTS, NAVBAR_ELEMENTS } from "@/constants";
import { AlignJustify, ChevronRight } from "lucide-react";
import AuthButton from "./authButton";
import Logo from "./logo";
import AuthButtonMobile from "./authButtonMobile";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { CartItem } from "@/redux/store/cartSlice";
import { Button } from "../ui/button";
import { removeAllItems } from "@/redux/store/cartSlice";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const [hoveredSubcategory, setHoveredSubcategory] = useState<string | null>(
    null
  );
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [mobileNav, setMobileNav] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState(false);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const isLoggedIn = sessionStorage.getItem('isLoggedIn');

  const handleCancelCart = () => {
    dispatch(removeAllItems());
  };

  const handleViewCart = () => {
    router.push("/panier");
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  const valide = typeof window !== 'undefined' ? sessionStorage.getItem("valide") : null;



  return (
    <header>
      <nav className=" fixed border border-b-gray-200 flex  lg:flex-row justify-between items-center w-full p-4 bg-white z-30 py-5">
        <Logo />
        <ul className="hidden h-full gap-12 lg:flex">
          {NAVBAR_ELEMENTS.slice(0, -1).map((link, index) => (
            <div
              key={index}
              className="relative"
              onMouseEnter={() => {
                setActiveSubmenu(link.label);
              }}
            >
              <Link href={link.href} className="flex hover:text-[#255D74]">
                <Image
                  className="mr-2 h-6 w-6"
                  src={link.icon}
                  alt="icon"
                  width={100}
                  height={50}
                />
                {link.label}
              </Link>

              {/* Render submenu if hovered element has submenu */}
              {link.submenu && activeSubmenu === link.label && (
                <div
                  className="submenu-container shadow-md absolute top-full left-0 mt-2 space-y-2 bg-white  border border-gray-300 w-[230px] rounded visible "
                  onMouseLeave={() => setActiveSubmenu(null)}
                >
                  {link.submenu.map((submenuItem, submenuIndex) => (
                    <div
                      key={submenuIndex}
                      className="flex items-center hover:bg-[#D8F1FF] px-4 py-2"
                      onMouseEnter={() =>
                        setHoveredSubcategory(submenuItem.name  === 'Panneaux Photovoltaique' ? 'Le Photovoltaique' : submenuItem.name)
                      }
                      //onMouseLeave={() => setHoveredSubcategory(null)}
                    >
                      <Link
                        href={submenuItem.working ? submenuItem.href : "#"}
                        className={`text-sm flex justify-between w-full items-center ${
                          submenuItem.working
                            ? "text-black "
                            : "text-gray-400 cursor-not-allowed"
                        }
                        }`}
                      >
                        <div className="flex items-center">
                          {submenuItem.iconState && (
                            <Image
                              className="mr-2 h-6 w-6 "
                              src={submenuItem.icon}
                              alt="icon"
                              width={100}
                              height={50}
                              style={{
                                filter: !submenuItem.working
                                  ? "grayscale(100%)"
                                  : "none",
                                opacity: !submenuItem.working ? 0.2 : 1,
                              }}
                            />
                          )}
                          {submenuItem.name}
                        </div>
                        {submenuItem.subcategories && (
                          <div className="ml-auto">
                            <ChevronRight className="text-black w-4 h-4" />
                          </div>
                        )}
                      </Link>

                      {/* Render subcategories if submenu item has subcategories */}
                      {submenuItem.subcategories &&
                        hoveredSubcategory === submenuItem.name && (
                          <ul className="space-y-2  shadow-md w-[300px] absolute top-0 left-full rounded visible bg-white  border border-gray-300">
                            {submenuItem.subcategories.map(
                              (subcategory, subcategoryIndex) => (
                                <li key={subcategoryIndex}>
                                  <Link
                                    href={subcategory.href}
                                    className={`flex items-center hover:bg-[#D8F1FF] px-4 py-2 w-[100%]  ${
                                      subcategory.working
                                        ? "text-black cursor-pointer"
                                        : "text-gray-400 cursor-not-allowed"
                                    }`}
                                  >
                                    <div className="flex items-center">
                                      {subcategory.label  === 'Panneaux photovoltaïques' ? 'Le Photovoltaique' : subcategory.label} 
                                    </div>
                                  </Link>
                                </li>
                              )
                            )}
                          </ul>
                        )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div className="relative">
            {/* Your existing code */}
            <Link
              href="/panier"
              className="flex hover:text-[#255D74]"
              onMouseEnter={() => setIsHovered(true)}
            >
              <Image
                className="mr-2 h-6 w-6"
                src="https://i.ibb.co/rdPMk6n/panier-vide.png"
                alt="icon"
                width={100}
                height={50}
              />
              Panier
            </Link>
            {isHovered && isClient && cartItems.length > 0 && isLoggedIn  &&  (         
              <div
                className="p-2 cursor-pointer submenu-container shadow-md absolute top-full left-0 mt-2 space-y-2 bg-white  border border-gray-300 w-[400px] rounded visible"
                onMouseLeave={() => setIsHovered(false)}
              >
                <div className="overflow-y-auto max-h-80 scrollbar-hide">
                  {Array.isArray(cartItems) &&
                    cartItems.map((item: CartItem) => (
                      <div
                        key={item.id}
                        className="border-b mt-1 border-gray-200 w-full p-2 flex justify-start gap-4 " 
                      >
                        <div className="w-full lg:w-[30%] bg-gray-50 p-2 text-center flex justify-center object-contain">
                          <Image
                            className="mx-auto"
                            src={item.image}
                            alt="image-de-produit"
                            width={50}
                            height={50}
                          />
                        </div>
                        <div className="w-full lg:w-[70%]">
                          <div className="flex justify-between">
                            <h1 className="text-[14px] font-[500]">
                              {item.name}
                            </h1>
                          </div>
                          <div className="text-[12px] text-gray-400">
  <p>{item?.desc?.length > 100 ? item?.desc?.slice(0, 100) + "..." : item.desc}</p>
</div>

                          <div className="text-[14px] text-[#255D74] font-[800]">
                            <p> x {item.quantity}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
                <div className="flex justify-between mb-4">
                  <Button className="bg-[#206DA7]" onClick={handleCancelCart}>
                    {" "}
                    Annuler le Panier
                  </Button>
                  <Button className="bg-[#206DA7]" onClick={handleViewCart}>
                    Voir le Panier
                  </Button>
                </div>
              </div>
            )}

            {isClient && cartItems.length > 0  && valide !== 'true' &&(
              <div className="absolute top-[-9px] left-[12px] flex items-center justify-center rounded-full w-[19px] h-[19px] bg-[#FF0000] text-white font-bold">
                <p className="text-[13px]">{cartItems.length}</p>
              </div>
            )}
          </div>
        </ul>
        <div className="hidden lg:flex">
          <AuthButton />
        </div>
        <div className="lg:hidden flex">
          <AlignJustify
            className="cursor-pointer"
            onClick={() => setMobileNav(!mobileNav)}
          />
        </div>
      </nav>
      {mobileNav === true && (
        <div className="lg:hidden bg-[#255D74] min-h-screen p-4">

          <ul className="h-full gap-12 lg:flex p-4">
            {MOBILE_NAVBAR_ELEMENTS.map((link, index) => (
              <div
                key={index}
                className="relative mb-10 text-white"
                onMouseEnter={() => {
                  setActiveSubmenu(link.label);
                }}
              >
                <Link
                  href={link.href}
                  className="flex"
                  onClick={() => setMobileNav(!mobileNav)}
                >
                  <Image
                    className="mr-2 h-6 w-6"
                    src={link.icon}
                    alt="icon"
                    width={100}
                    height={50}
                  />
                  {link.label}
                </Link>
              </div>
            ))}
          </ul>
          <div className="lg:flex">
            <AuthButtonMobile />
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
