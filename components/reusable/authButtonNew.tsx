import { useEffect, useState } from "react";
import { request } from "@/utils/apiUtils";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

const AuthButtonNew = () => {
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
      onClick={handleAuthButtonClick}
      variant="newAuth"
      size="sm"
      className="flex justify-center items-center gap-2 !h-8 bg-devinovGreen"
    >
      <User className="h-[19px] w-[19px]" />
      {isLoggedIn ? "Déconnexion" : "Connexion"}
    </Button>
  );
};

export default AuthButtonNew;
