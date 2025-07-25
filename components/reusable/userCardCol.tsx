import { useState } from "react";
import DeleteModal from "./DeleteModal";
/*import { InfoModifier } from "./InfoModifier";
import { SalesModifier } from "./salesModifier";
import { InfoModifierWorker } from "./InfoModifierWorker";*/

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
  href: string;
}

const UserCardCol: React.FC<CardProps> = ({
  _id,
  entreprise,
  name,
  lastname,
  phone,
  email,
  /*sales375,
  sales500,*/
  selectedId,
  //adresse,
  phoneSecondary,
  emailSecondary,
  //type,
  //role,
  //onSelectCard,
  href,
}) => {
  /*const handleSalesModifierClick = () => {
    onSelectCard(_id);
  };*/

  const [showDeleteModal, setShowDeleteModal] = useState(false); // State for delete modal
  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/admin/delete-user?id=${_id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete user.");
      }

      // Reload the page or refresh user data after deletion
      window.location.reload();
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      setShowDeleteModal(false); // Close the modal after deletion
    }
  };

  return (
    <div className="relative cursor-pointer w-full mb-10 ">
      <div className="border-gray-300 absolute left-1/2 -translate-x-1/2  mt-[210px] lg:mt-[125px] bg-devinovGreen z-10 h-[20%] rounded-lg w-[80%] mx-auto flex justify-center"></div>
      <div
        className={` lg:h-[150px] h-[250px] z-40 p-4 group cursor-pointe bg-white rounded-md border border-gray-300 overflow-hidden relative hover:rounded-t-[0px] hover:border-t-2 hover:border-t-[#fab516] transition-all duration-200 ease-out transform translate-x-0 ${
          selectedId === _id ? "bg-gray-200" : ""
        }`}
      >
        <div className="text-start px-4 items-center flex justify-between lg:flex-row flex-col">
          <div className="lg:w-[150px] w-full block">
            <h2 className="text-[14px] font-bold text-[#255D74]">
              {entreprise.length > 15
                ? `${entreprise.substring(0, 15)}...`
                : entreprise}
            </h2>
            {(name || lastname) && (
              <p className="text-[12px] font-[600] text-devinovGreen mt-2">
                {" "}
                CLIENT:{" "}
                <span className="text-[12px] font-medium text-black">
                  {name} {lastname}
                </span>
              </p>
            )}
          </div>

          <div className="border-r border-gray-300 h-20 mx-auto lg:flex hidden"></div>
          <div className="lg:w-[230px] w-full">
            {phone && (
              <p className="text-[12px] font-[600] text-devinovGreen mt-2">
                {" "}
                NUMERO DE TELEPHONE:{" "}
                <span className="text-[12px] font-medium text-black">
                  {phone?.slice(0, 10)}
                </span>
              </p>
            )}
            {phoneSecondary && (
              <p className="text-[12px] font-[600] text-devinovGreen mt-2">
                {" "}
                NUMERO SECONDAIRE:{" "}
                <span className="text-[12px] font-medium text-black">
                  {phoneSecondary?.slice(0, 10)}
                </span>
              </p>
            )}
            {email && (
              <p className="text-[12px] font-[600] text-devinovGreen mt-2">
                {" "}
                EMAIL:{" "}
                <span className="text-[12px] font-medium text-black">
                  {email}
                </span>
              </p>
            )}
            {emailSecondary && (
              <p className="text-[12px] font-[600] text-devinovGreen mt-2">
                {" "}
                EMAIL SECONDAIRE:{" "}
                <span className="text-[12px] font-medium text-black">
                  {emailSecondary ? emailSecondary?.slice(0, 10) : "-"}
                </span>
              </p>
            )}
            {/*{adresse && (
              <p className="text-[12px] font-[600] text-devinovGreen mt-2">
                {" "}
                ADRESSE:{" "}
                <span className="text-[12px] font-medium text-black break-words">
                  {type === "collaborateur"
                    ? "53 Av. du Bois de la Pie, Tremblay-en-France"
                    : adresse
                    ? adresse
                    : "-"}
                </span>
              </p>
            )}*/}
          </div>

          {/*{(sales375 !== 0 || sales500 !== 0) && (
            <>
              <div className="border-r border-gray-300 h-20 mx-auto lg:flex hidden"></div>
              <div className="lg:w-[300px] w-full">
                <div className="flex justify-between mb-2">
                  {sales375 > 0 ? (
                    <p className="text-[12px] font-[600] text-devinovGreen mt-2 uppercase">
                      {" "}
                      Prix de vente Kit avec panneaux 375:{" "}
                      <span className="text-[12px] font-medium text-black break-words">
                        {sales375}
                      </span>
                    </p>
                  ) : (
                    <p className="text-[12px] font-medium mt-2"> - </p>
                  )}
                </div>
                <div className="flex justify-between mb-2">
                  {sales500 > 0 ? (
                    <p className="text-[12px] font-[600] text-devinovGreen mt-2 uppercase">
                      {" "}
                      Prix de vente Kit avec panneaux 500:{" "}
                      <span className="text-[12px] font-medium text-black break-words">
                        {sales500}
                      </span>
                    </p>
                  ) : (
                    <p className="text-[12px] font-medium mt-2"> - </p>
                  )}
                </div>
              </div>
            </>
          )}*/}

          <div className="border-r border-gray-300 h-20 mx-auto lg:flex hidden"></div>

          <div className="lg:w-[180px] w-full">
            {/*<div className="w-full  pt-2 flex lg:flex-end">
              {type === "client" || type === "client-pro" ? (
                <InfoModifier
                  id={_id}
                  onClick={handleSalesModifierClick}
                  role={role}
                />
              ) : (
                <InfoModifierWorker
                  id={_id}
                  onClick={handleSalesModifierClick}
                  role={role}
                />
              )}
            </div>
            {type === "client" && (
              <div className="w-full  pt-2 flex lg:flex-end">
                <SalesModifier
                  id={_id}
                  sales375={sales375}
                  sales500={sales500}
                  role={role}
                />
              </div>
            )}*/}

            <div className="w-full  pt-2 flex lg:flex-center">
              <button
                className="bg-devinovGreen text-white px-4 py-2 rounded w-full"
                onClick={() => {
                  window.location.href = `${href}/${_id}`; // Redirect to the page with the ID
                }}
              >
                Consulter
              </button>
            </div>
            <div className="w-full  pt-2 flex lg:flex-center">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded w-full"
                onClick={() => setShowDeleteModal(true)}
              >
                Supprimer
              </button>
            </div>
          </div>
          {showDeleteModal && (
            <DeleteModal
              msg="Êtes-vous sûr de vouloir supprimer cet utilisateur ?"
              onDelete={handleDelete}
              onCancel={() => setShowDeleteModal(false)} // Close the modal on cancel
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default UserCardCol;
