import { UserAuthLogin } from "@/components/auth/user-auth-login"; //composant perso
import Link from "next/link"; // navigation interne entre les pages
import Image from "next/image"; //image optimisée
import logo from "@/assets/logo/larna-header.png"; 


const page = () => {
  /**
   * Renders a login page with a form for user authentication.
   *
   * @returns {JSX.Element} The rendered login page.
   */

  /**
   * Renders a login page with a form for user authentication.
   *
   * @returns {JSX.Element} The rendered login page.
   */
  
  return (
    <div className="flex items-center justify-center h-screen bg-[#B2EAFC]">
      {/*formulaire d'authentication */}
      <div className="flex flex-col items-center justify-center bg-transparent gap-8">
        {/* Logo */}
        <Link href="/">
          <Image
            className="w-[400px] h-auto"
            src={logo}
            alt="Logo"
            width={500}
            height={400}
          />
        </Link>

        {/* UserAuthLogin */}
        <UserAuthLogin /> {/* composant de connexion */}
      </div>
    </div>
  );
};

export default page;
