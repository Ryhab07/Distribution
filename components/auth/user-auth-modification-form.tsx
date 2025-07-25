"use client";
import * as React from "react";

//import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { FormError } from "@/components/form-error";
import { FormSucess } from "../form-sucess";
import { Label } from "@/components/ui/label";
import { DialogClose } from "../ui/dialog";

interface UserModificationAuthFormProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({
  className,
  ...props
}: UserModificationAuthFormProps) {
  const [remise375, setRemise375] = React.useState("");
  const [remise500, setRemise500] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [email2, setEmailSecondaire] = React.useState("");
  const [name, setName] = React.useState("");
  const [entreprise, setEntreprise] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [phoneSecondaire, setPhoneSecondaire] = React.useState("");
  const [adresse, setAdresse] = React.useState("");
  const [role, setRole] = React.useState("");
  const [error, setError] = React.useState<string | undefined>("");
  const [success, setSuccess] = React.useState<string | undefined>("");
  const userRole = sessionStorage.getItem("role");
  const [userData, setUserData] = React.useState<any>(null);
  const [id, setId] = React.useState<string | null>(null);
  const [password, setPassword] = React.useState<string | null>(null);

  React.useEffect(() => {
    const storedId = sessionStorage.getItem("id");
    setId(storedId);
  }, []);

  console.log("error", error);
  console.log("passwords", password);
  console.log("role", userRole);
  console.log("success", success);

  const handleSubmit = async () => {
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/admin/updateInfo", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
          name: name || userData?.name,
          email: email || userData?.email,
          email2: email2 || userData?.email2,
          entreprise: entreprise || userData?.entreprise,
          phone: phone || userData?.phone,
          phoneSecondaire: phoneSecondaire || userData?.phoneSecondaire,
          adresse: adresse || userData?.adresse,
          role: role || userData?.role,
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

  React.useEffect(() => {
    fetchUserData();
  }, []);

  console.log("id Modifier", id);

  const fetchUserData = async () => {
    try {
      const response = await fetch("/api/admin/all-users");
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      const data = await response.json();
      console.log("data", data);
      const filteredUsers = data.users.find((user) => {
        console.log("user._id:", user._id);
        console.log("id:", id);
        return user._id === sessionStorage.getItem("id");
      });

      if (filteredUsers) {
        setUserData(filteredUsers);
        setName(filteredUsers.name + " " + filteredUsers.lastname || "");
        setEmail(filteredUsers.email || "");
        setEmailSecondaire(filteredUsers.email2 || "");
        setEntreprise(filteredUsers.entreprise || "");
        setPhone(filteredUsers.phone || "");
        setPhoneSecondaire(
          filteredUsers.phoneSecondaire !== undefined
            ? filteredUsers.phoneSecondaire
            : "-"
        );
        setAdresse(filteredUsers.adresse || "");
        setRole(filteredUsers.role || "");
        setRemise375(filteredUsers.sales375 || "");
        setRemise500(filteredUsers.sales500 || "");
        setPassword("123456");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  console.log("userData", email);
  console.log("userData", remise500);

  return (
    <div
      className={cn(
        "mt-10 bg-[#FBFBFB] border border-[#DFDFDF] p-4 gap-6",
        className
      )}
      {...props}
    >
      <div className="mb-10">
        <FormError message={error} />
        <FormSucess message={success} />
      </div>

      <div className="grid gap-6 py-4 lg:grid-cols-2  grid-cols-1">
        <div className="items-center  ">
          <Label htmlFor="entreprise" className="text-right">
            Nom d’entreprise
          </Label>
          <Input
            id="entreprise"
            className="col-span-3 mt-2 "
            type="text"
            value={entreprise}
            onChange={(e) => setEntreprise(e.target.value)}
            disabled
          />
        </div>

        <div className="items-center  ">
          <Label htmlFor="name" className="text-right">
            Contact
          </Label>
          <Input
            id="name"
            className="col-span-3 mt-2"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
      </div>
      <div className="grid gap-6 py-4 lg:grid-cols-2  grid-cols-1">
        <div className="items-center  ">
          <Label htmlFor="email" className="text-right">
            Email
          </Label>
          <Input
            id="email"
            className="col-span-3 mt-2"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="items-center  ">
          <Label htmlFor="emailSecondaire" className="text-right">
            Email secondaire
          </Label>
          <Input
            id="emailSecondaire"
            className="col-span-3 mt-2"
            type="email"
            value={email2}
            onChange={(e) => setEmailSecondaire(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-6 py-4 lg:grid-cols-2  grid-cols-1">
        <div className="items-center  ">
          <Label htmlFor="phone" className="text-right">
            Numéro de téléphone
          </Label>
          <Input
  id="phone"
  className="col-span-3 mt-2"
  type="tel"
  value={phone}
  pattern="\d{10}"
  maxLength={10}
  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
/>

        </div>
        <div className="items-center  ">
          <Label htmlFor="phoneSecondaire" className="text-right ">
            Numéro de téléphone portable
          </Label>
          <Input
  id="phoneSecondaire"
  className="col-span-3 mt-2"
  type="tel"
  value={phoneSecondaire}
  pattern="\d{10}"
  maxLength={10}
  onChange={(e) => setPhoneSecondaire(e.target.value.replace(/\D/g, ""))}
/>

        </div>
      </div>
      <div className="grid gap-6 py-4 lg:grid-cols-2  grid-cols-1">
        <div className="items-center  ">
          <Label htmlFor="remise375" className="text-right">
            Prix de vente Kit avec panneaux 375
          </Label>
          <Input
            id="remise375"
            className="col-span-3 mt-2"
            type="text"
            value={remise375}
            onChange={(e) => setRemise375(e.target.value)}
            disabled
          />
        </div>
        <div className="items-center  ">
          <Label htmlFor="remise500" className="text-right">
            Prix de vente Kit avec panneaux 500
          </Label>
          <Input
            id="remise500"
            className="col-span-3 mt-2"
            type="text"
            value={remise500}
            onChange={(e) => setRemise500(e.target.value)}
            disabled
          />
        </div>
      </div>
      <div className="grid gap-6 py-4 lg:grid-cols-2  grid-cols-1">
        <div className="items-center  ">
          <Label htmlFor="adresse" className="text-right">
            Adresse
          </Label>
          <Input
            id="adresse"
            className="col-span-3 mt-2"
            type="text"
            value={adresse}
            onChange={(e) => setAdresse(e.target.value)}
          />
        </div>
        {/*<div className="items-center  ">
              <Label htmlFor="password" className="text-right">
                Password
              </Label>
              <Input
                id="password"
                className="col-span-3 mt-2"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>*/}
      </div>

      {/*<div className="flex lg:justify-end items-end">
        <div className="col-start-2">
          <Button
            onClick={handleSubmit}
            variant={"login"}
            className={`lg:inline-block px-5 relative rounded group overflow-hidden font-medium bg-transparent text-[#fab516]`}
          >
            <span
              className={`absolute top-0 left-0 flex w-0 h-full mr-0 transition-all duration-200 ease-out transform translate-x-0 bg-[#fab516] group-hover:w-full opacity-90`}
            ></span>
            <span
              className={`relative group-hover:text-white flex items-center gap-2`}
            >
              <div className="bg-[#fab516] rounded-full opacity-90">
                <ArrowRight className="text-white w-4 h-4" />
              </div>
              Valider
            </span>
          </Button>
        </div>
      </div>*/}

      <div className="flex justify-center items-center gap-4">
              {/* Valider Button */}
              <Button
                type="submit"
                onClick={handleSubmit}
                variant={"login"}
                className={`lg:inline-block px-5 relative rounded group overflow-hidden font-medium bg-transparent text-[#fab516]`}
              >
                <span
                  className={`absolute top-0 left-0 flex w-0 h-full mr-0 transition-all duration-200 ease-out transform translate-x-0 bg-[#fab516] group-hover:w-full opacity-90`}
                ></span>
                <span
                  className={`relative group-hover:text-white flex items-center gap-2`}
                >
                  Valider
                </span>
              </Button>

              {/* Annuler Button (Closes Modal) */}
              <DialogClose asChild>
                <Button
                  variant="outline"
                  className="lg:inline-block px-5 relative rounded group overflow-hidden font-medium bg-transparent text-black border-2 border-black"
                >
                  <span
                    className={`relative group-hover:text-black flex items-center gap-2`}
                  >
                    Annuler
                  </span>
                </Button>
              </DialogClose>
            </div>
    </div>
  );
}
