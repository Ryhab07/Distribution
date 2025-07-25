import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormError } from "../form-error";
import { FormSucess } from "../form-sucess";

export function SalesModifier({
  id,
  sales375,
  sales500,
  role,
}: {
  id: string;
  sales375: number;
  sales500: number;
  role: string;
}) {
  const [remise375, setRemise375] = useState<string>("0");
  const [remise500, setRemise500] = useState<string>("0");
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const userRole = sessionStorage.getItem("role");


  
    const handleClick = (e) => {
      console.log("userRole", userRole);
      e.preventDefault(); // Prevent default form submission
      if (userRole === "collaborator") {
        window.location.href = `/collaborator/liste-des-clients/${id}`;
      } else if (userRole === "admin") {
        window.location.href = `/admin/liste-des-clients/${id}`;
      }
    };

  useEffect(() => {
    if (sales375 != null) {
      setRemise375(sales375.toString());
    }
  }, [sales375]); // This will run every time sales375 changes

  useEffect(() => {
    if (sales500 != null) {
      setRemise500(sales500.toString());
    }
  }, [sales500]);

  console.log("sales375 as string:", sales375);
  console.log("remise375 state:", remise375);
  console.log("sales500 as string:", sales500);
  console.log("remise500 state:", remise500);
  console.log("role", userRole);
  console.log("role2", role);
  console.log("id", id);

  const handleRemiseChange375 = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRemise375(e.target.value);
  };

  const handleRemiseChange500 = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRemise500(e.target.value);
  };

  const handleSubmit = async () => {
    setError("");
    setSuccess("");

    try {
      // Check if user is collaborator and discount is greater than 95%
      /*if (
        userRole !== "collaborator" && userRole !== "picker" &&
        (Number(remise375) > 0.95 || Number(remise500) > 0.95)
      ) {
        setError("Il faut saisir une valeur entre 0 et 0.95");
        return;
      }

      if (
        userRole === "collaborator" || userRole === "picker" &&
        (Number(remise375) > 0.95 || Number(remise500) > 0.95)
      ) {
        setError("Il faut saisir une valeur entre 0 et 0.95");
        return;
      }*/

      // Check if the discount values are greater than 95%
      if (Number(remise375) > 0.95 || Number(remise500) > 0.95) {
        setError("Il faut saisir une valeur entre 0 et 0.95");
        return;
      }

      const response = await fetch("/api/admin/user-info", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          sales375: Number(remise375) || sales375,
          sales500: Number(remise500) || sales500,
        }),
      });

      if (!response.ok) {
        setError("Échec de la mise à jour de la remise");
        throw new Error("Failed to update sales data");
      }

      setSuccess("La remise a été mise à jour avec succès");
      window.location.reload();
      console.log("Sales data updated successfully");
    } catch (error) {
      console.error("Error updating sales data:", error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="normalBleuButton" className="w-full">
          Modifier remise client
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <div className="mt-4">
          <FormError message={error} />
          <FormSucess message={success} />
        </div>
        <DialogHeader>
          <DialogTitle>Modifier remise client</DialogTitle>
          <DialogDescription>
            Personnalisez les remises pour chaque client selon leurs besoins et
            préférences.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="remise375" className="text-right">
              Remise 375
            </Label>
            <Input
              id="remise375"
              className="col-span-3"
              type="number"
              min={0}
              max={userRole === "collaborator" ? 0.95 : 1}
              value={remise375}
              onChange={handleRemiseChange375}
            />
          </div>
        </div>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="remise500" className="text-right">
              Remise 500
            </Label>
            <Input
              id="remise500"
              className="col-span-3"
              type="number"
              min={0}
              max={userRole === "collaborator" ? 0.95 : 1}
              value={remise500}
              onChange={handleRemiseChange500}
            />
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <DialogFooter>
            <Button onClick={handleSubmit}>Modifier</Button>
          </DialogFooter>
                          <Button
                            variant="outline"
                            className=" lg:inline-block px-5 relative rounded group overflow-hidden font-medium bg-transparent text-black border-2 border-black"
                            onClick={handleClick}
                          >
                            <span
                              className={`relative group-hover:text-black flex items-center gap-2`}
                            >
                              Annuler
                            </span>
                          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
