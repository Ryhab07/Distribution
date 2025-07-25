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
  const [role, setRole] = useState('');

  useEffect(() => {
    
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    const userRole = sessionStorage.getItem('role');
    
    if (isLoggedIn !== 'true' || userRole !== 'picker') {
      router.push("/connexion");
    } else {
      setLoggedIn(true);
      setRole(userRole || '');
    }
  }, [router]);

  return (
    <>
      <NavbarNew />
      {(loggedIn && role === 'picker') && children}
      <FooterNew />
    </>
  );
}
