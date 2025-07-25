import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
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

export function InfoModifierWorker(id, type) {
  const [remise375, setRemise375] = useState("");
  const [remise500, setRemise500] = useState("");
  const [email, setEmail] = useState("");
  const [email2, setEmailSecondaire] = useState("");
  const [name, setName] = useState("");
  const [entreprise, setEntreprise] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneSecondaire, setPhoneSecondaire] = useState("");
  const [adresse, setAdresse] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const userRole = sessionStorage.getItem("role");
  const [userData, setUserData] = useState<any>(null);
  const [emailError, setEmailError] = useState<string | undefined>("");
  //const [emailError2, setEmailError2] = useState<string | undefined>("");
  const [phoneError, setPhoneError] = useState<string | undefined>("");
  const [phoneErrorSecondaire, setPhoneErrorSecondaire] = useState<
    string | undefined
  >("");

  console.log("role", userRole);
  console.log("remise375", remise375);
  console.log("remise500", remise500);
  console.log("type", type);

  // Handle phone number changes with validation
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ""); // Remove non-digit characters
    if (value.length > 10) {
      value = value.slice(0, 10); // Restrict value to 10 digits
    }

    setPhone(value); // Update the phone state
    if (value.length !== 10) {
      setPhoneError(
        "Le numéro de téléphone doit contenir uniquement 10 chiffres."
      );
    } else {
      setPhoneError(""); // Clear error when the phone number has exactly 10 digits
    }
  };

  // Handle secondary phone number changes with validation
  const handlePhoneSecondaireChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    if (/^\d{0,9}$/.test(value)) {
      setPhoneSecondaire(value);
    }
    if (value.length !== 10) {
      setPhoneErrorSecondaire(
        "Le numéro de téléphone secondaire doit comporter exactement 10 chiffres"
      );
    } else {
      setPhoneErrorSecondaire("");
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const emailValue = e.target.value;
    setEmail(emailValue);

    // Check if the email contains '@'
    if (!emailValue.includes("@")) {
      setEmailError("Veuillez entrer une adresse e-mail valide avec '@'");
    } else {
      setEmailError("");
    }
  };

  {
    /*const handleEmail2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const emailValue = e.target.value;
    setEmailSecondaire(emailValue);
    console.log("email secondaire changed", email2);
    // Check if the email contains '@'
    if (!emailValue.includes("@")) {
      console.log("entered email");
      setEmailError2("Veuillez entrer une adresse e-mail valide avec '@'");
      console.log("error0", emailError2);
    } else {
      setEmailError2("");
    }
  };*/
  }

  const handleSubmit = async () => {
    setError("");
    setSuccess("");
  
    const fullName = name !== undefined ? name : `${userData?.name} ${userData?.lastname}`;

    let firstName = '';
    let lastname = '';
  
    if (fullName) {
      const nameParts = fullName.trim().split(' '); // Split by spaces
      if (nameParts.length === 3) {
        firstName = `${nameParts[0]} ${nameParts[1]}`; // First two words as name
        lastname = nameParts[2]; // Last word as last name
      } else if (nameParts.length === 2) {
        firstName = nameParts[0]; // First word as name
        lastname = nameParts[1]; // Second word as last name
      } else {
        firstName = fullName; // Only one word as first name
        lastname = ''; // No last name
      }
    }
  
    try {
      const updatedData = {
        id: id.id,
        name: firstName, // Use firstName for the name
        lastname: lastname, // Use lastname for the last name
        email: email !== undefined ? email : userData?.email,
        email2: email2 !== undefined ? email2 : userData?.email2,
        entreprise:
          entreprise !== undefined ? entreprise : userData?.entreprise,
        phone: phone !== undefined ? phone : userData?.phone,
        phoneSecondaire:
          phoneSecondaire !== undefined
            ? phoneSecondaire
            : userData?.phoneSecondaire,
        adresse: adresse !== undefined ? adresse : userData?.adresse,
        password: password !== undefined ? password : userData?.password,
        role: role !== undefined ? role : userData?.role,
      };
  
      // Keep empty strings to clear the fields
      const response = await fetch("/api/admin/updateInfo", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
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
  

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch("/api/admin/all-users");
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      const data = await response.json();
      const filteredUsers = data.users.find((user) => user._id === id.id);
      console.log("filetredUsers", filteredUsers);
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
        setPassword(filteredUsers.password || "");
        setRole(filteredUsers.role || "");
        setRemise375(filteredUsers.sales375 || "");
        setRemise500(filteredUsers.sales500 || "");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild className="w-full">
        <Button variant="normalBleuButton" className="w-full">
          {role === "userPro" || role === "user"
            ? "Modifier informations"
            : "Modifier informations"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[1000px] max-h-[calc(100vh-4rem)] overflow-y-auto lg:w-full w-[90%]  mx-auto">
        <div className="mt-4">
          <FormError message={error} />
          <FormSucess message={success} />
        </div>
        <DialogHeader>
          <DialogTitle>Modifier Les Information</DialogTitle>
          <DialogDescription>
            Personnalisez les informations pour chaque utilisateur selon leurs
            besoins et préférences.
          </DialogDescription>
        </DialogHeader>

        <div className="  w-full ">
          <div className="grid gap-6 py-4 lg:grid-cols-2  grid-cols-1">
            {/*<div className="items-center  ">
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
            </div>*/}

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

            <div className="items-center  ">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                className="col-span-3 mt-2"
                type="email"
                value={email}
                onChange={handleEmailChange}
              />
              {emailError && (
                <p className="text-red-500 text-sm pt-2">{emailError}</p>
              )}
            </div>
          </div>
          {/*<div className="grid gap-6 py-4 lg:grid-cols-2  grid-cols-1">
            <div className="items-center  ">
              <Label htmlFor="emailSecondaire" className="text-right">
                Email secondaire
              </Label>
              <Input
                id="emailSecondaire"
                className="col-span-3 mt-2"
                type="Email"
                value={email2}
                onChange={handleEmail2Change}
              />
              {emailError2 && (
                <p className="text-red-500 text-sm pt-2">{emailError2}</p>
              )}
            </div>
          </div>*/}

          <div className="grid gap-6 py-4 lg:grid-cols-2 grid-cols-1">
            <div className="items-center">
              <Label htmlFor="phone" className="text-right">
                Numéro de téléphone
              </Label>
              <Input
                id="phone"
                className="col-span-3 mt-2"
                type="tel"
                value={phone}
                onChange={handlePhoneChange}
              />
              {phoneError && (
                <p className="text-red-500 text-sm pt-2">{phoneError}</p>
              )}
            </div>
            <div className="items-center">
              <Label htmlFor="phoneSecondaire" className="text-right">
                Numéro de téléphone portable
              </Label>
              <Input
                id="phoneSecondaire"
                className="col-span-3 mt-2"
                type="tel"
                value={phoneSecondaire}
                onChange={handlePhoneSecondaireChange}
              />
              {phoneErrorSecondaire && (
                <p className="text-red-500 text-sm pt-2">
                  {phoneErrorSecondaire}
                </p>
              )}
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
            <div className="items-center  ">
              <Label htmlFor="adresse" className="text-right">
                Password
              </Label>
              <Input
                id="password"
                className="col-span-3 mt-2"
                type="password"
                value={password} // Shows 6 asterisks initially if password is empty
                onChange={(e) => setPassword(e.target.value)} // Allows user to type their own password
              />
            </div>
            {/*<div className="items-center  ">
              <Label htmlFor="role" className="text-right">
                Role
              </Label>
              <Input
                id="role"
                className="col-span-3 mt-2"
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
            </div>*/}
          </div>
        </div>
        <DialogFooter className="flex justify-end w-full gap-2">
          {/* Cancel Button */}
          <DialogClose asChild>
            <Button variant="outline" className="lg:w-1/2 w-full">
              Annuler
            </Button>
          </DialogClose>

          {/* Submit Button */}
          <Button onClick={handleSubmit} className="lg:w-1/2 w-full lg:ml-2">
            Modifier
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
