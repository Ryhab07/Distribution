"use client";
import { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MOBILE_NAVBAR_ELEMENTS, NAVBAR_ELEMENTS } from "@/constants";
import { AlignJustify, ShoppingCart } from "lucide-react";
import Logo from "./logo";
import AuthButtonMobile from "./authButtonMobile";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { CartItem } from "@/redux/store/cartSlice";
import { Button } from "../ui/button";
import { removeAllItems } from "@/redux/store/cartSlice";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import logos from "@/assets/logo/larna-header.png";
import AuthButtonNew from "./authButtonNew";
import mail from "@/assets/images/mail.png";
import location from "@/assets/images/location.png";
//import SavButtonNew from "./savButtonNew";
//import SavButtonNewMobile from "./savButtonNewMobile";

const NavbarNew = () => {
  const [mobileNav, setMobileNav] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState(false);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<string | null>(null);
  /*const id = sessionStorage?.getItem('id');
  const creatorId = cartItems.map(item => item.creatorID);



  console.log("id", id)
  console.log("creatorId", creatorId)*/

  const handleCancelCart = () => {
    dispatch(removeAllItems());
  };

  const handleViewCart = () => {
    router.push("/panier");
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsClient(true);
      setIsLoggedIn(sessionStorage.getItem("isLoggedIn"));
    }
  }, []);

  const valide =
    typeof window !== "undefined" ? sessionStorage.getItem("valide") : null;

  const handleClick = () => {
    window.location.href = "/panier";
  };

  return (
    <header>
      <div>
        <nav className="relative lg:h-[110px] h-[60px] flex lg:flex-row justify-end items-center w-full  bg-larnaBlue z-10 py-5">
          <div className="lg:mx-w-[1200px] lg:flex flex-row lg:justify-end flex-between w-full">
            <div className="lg:flex hidden items-center justify-end gap-24 mr-24 text-white text-base text-[14px] mt-[-30px]">
              <div className="flex justify-start gap-2 items-center">
                <div className="bg-larnaCiel rounded-full p-2">
                  <Image
                    className=""
                    src={mail}
                    alt="email"
                    width={30}
                    height={30}
                  />
                </div>
                <p className="text-[14px]">contact@devinov.com</p>
              </div>
              <div className="flex justify-start gap-2  items-center">
              <div className="bg-larnaCiel rounded-full p-2">
                  <Image
                    className="items-center pl-[4px]"
                    src={location}
                    alt="location"
                    width={30}
                    height={30}
                  />
                </div>
                <p className="text-[14px]">
                  12 rue Paul Langevin 93270 Sevran{" "}
                </p>
              </div>
              <div className="flex justify-between gap-2">
                {/*<SavButtonNew/>*/}
                <AuthButtonNew />
              </div>
            </div>

            <div className="lg:hidden flex justify-between w-full px-4">
              <Logo />
              <div className="flex justify-end gap-4">
                <div
                  onClick={handleClick}
                  style={{ cursor: "pointer" }}
                  className="relative"
                >
                  <ShoppingCart className="text-white h-6 w-6" />
                  {isClient &&
                    cartItems.length > 0 &&
                    valide !== "true" &&
                    isLoggedIn && (
                      <div className="absolute top-[-5px] right-[-5px] flex items-center justify-center rounded-full w-[16px] h-[16px] bg-[#FF0000] text-white font-bold text-[12px]">
                        {cartItems.length}
                      </div>
                    )}
                </div>

                <AlignJustify
                  className="cursor-pointer text-white"
                  onClick={() => setMobileNav(!mobileNav)}
                />
              </div>
            </div>
          </div>
        </nav>

        <div className=" hidden relative inset-x-0 mt-[-35px] bg-white  rounded-full max-w-[1280px] h-[80px] mx-auto p-5 z-20 lg:flex justify-center ">
          <Link href="/" className="">
            <Image
              className=" object-contain"
              src={logos}
              alt="Logo"
              width={250}
              height={10}
            />
          </Link>
          <nav className="w-[70%] mr-[20px] flex justify-end gap-20 my-auto">
            <div className="flex">
              {NAVBAR_ELEMENTS.slice(0, -1).map((link, index) => (
                <Fragment key={index}>
                  <div className="relative group">
                    <ul className="list-none items-center max-w-max text-[14px] h-6 px-4 cursor-pointer hover:text-[#fab516]">
                      <a
                        href={link.href}
                        className="flex justify-center items-center"
                      >
                        {" "}
                        <Image
                          className="mr-2 h-[18px] w-[18px]"
                          src={link.icon}
                          alt="icon"
                          width={100}
                          height={50}
                        />
                        {link.label}
                      </a>
                    </ul>
                    {link.submenu && (
                      <div className="shadow-lg absolute top-full left-0 min-w-[300px] hidden group-hover:block bg-white border border-gray-200  ">
                        {link.submenu.map((subItem, subIndex) => (
                          <Fragment key={subIndex}>
                            <ul
                              className={`${
                                subItem.working === true
                                  ? "text-black hover:text-black hover:bg-[#fab516] hover:cursor-pointer"
                                  : "text-gray-200 !cursor-not-allowed"
                              } text-[14px]  p-2   hover:bg-opacity-20 `}
                            >
                              <a
                                href={subItem.working ? subItem.href : "#"}
                                className={`${
                                  subItem.working === true
                                    ? "cursor-pointer"
                                    : "cursor-not-allowed"
                                }`}
                              >
                                {subItem.name}
                              </a>
                            </ul>
                            {subItem.subcategories && (
                              <div className="shadow-lg absolute top-0 left-[299px] min-w-[300px] hidden group-hover:block bg-white border border-gray-200 ">
                                {subItem.subcategories.map(
                                  (subCat, subIndex) => (
                                    <ul
                                      key={subIndex}
                                      className="text-[14px] hover:text-black p-2 pointer-cursor hover:bg-[#fab516] hover:bg-opacity-20 hover:cursor-pointer"
                                    >
                                      <a href={subCat.href}>{subCat.label}</a>
                                    </ul>
                                  )
                                )}
                              </div>
                            )}
                          </Fragment>
                        ))}
                      </div>
                    )}
                  </div>
                  {/*{index !== NAVBAR_ELEMENTS.length - 2 && (
                    <div className="w-px bg-black mx-2 h-6"></div>
                  )}*/}
                </Fragment>
              ))}

              {/*<div className="w-px bg-black mx-2 h-6"></div>*/}

              <div className="relative">
                <Link
                  href="/panier"
                  className="ml-4 flex text-[14px] hover:text-[#fab516] pointer-cursor   hover:cursor-pointer"
                  onMouseEnter={() => setIsHovered(true)}
                >
                  <Image
                    className="mr-2 h-4 w-4 mt-[2px]"
                    src="https://i.ibb.co/rdPMk6n/panier-vide.png"
                    alt="icon"
                    width={100}
                    height={50}
                  />
                  Panier
                </Link>
                {/*{isHovered && isClient && cartItems.length > 0 && creatorId.includes(id || '') && (*/}
                {isHovered &&
                  isClient &&
                  cartItems.length > 0 &&
                  isLoggedIn && (
                    <div
                      className="left-[-150px] p-2 cursor-pointer submenu-container shadow-md absolute top-full  mt-2 space-y-2 bg-white  border border-gray-300 w-[400px] rounded visible"
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
                                  className="mx-auto object-contain"
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
                                {item?.desc?.length && (
                                  <div className="text-[12px] text-gray-400">
                                    <p>
                                      {item?.desc?.length > 100
                                        ? item?.desc?.slice(0, 100) + "..."
                                        : item.desc}
                                    </p>
                                  </div>
                                )}

                                <div className="text-[14px] text-[#255D74] font-[800]">
                                  <p> x {item.quantity}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                      <div className="flex justify-between mb-4">
                        <Button
                          className="bg-[#255D74]"
                          onClick={handleCancelCart}
                        >
                          {" "}
                          Annuler le Panier
                        </Button>
                        <Button
                          className="bg-[#fab516]"
                          onClick={handleViewCart}
                        >
                          Voir le Panier
                        </Button>
                      </div>
                    </div>
                  )}

                {isClient &&
                  cartItems.length > 0 &&
                  valide !== "true" &&
                  isLoggedIn && (
                    <div className="absolute top-[-9px] left-[12px] flex items-center justify-center rounded-full w-[16px] h-[16px] bg-[#FF0000] text-white font-bold text-[12px]">
                      <p className="text-[13px]">{cartItems.length}</p>
                    </div>
                  )}
              </div>
            </div>
          </nav>
        </div>
      </div>

      {mobileNav === true && (
        <div className="lg:hidden bg-[#fab516] min-h-screen p-4 ">
          <ul className="h-full gap-12 lg:flex flex-col p-4">
            {MOBILE_NAVBAR_ELEMENTS.map((link, index) => (
              <li key={index} className="relative mb-10 text-white">
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
              </li>
            ))}
          </ul>
          {/*<div className="lg:flex mt-auto mb-4">
            <SavButtonNew />
          </div>*/}
          <div className="lg:flex mt-auto">
            <AuthButtonMobile />
          </div>
        </div>
      )}
    </header>
  );
};

export default NavbarNew;
