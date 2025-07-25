import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog";
  import { Button } from "@/components/ui/button";

import { UserAuthForm } from "../auth/user-auth-password";

  
  const Password = () => {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant={"login"}
            className={`lg:inline-block  relative rounded group overflow-hidden font-medium bg-transparent text-devinovGreen border-devinovGreen` }
          >
            <span
              className={`absolute top-0 left-0 flex w-0 h-full transition-all duration-200 ease-out transform translate-x-0 bg-devinovGreen group-hover:w-full opacity-90`}
            ></span>
            <span
              className={`relative group-hover:text-white flex items-center gap-2`}
            >

              Modifier mon mot de passe
            </span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[800px]">
          <DialogTitle>Modifier mon mot de passe</DialogTitle>
          <UserAuthForm />
        </DialogContent>
      </Dialog>
    );
  };
  
  export default Password;
  