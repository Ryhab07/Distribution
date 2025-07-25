"use client";
import { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { COLLAB_NAVBAR_ELEMENTS} from "@/constants";
import { AlignJustify} from "lucide-react";
import Logo from "./logo";
import AuthButtonMobile from "./authButtonMobile";
import logos from "@/assets/logo/larna-header.png";
import AuthButtonNew from "./authButtonNew";
import mail from "@/assets/images/mail.png";
import location from "@/assets/images/location.png";
import SavButtonNew from "./savButtonNew";
//import SavButtonNewMobile from "./savButtonNewMobile";

const CollabNavBarNew = () => {
  const [mobileNav, setMobileNav] = useState<boolean>(false);

  const [isClient, setIsClient] = useState(false);
  console.log("isClient", isClient);



  useEffect(() => {
    setIsClient(true);
  }, []);



  return (
    <header>
      <div>
        <nav className="relative lg:h-[110px] h-[60px] flex lg:flex-row justify-end items-center w-full  bg-larnaBlue z-10 py-5">
          <div className="lg:mx-w-[1200px] lg:flex flex-row lg:justify-end flex-between w-full">
            <div className="lg:flex hidden items-center justify-end gap-24 mr-24 text-white text-base text-[14px] mt-[-30px]">
              <div className="flex justify-start gap-2 items-center">
                <div className="bg-devinovYellow rounded-full p-2">
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
                <div className="bg-devinovYellow rounded-full p-2 h-10 w-10 items-center">
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
              <SavButtonNew/>
              <AuthButtonNew />

              
              </div>
            </div>

            <div className="lg:hidden flex justify-between w-full px-4">
              <Logo />
              <AlignJustify
                className="cursor-pointer text-white"
                onClick={() => setMobileNav(!mobileNav)}
              />
            </div>
          </div>
        </nav>

        <div className=" hidden relative inset-x-0 mt-[-35px] bg-white  rounded-full max-w-[1280px] h-[80px] mx-auto p-5 z-20 lg:flex justify-center ">
          <Link href="#" className="">
          <Image
              className="object-contain"
              src={logos}
              alt="Logo"
              width={250}
              height={10}
            />
          </Link>
          <nav className="w-[70%] mr-[20px] flex justify-end gap-20 my-auto">
            <div className="flex">
              {COLLAB_NAVBAR_ELEMENTS.map((link, index) => (
                <Fragment key={index}>
                  <div className="relative group">
                    <ul className="list-none items-center max-w-max text-[14px] h-6 px-4 cursor-pointer hover:text-[#fab516]">
                      <a href={link.href} className="flex justify-center items-center">
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
                      <div className="shadow-lg absolute top-full left-0 min-w-[300px] hidden group-hover:block bg-white border border-gray-200 ">
                        {link.submenu.map((subItem, subIndex) => (
                          <Fragment key={subIndex}>
                            <ul className="text-[14px] hover:text-black p-2 pointer-cursor hover:bg-[#fab516] hover:bg-opacity-20 hover:cursor-pointer">
                              <a href={subItem.working ? subItem.href : "#"}>
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


            </div>
          </nav>
        </div>
      </div>

      {mobileNav === true && (
        <div className="lg:hidden bg-[#fab516] min-h-screen p-4 ">
          <ul className="h-full gap-12 lg:flex flex-col p-4">
            {COLLAB_NAVBAR_ELEMENTS.map((link, index) => (
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
          <div className="lg:flex mt-auto mb-4">
            <SavButtonNew/>
          </div>
          <div className="lg:flex mt-auto">
            <AuthButtonMobile />
          </div>

        </div>
      )}
    </header>
  );
};

export default CollabNavBarNew;
