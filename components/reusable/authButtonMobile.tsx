import { useState, useEffect } from "react";
import { request } from "@/utils/apiUtils";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import login from "@/assets/icons/login.png";
import logout from "@/assets/icons/logout.png";

const AuthButtonMobile = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    // Retrieve the value from sessionStorage
    const session = sessionStorage.getItem("isLoggedIn");

    // Set isLoggedIn as a boolean
    session === "true"
      ? setIsLoggedIn(session === "true")
      : setIsLoggedIn(session === "false");
  }, []);

  const handleLogout = async () => {
    try {
      // Send a request to the logout endpoint
      const endpoint = "auth/logout";
      const customRedirect = "/connexion";
      const result = await request(
        endpoint,
        { method: "POST" },
        customRedirect
      );

      // Clear cookies
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
      });

      // Clear session storage
      sessionStorage.clear();

      // Handle redirection if needed
      if (result.redirectTo) {
        // Use window.location.href for redirection
        window.location.href = result.redirectTo;
      }

      // Update the login status in the component state
      setIsLoggedIn(false);
    } catch (error) {
      console.error("Error during logout:", error.message);
    }
  };

  const handleAuthButtonClick = async () => {
    !isLoggedIn ? (window.location.href = "/connexion") : handleLogout();
  };

  return (
    <Button
      variant={isLoggedIn === true ? "logoutMobile" : "loginMobile"}
      size="xsm"
      onClick={handleAuthButtonClick}
    >
      {isLoggedIn === true ? (
        <Image
          className="mr-2 h-6 w-6"
          src={logout}
          alt="logout"
          width={100}
          height={50}
        />
      ) : (
        <Image
          className="mr-2 h-6 w-6"
          src={login}
          alt="login"
          width={100}
          height={50}
        />
      )}

      {isLoggedIn === true ? "Déconnexion" : "Connexion"}
    </Button>
  );
};

export default AuthButtonMobile;
