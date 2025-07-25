
import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/logo/Logo-Larna.png";
import { PasswordRecover } from "@/components/auth/user-auth-form-password-recovery"; //composant perso


const page = () => {

  /**
   * Renders a login page with a form for user authentication.
   *
   * @returns {JSX.Element} The rendered password recovery page.
   */
  
  return (
    <div className="flex items-center justify-center h-screen ">
      <div className="lg:w-[1000px] w-[90%] flex  lg:p-4 gap-8 lg:flex-row flex-col bg-[#F0F0F0] h-[300px] rounded-[30px]">
        <div className="lg:w-[50%]  flex justify-center items-center pr-4">
          <Link href="/">
            <Image
              className="m-auto lg:w-[400px] h-auto w-[200px] lg:pt-0 pt-10 "
              src={logo}
              alt="Logo"
              width={400}
              height={400}
            />
          </Link>
        </div>
        <div className="lg:w-[50%] w-full z-40">

          <PasswordRecover className="" />
        </div>
      </div>
    </div>
  );
};

export default page;
