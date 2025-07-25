import React from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FaRegEdit } from "react-icons/fa";

const ModificationModal = ({ title, description, children, buttonText, id }) => {
  console.log("Received ID:", id);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-[#3e9f36] text-white w-full lg:w-auto"><FaRegEdit className='text-white h-4 w-4 mr-2'/> {buttonText}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[1000px] h-auto max-h-[calc(100vh-20px)] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 pb-4 mt-[-40px]">
          {React.cloneElement(children, { id })}
        </div>

      </DialogContent>
    </Dialog>
  );
}

export default ModificationModal;
