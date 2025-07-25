'use client'
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const SavButtonNewMobile = () => {
  const router = useRouter();
  const [role, setRole] = useState('');

  useEffect(() => {
    const userRole = sessionStorage.getItem('role');
    if (userRole) {
      setRole(userRole);
    } else {
      setRole('');
    }
  }, [router]);

  const handleAuthButtonClick = async () => {
    if (role === 'collaborator') {
      window.location.href = "/collaborateur/sav";
    } else if (role === 'admin') {
      window.location.href = "/admin/sav";
    } else {
      window.location.href = "/sav";
    }
  };
  

  return (
    <Button
      onClick={handleAuthButtonClick}
      variant="loginMobile"
      size="sm"
      className="flex justify-center items-center gap-2 !h-8"
    >
      <Image src="/images/sav-menu.png" alt="Your Image" width={19} height={19} className="h-[19px] w-[19px]" />
      SAV
    </Button>
  );
};

export default SavButtonNewMobile;
