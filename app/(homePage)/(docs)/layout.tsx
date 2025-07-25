'use client'
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import FooterNew from "@/components/reusable/FooterNew";
import NavbarNew from "@/components/reusable/NavBarNew";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    // Check if running on the client side before using client-specific code
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    
    if (isLoggedIn !== 'true') {
      router.push("/connexion");
    } else {
      setLoggedIn(true);
    }
  }, [router]);

  return (
    <>
      <NavbarNew />
      <section className="min-h-screen">
        {loggedIn && children}
      </section>
      <FooterNew />
    </>
  );
}
