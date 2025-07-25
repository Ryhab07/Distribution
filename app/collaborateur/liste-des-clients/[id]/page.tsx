"use client";
import { useState, useEffect } from "react";
import Breadcrumb from "@/components/reusable/BreadCrumb";
import BannerTitle from "@/components/reusable/BannerTitle";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { ObjectId } from "mongodb";
import DeleteModal from "@/components/reusable/DeleteModal";
import { SalesModifier } from "@/components/reusable/salesModifier";
import { InfoModifier } from "@/components/reusable/InfoModifier";
import { InfoModifierWorker } from "@/components/reusable/InfoModifierWorker";

interface CardProps {
  _id: ObjectId;
  email: string;
  email2: string;
  name: string;
  lastname: string;
  entreprise: string;
  phone: string;
  phoneSecondaire: string;
  adresse: string;
  sales375: number;
  sales500: number;
}

const Page = () => {
  const params = useParams();
  const [userData, setUserData] = useState<CardProps[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { id } = params || {};
  const role = "client";

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
      console.log("id", id);

      // Direct string comparison
      const filteredUsers = data.users.filter(
        (user) => String(user._id) === id
      );
      console.log("fileteredUsers", filteredUsers);

      setUserData(filteredUsers.reverse());
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  console.log("String(userData[0]?._id)", String(userData[0]?._id));
  console.log("userData[0]?.sales375", userData[0]?.sales375);

  const sales375 = userData[0]?.sales375;
  const sales500 = userData[0]?.sales500;

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/admin/delete-user?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete user.");
      }

      // Reload the page or refresh user data after deletion
      window.location.href = "/collaborateur/liste-des-clients/";
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      setShowDeleteModal(false); // Close the modal after deletion
    }
  };

  return (
    <div className="min-h-screen flex-col justify-between lg:pt-[70px] pt-[60px] ">
      <BannerTitle tile={"DETAIL DE CLIENTS"} paragraph={""} />
      <Breadcrumb
        paths={[
          { name: "Accueil", url: "/collaborateur/mon-compte" },
          { name: "Mon compte", url: "/collaborateur/mon-compte" },
          {
            name: "Liste des Clients",
            url: "/collaborateur/liste-des-clients",
          },
          { name: "Detail de Client", url: "#" },
        ]}
      />
      <div className="lg:pt-10 p-10 max-w-[1280px] mx-auto  mt-10 rounded-md mb-10">
      <div className="flex justify-between gap-4 lg:flex-row flex-col">
      <div className="flex justify-end lg:flex-row flex-col mb-10 gap-4">
            {/*<Button className="bg-[#3e9f36]" onClick={exportToExcel}>
              Exporter vers Excel
            </Button>*/}

            {role === "client" || role === "client-pro" ? (
              <InfoModifier id={id} role={role} />
            ) : (
              <InfoModifierWorker id={userData[0]?._id} role={role} />
            )}
            <SalesModifier
              id={String(userData[0]?._id)}
              sales375={sales375}
              sales500={sales500}
              role={role}
            />
            <Button
              className="bg-red-500"
              onClick={() => setShowDeleteModal(true)}
            >
              <Trash className="text-white h-4 w-4 mr-2" />
              Supprimer
            </Button>
          </div>
        </div>

        {userData.map((user, index) => (
          <div key={index} className="border border-gray-300 p-6 rounded-md">
            {user.entreprise && (
            <div className="flex justify-start lg:flex-row flex-col  mt-1 items-center border-b-[#d1d5db] border-b p-4">
              <div className="font-bold lg:border-r lg:border-gray-200 lg:pl-2  lg:w-1/2 w-full pb-6 ">
                SOCIETE:{" "}
              </div>
              <div className="py-2 lg:pl-8 break-words  pr-2 lg:w-1/2 w-full pb-6 ">
                {user.entreprise ? user.entreprise : "-"}
              </div>
            </div>
            )}
            <div className="flex justify-start lg:flex-row flex-col mt-1 items-center border-b-[#d1d5db] border-b p-4">
              <div className="font-bold lg:border-r lg:border-gray-200 lg:pl-2  lg:w-1/2 w-full pb-6 uppercase ">
                Client:{" "}
              </div>
              <div className="py-2 lg:pl-8 break-words  pr-2 lg:w-1/2 w-full pb-6 ">
                {user?.name} {user?.lastname}
              </div>
            </div>
            <div className="flex justify-start lg:flex-row flex-col mt-1 items-center border-b-[#d1d5db] border-b p-4">
              <div className="font-bold lg:border-r lg:border-gray-200 lg:pl-2  lg:w-1/2 w-full pb-6 ">
                EMAIL:{" "}
              </div>
              <div className="py-2 lg:pl-8 break-words  pr-2 lg:w-1/2 w-full pb-6 ">
                {user.email ? user.email : "-"}
              </div>
            </div>
            <div className="flex justify-start lg:flex-row flex-col mt-1 items-center border-b-[#d1d5db] border-b p-4">
              <div className="font-bold lg:border-r lg:border-gray-200 lg:pl-2  lg:w-1/2 w-full pb-6 ">
                EMAIL SECONDAIRE:{" "}
              </div>
              <div className="py-2 lg:pl-8 break-words  pr-2 lg:w-1/2 w-full pb-6 ">
                {user.email2 ? user.email2 : "-"}
              </div>
            </div>
            <div className="flex justify-start lg:flex-row flex-col mt-1 items-center border-b-[#d1d5db] border-b p-4">
              <div className="font-bold lg:border-r lg:border-gray-200 lg:pl-2  lg:w-1/2 w-full pb-6 ">
                NUMERO DE TELEPHONE:{" "}
              </div>
              <div className="py-2 lg:pl-8 break-words  pr-2 lg:w-1/2 w-full pb-6 ">
                {user.phone ? user.phone : "-"}
              </div>
            </div>
            <div className="flex justify-start lg:flex-row flex-col mt-1 items-center border-b-[#d1d5db] border-b p-4">
              <div className="font-bold lg:border-r lg:border-gray-200 lg:pl-2  lg:w-1/2 w-full pb-6 ">
                NUMERO DE TELEPHONE PORTABLE::{" "}
              </div>
              <div className="py-2 lg:pl-8 break-words  pr-2 lg:w-1/2 w-full pb-6 ">
                {user.phoneSecondaire ? user.phoneSecondaire : "-"}
              </div>
            </div>
            <div className="flex justify-start lg:flex-row flex-col mt-1 items-center border-b-[#d1d5db] border-b  p-4">
              <div className="font-bold lg:border-r lg:border-gray-200 lg:pl-2  lg:w-1/2 w-full pb-6 ">
                ADRESSE:{" "}
              </div>
              <div className="py-2 lg:pl-8 break-words  pr-2 lg:w-1/2 w-full pb-6 ">
                {user.adresse ? user.adresse : "-"}
              </div>
            </div>
            <div className="flex justify-start lg:flex-row flex-col mt-1 items-center border-b-[#d1d5db] border-b p-4">
              <div className="font-bold lg:border-r lg:border-gray-200 lg:pl-2  lg:w-1/2 w-full pb-6 uppercase">
                Prix de vente Kit avec panneaux 375:{" "}
              </div>
              <div className="py-2 lg:pl-8 break-words  pr-2 lg:w-1/2 w-full pb-6 ">
                {user.sales375 ? user.sales375 : "-"}
              </div>
            </div>
            <div className="flex justify-start lg:flex-row flex-col mt-1 items-center p-4">
              <div className="font-bold lg:border-r lg:border-gray-200 lg:pl-2  lg:w-1/2 w-full pb-6 uppercase">
                Prix de vente Kit avec panneaux 500:{" "}
              </div>
              <div className="py-2 lg:pl-8 break-words  pr-2 lg:w-1/2 w-full pb-6 ">
                {user.sales500 ? user.sales500 : "-"}
              </div>
            </div>
          </div>
        ))}
      </div>
      {showDeleteModal && (
        <DeleteModal
          msg="Êtes-vous sûr de vouloir supprimer cet utilisateur ?"
          onDelete={handleDelete}
          onCancel={() => setShowDeleteModal(false)} // Close the modal on cancel
        />
      )}
    </div>
  );
};

export default Page;
