'use client'
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminNavbarNew from "@/components/reusable/AdminNavbarNew";
import FooterNew from "@/components/reusable/FooterNew";


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
    
    if (isLoggedIn !== 'true' || userRole !== 'admin') {
      router.push("/connexion");
    } else {
      setLoggedIn(true);
      setRole(userRole || '');
    }
  }, [router]);

  return (
    <>
      <AdminNavbarNew />
      {(loggedIn && role === 'admin') && children}
      <FooterNew />
    </>
  );
}
