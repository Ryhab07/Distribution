import { useEffect, useState } from "react";
import { request } from "@/utils/apiUtils";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import login from "@/assets/icons/login.png";
import loginHover from "@/assets/icons/login-hover.png";
import logout from "@/assets/icons/logout.png";

const AuthButton = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isMouseOver, setIsMouseOver] = useState<boolean>(false);

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
    !isLoggedIn ? window.location.href = "/connexion" : handleLogout();
  }

  return (
    <Button
      variant={isLoggedIn ? "logout" : "login"}
      size="xsm"
      onClick={handleAuthButtonClick}
      onMouseEnter={() => setIsMouseOver(true)}
      onMouseLeave={() => setIsMouseOver(false)}
    >
      {isLoggedIn ? (
        <Image
          className="mr-2 h-6 w-6"
          src={isMouseOver ? loginHover : logout}
          alt="logout"
          width={100}
          height={50}
        />
      ) : (
        <Image
          className="mr-2 h-6 w-6"
          src={isMouseOver ? loginHover : login}
          alt="login"
          width={100}
          height={50}
        />
      )}

      {isLoggedIn ? "Déconnexion" : "Connexion"}
    </Button>
  );
};

export default AuthButton;
