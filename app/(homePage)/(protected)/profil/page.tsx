"use client"
import BannerTitle from "@/components/reusable/BannerTitle";
import Breadcrumb from "@/components/reusable/BreadCrumb";
import { cn } from "@/lib/utils";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';


const Page = ({ className, ...props }) => {
    const [remise375, setRemise375] = useState("");
    const [remise500, setRemise500] = useState("");
    const [email, setEmail] = useState("");
    const [email2, setEmailSecondaire] = useState("");
    const [name, setName] = useState("");
    const [entreprise, setEntreprise] = useState("");
    const [phone, setPhone] = useState("");
    const [phoneSecondaire, setPhoneSecondaire] = useState("");
    const [adresse, setAdresse] = useState("");
    const [role, setRole] = useState("");
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const userRole = sessionStorage.getItem("role");
    const [userData, setUserData] = useState<any>(null);
    const [id, setId] = useState<string | null>(null);
    const [password, setPassword] = useState<string | null>(null);

    useEffect(() => {
        const storedId = sessionStorage.getItem("id");
        setId(storedId);
    }, []);

    console.log("error", error)
  
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
  
    useEffect(() => {
      fetchUserData();
    }, []);
  
    console.log("id Modifier", id)
  
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/admin/all-users");
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const data = await response.json();
        console.log("data", data);
        const filteredUsers = data.users.find(user => {
            console.log('user._id:', user._id);
            console.log('id:', id);
            return user._id === sessionStorage.getItem("id");
          });
          

        if (filteredUsers) {
  
          setUserData(filteredUsers);
          setName(filteredUsers.name + " " + filteredUsers.lastname || "");
          setEmail(filteredUsers.email || "");
          setEmailSecondaire(filteredUsers.email2 || "");
          setEntreprise(filteredUsers.entreprise || "");
          setPhone(filteredUsers.phone || "");
          setPhoneSecondaire(filteredUsers.phoneSecondaire !== undefined ? filteredUsers.phoneSecondaire : "-");
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
  
    console.log("userData", email) 
    console.log("userData", remise500)    
  const breadcrumbPaths = [
    { name: "Accueil", url: "/" },
    { name: "Profil", url: "/profil" },
  ];
  return (
    <div className="min-h-screen flex-col justify-between lg:pt-[70px] pt-[60px] ">
      <BannerTitle
        tile={"Profil"}
        paragraph={""}
      />
      <Breadcrumb paths={breadcrumbPaths} />
      <div className="relative cursor-pointer w-full mb-10 p-4 max-w-[1280px] mx-auto ">
      <div className="z-10 border-gray-300 absolute left-1/2 -translate-x-1/2 mt-[210px] lg:mt-[430px] bg-devinovGreen h-[20%] rounded-lg w-[60%] mx-auto flex justify-center"></div>
      <div
        className={cn(
          "mt-10 bg-[#FBFBFB] border border-[#F0F0F0] p-4 gap-6 rounded-[20px] z-40 relative w-[90%] mx-auto",
          className
        )}
        {...props}
      >
        {error && <p className="text-red-500">{error}</p>}
                <div className="  w-full ">
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
                onChange={(e) => setPhone(e.target.value)}
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
                onChange={(e) => setPhoneSecondaire(e.target.value)}
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
            <div className="items-center  ">
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
        </div>
        <div className="flex justify-end mt-4 mb-4">
            <Button onClick={handleSubmit}>Modifier</Button>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Page;
