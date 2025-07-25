'use client'
import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/logo/larna-header.png";
import { useEffect, useState } from "react";
import { ChevronRight } from 'lucide-react';

// User interface based on the structure provided
interface User {
  _id: string;
  email: string;
  name: string;
  lastname: string;
  entreprise: string;
  phone: string;
   token: string;
  role: string;
  adresse: string;
  sales: string;
}

const Page = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const usersData = sessionStorage.getItem("users");
    if (usersData) {
      setUsers(JSON.parse(usersData));
    }
  }, []);


  const handleUserClick = (user: User) => {
    console.log("user", user)
    sessionStorage.setItem("token", user.token);
    sessionStorage.setItem("role", user.role);
    sessionStorage.setItem("entreprise", user.entreprise);
    sessionStorage.setItem("name", user.name);
    sessionStorage.setItem("lastname", user.lastname);
    sessionStorage.setItem("phone", user.phone);
    sessionStorage.setItem("email", user.email);
    sessionStorage.setItem("adresse", user.adresse);
    sessionStorage.setItem("id", user._id);
    sessionStorage.setItem("sales", user.sales);
    sessionStorage.setItem("isLoggedIn", "true");

    // Redirect user based on their role
    switch (user.role) {
      case "user":
        window.location.href = "/";
        break;
      case "collaborator":
        window.location.href = "/collaborateur/mon-compte";
        break;
      case "picker":
        window.location.href = "/";
        break;
      case "admin":
        window.location.href = "/admin/mon-compte";
        break;
      default:
        // Handle unknown role
        console.error("Unknown user role:", user.role);
        break;
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-full">
        <div className="flex justify-center items-center pr-4">
          <Link href="/">
            <Image
              className="m-auto lg:w-[350px] h-auto w-[100px] lg:pt-0 pt-10"
              src={logo}
              alt="Logo"
              width={400}
              height={400}
            />
          </Link>
        </div>

        <div className="p-4 mx-auto lg:w-[35%] w-[90%] mt-4">
          {users.map((user) => (
            <div key={user._id} className="cursor-pointer flex justify-between items-center mb-4 p-6  rounded-[30px] border border-devinovGreen" onClick={() => handleUserClick(user)}>
            <div className="flex justify-start items-center">
              <div className="flex items-center justify-center w-[100px] h-[100px] bg-[#B2EAFC] rounded-md text-larnaBlue text-[40px]">
                {user.name[0]}{user.entreprise[0]}
              </div>
              <div className="ml-4">
                <p className="font-bold text-devinovBleu text-[25px]">{user.entreprise}</p>
                <p className=" text-[25px]">
                  {user.name} {user.lastname !== "" ? user.lastname : ""}
                </p>
              </div>
              </div>
              <div>
                <ChevronRight />
                </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;

