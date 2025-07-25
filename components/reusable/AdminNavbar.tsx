"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ADMIN_MOBILE_NAVBAR_ELEMENTS, ADMIN_NAVBAR_ELEMENTS} from "@/constants";
import { AlignJustify, ChevronRight } from "lucide-react";
import AuthButton from "./authButton";
import Logo from "./logo";
import AuthButtonMobile from "./authButtonMobile";
import SavButtonNew from "./savButtonNew";


const AdminNavbar = () => {
  const [hoveredSubcategory, setHoveredSubcategory] = useState<string | null>(
    null
  );
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [mobileNav, setMobileNav] = useState<boolean>(false);



  return (
    <header>
      <nav className="fixed border border-b-gray-200 flex  lg:flex-row justify-between items-center w-full p-4  bg-white z-30 py-5">
        <Logo />
        <ul className="hidden h-full gap-12 lg:flex">
          {ADMIN_NAVBAR_ELEMENTS.map((link, index) => (
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
                        setHoveredSubcategory(submenuItem.name)
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
                                      {subcategory.label}
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


        </ul>
        <div className="hidden lg:flex">
          <SavButtonNew/>
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
            {ADMIN_MOBILE_NAVBAR_ELEMENTS.map((link, index) => (
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

export default AdminNavbar;
