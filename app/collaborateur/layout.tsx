'use client'
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import FooterNew from "@/components/reusable/FooterNew";
import CollabNavBarNew from "@/components/reusable/CollabNavbarNew";


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
    
    if (isLoggedIn !== 'true' || userRole !== 'collaborator') {
      router.push("/connexion");
    } else {
      setLoggedIn(true);
      setRole(userRole || '');
    }
  }, [router]);

  return (
    <>
      <CollabNavBarNew />
      {(loggedIn && role === 'collaborator') && children}
      <FooterNew />
    </>
  );
}
