import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserAuthForm } from "../auth/user-auth-modification-form";

const Mesinfo = () => {
  return (
    <Dialog className="fixed inset-0 flex items-center justify-center z-50">
      <DialogTrigger asChild>
        <Button
          variant={"login"}
          className={`lg:inline-block  relative rounded group overflow-hidden font-medium bg-transparent text-devinovGreen border-devinovGreen w-full` }
        >
          <span
            className={`absolute top-0 left-0 flex w-0 h-full transition-all duration-200 ease-out transform translate-x-0 bg-devinovGreen group-hover:w-full opacity-90`}
          ></span>
          <span
            className={`relative group-hover:text-white flex items-center gap-2`}
          >
            <div className="bg-devinovGreen rounded-full opacity-90 px-2 break-words lg:text-[14px] !text-xs"></div>
            Modifier mes informations personnelles
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[1000px] bg-white overflow-y-auto max-h-[90vh] px-2 break-words ">
        <DialogTitle className="!text-[12px]">Modifier mes informations personnelles</DialogTitle>
        <UserAuthForm />
      </DialogContent>
    </Dialog>
  );
};

export default Mesinfo;
