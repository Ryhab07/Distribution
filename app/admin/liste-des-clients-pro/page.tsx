"use client";
import { useState, useEffect } from "react";
import Breadcrumb from "@/components/reusable/BreadCrumb";
import UserCard from "@/components/reusable/userCard";
import UserSearchBox from "@/components/reusable/userSearchBox";
import BannerTitle from "@/components/reusable/BannerTitle";
import PaginationCategory from "@/components/reusable/Pagination";
import FilterBar from "@/components/reusable/FilterBar";
import UserCardCol from "@/components/reusable/userCardCol";
import AddButton from "@/components/reusable/AddButton";

interface CardProps {
  _id: string;
  email: string;
  password: string;
  name: string;
  lastname: string;
  entreprise: string;
  phone: string;
  role: string;
  __v: number;
  adresse: string;
  sales: number;
  sales375: number;
  sales500: number;
  phoneSecondary?: string;
  emailSecondary?: string;
  onSelectCard: (id: string) => void; // New prop
  type: string;
  selectedId: any;
  phoneSecondaire: string;
  email2: string;
}

const Page = () => {
  const [filteredUserData, setFilteredUserData] = useState<CardProps[]>([]);
  const [userData, setUserData] = useState<CardProps[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [affichage, setAffichage] = useState<string>("grid");
  const [message, setMessage] = useState<string | null>(null);
  const [count, setCount] = useState(0);

  console.log("count", count);
  const limit = 12;

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
      const filteredUsers = data.users.filter(
        (user) => user.role === "userPro"
      );
      setCount(filteredUsers);
      setUserData(filteredUsers.reverse());
      setFilteredUserData(filteredUsers.reverse());
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleFilter = (filteredData: CardProps[]) => {
    if (filteredData.length > 0) {
      setFilteredUserData(filteredData); // Update with filtered data
      setMessage(null); // Clear the message
    } else {
      setFilteredUserData(userData); // Reset to all data
      setMessage("Aucune information trouvée"); // Set the message
    }
  };

  const handleCardSelect = (id: string) => {
    setSelectedId(id);
  };

  // Calculate the index of the first and last user to be displayed on the current page
  const startIndex = (currentPage - 1) * limit;
  const endIndex = startIndex + limit;

  // Slice the filteredUserData array to display only the users for the current page
  const usersToShow = filteredUserData.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen flex-col justify-between lg:pt-[70px] pt-[60px]">
      <BannerTitle tile={"Liste des clients Pro"} paragraph={""} />
      <Breadcrumb
        paths={[
          { name: "Accueil", url: "/admin/mon-compte" },
          { name: "Mon compte", url: "/admin/mon-compte" },
          { name: "Liste des clients Pro", url: "#" },
        ]}
      />
      <div className="lg:pt-20 p-10 max-w-[1280px] mx-auto">
        <div className="flex justify-end">
          <AddButton
            title="AJOUTER UN CLIENT PRO"
            destination="/admin/nouveau-client-pro"
          />
        </div>
        <UserSearchBox userData={userData} onFilter={handleFilter} />
        <FilterBar
          setAffichage={setAffichage}
          affichage={affichage}
          count={!message ? filteredUserData?.length : 0}
        />
        {affichage === "grid" ? (
          <div className="mt-10 flex justify-start gap-4 flex-wrap">
            {message ? (
              <p className="text-black text-start w-full mt-4">{message}</p>
            ) : (
              usersToShow.reverse().map((user) => (
                <UserCard
                  key={user._id}
                  __v={user.__v}
                  _id={user._id}
                  role={user.role}
                  password={user.password}
                  entreprise={user.entreprise}
                  name={user.name}
                  lastname={user.lastname}
                  phone={user.phone}
                  email={user.email}
                  sales375={user.sales375}
                  sales500={user.sales500}
                  sales={0}
                  adresse={user.adresse}
                  selectedId={selectedId}
                  onSelectCard={handleCardSelect}
                  href={"/admin/liste-des-clients-pro"}
                  type="client-pro"
                />
              ))
            )}
          </div>
        ) : (
          <div className="mt-10">
            {message ? (
              <p className="text-black text-start mt-4">{message}</p>
            ) : (
              usersToShow.map((user) => (
                <UserCardCol
                  key={user._id}
                  __v={user.__v}
                  _id={user._id}
                  role={user.role}
                  password={user.password}
                  entreprise={user.entreprise}
                  name={user.name}
                  lastname={user.lastname}
                  phone={user.phone}
                  email={user.email}
                  sales375={user.sales375}
                  sales500={user.sales500}
                  sales={0}
                  adresse={user.adresse}
                  selectedId={selectedId}
                  onSelectCard={handleCardSelect}
                  href={"/admin/liste-des-clients-pro"}
                  type="client-pro"
                />
              ))
            )}
          </div>
        )}
        {filteredUserData.length > limit && usersToShow.length > 0 && filteredUserData.length > 0 && !message && (
          <div className="mt-10 ">
            <PaginationCategory
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              count={filteredUserData.length}
              limit={limit}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
