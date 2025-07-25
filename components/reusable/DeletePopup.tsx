import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useState } from "react";

export function GenericDeleteAlertDialog({ id, type, onDelete }) {
  const [isOpen, setIsOpen] = useState(false);
  console.log("isOpen", isOpen);
  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/${type}/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ _id: id }),
      });

      if (response.ok) {
        const role = sessionStorage.getItem("role");

        if (role === "collaborator") {
          if (type === "intervention") {
            window.location.href = "/collaborateur/sav/liste-intervention";
          } else if (type === "pieces") {
            window.location.href = "/collaborateur/sav/liste-sav-piece";
          } else {
            window.location.href = "/collaborateur/sav/liste-sav-machine";            
          }
        } else if (role === "admin") {
          if (type === "intervention") {
            window.location.href = "/admin/sav/liste-intervention";
          } else if (type === "pieces") {
            window.location.href = "/admin/sav/liste-sav-piece";
          } else {
            window.location.href = "/admin/sav/liste-sav-machine";            
          }
        }
      }

      if (!response.ok) {
        throw new Error("Failed to delete");
      }

      // Optionally, handle success response (e.g., show a success message)
      // Close the dialog after successful deletion
      setIsOpen(false);
      onDelete(); // Trigger a callback function passed from parent component
    } catch (error) {
      console.error("Error deleting:", error);
      // Optionally handle error
    }
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <div className="mt-2 mb-2 flex jsutify-start gap-2 w-full">
          <Button variant={"pieceBtnDelete"}>
            <Trash className="text-red-500 h-4 w-4 mr-2" /> Supprimer
          </Button>
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Êtes-vous certain de vouloir supprimer cette page ?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Cette action est irréversible. Elle effacera vos données de nos
            serveurs.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setIsOpen(false)}>
            Non
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Oui</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
