'use client'
//import Navbar from "@/components/reusable/Navbar";
//import Footer from "@/components/reusable/Footer";
import { useEffect, useState } from "react";
import NavbarNew from "@/components/reusable/NavBarNew";
import FooterNew from "@/components/reusable/FooterNew";
import AdminNavbarNew from "@/components/reusable/AdminNavbarNew";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  /**
   * RootLayout component.
   *
   * This component is responsible for rendering the layout of the application.
   * It includes the Navbar component at the top, followed by the children components,
   * and finally the Footer component at the bottom.
   *
   * @param {Object} props - The component props.
   * @param {React.ReactNode} props.children - The children components to be rendered.
   * @returns {React.ReactNode} The rendered RootLayout component.
   */

  /**
   *Composant RootLayout.
    *
    * Ce composant est responsable du rendu de la mise en page de l'application.
    * Il inclut le composant Navbar en haut, suivi des composants enfants,
    * et enfin le composant Footer en bas.
    *
    * @param {Object} props - Les propriétés du composant.
    * @param {React.ReactNode} props.children - Les composants enfants à rendre.
    * @returns {React.ReactNode} Le composant RootLayout rendu.
  */
 
   const [userRole, setUserRole] = useState<string | null>(null);

   useEffect(() => {
     const role = sessionStorage.getItem('role');
     setUserRole(role);
   }, []);

 
  return (
    <>
      {/*{userRole === 'admin' ? <AdminNavbar /> : <Navbar />}*/}
      {userRole === 'admin' ? <AdminNavbarNew /> : <NavbarNew />}
      {children}
      <FooterNew />
    </>
  );
}
