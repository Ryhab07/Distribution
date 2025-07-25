//import { SalesModifier } from "./salesModifier";
//import { InfoModifier } from "./InfoModifier";
import { useState } from "react";
import DeleteModal from "./DeleteModal";
//import { InfoModifierWorker } from "./InfoModifierWorker";

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

const UserCard: React.FC<CardProps> = ({
  _id,
  entreprise,
  name,
  lastname,
  phone,
  email,
  /*sales375,
  sales500,
  adresse,*/
  role,
  type,
  /*phoneSecondary,
  emailSecondary,*/
  //onSelectCard,
  href,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  /*const handleSalesModifierClick = () => {
    onSelectCard(_id);
  };*/

  console.log("client", type);

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
    <div className="relative cursor-pointer lg:w-[24%] w-full mb-10">
      <div
        className={`border-gray-300 absolute left-1/2 -translate-x-1/2 ${
          role === "collaborator"
            ? "mt-[280px]"
            : role === "picker"
            ? "mt-[290px]"
            : role === "userPro"
            ? "mt-[340px]"
            : "mt-[290px]"
        } bg-devinovGreen z-10 ${
          role === "userPro"
            ? "h-[8%]"
            : role === "collaborator"
            ? "h-[25%]"
            : role === "client-pro"
            ? "h-[25%]"
            : "h-[23%]"
        } rounded-lg w-[80%] mx-auto flex justify-center`}
      ></div>
      <div
        className={`z-40 p-4 group cursor-pointer ${
          role === "userPro"
            ? "h-[350px]"
            : role === "collaborator"
            ? "h-[350px]"
            : role === "picker"
            ? "h-[350px]"
            : "h-[350px]"
        } bg-white rounded-md border border-gray-300 overflow-hidden relative hover:rounded-t-[0px] hover:border-t-2 hover:border-t-[#fab516] transition-all duration-200 ease-out transform translate-x-0`}
      >
        <div
          className={`text-start px-4 ${
            role === "userPro"
              ? "h-[200px]"
              : role === "collaborator"
              ? "h-[200px]"
              : role === "picker"
              ? "h-[200px]"
              : "h-[200px]"
          }`}
        >
          {(name || lastname) && (
            <>
              <p className="text-[14px] font-bold text-[#255D74] mt-2 mb-2">
                {" "}
                <span className="text-[14px] font-bold text-[#255D74]">
                  {name} {lastname}
                </span>
              </p>
            </>
          )}

          {entreprise && (
            <>
              <p className="text-[12px] font-[600] text-devinovGreen mt-4">
                {" "}
                SOCIETE:{" "}
                <span className="text-[12px] font-medium text-black">
                  {entreprise}
                </span>
              </p>

              <hr className="bg-[#dfdfdf] mt-2 mb-2" />
            </>
          )}

          {phone && (
            <>
              <p className="text-[12px] font-[600] text-devinovGreen mt-2">
                {" "}
                NUMERO DE TELEPHONE:{" "}
                <span className="text-[12px] font-medium text-black ">
                  {phone?.slice(0, 20)}
                </span>
              </p>

              <hr className="bg-[#dfdfdf] mt-2 mb-2" />
            </>
          )}

          {email && (
            <>
              <p className="text-[12px] font-[600] text-devinovGreen mt-2">
                {" "}
                EMAIL:{" "}
                <span className="text-[12px] font-medium text-black">
                  {email}
                </span>
              </p>

              {/*} <hr className="bg-[#dfdfdf] mt-2 mb-2" /> */}
            </>
          )}

          {/*{phoneSecondary && (
            <>
              <p className="text-[12px] font-[600] text-devinovGreen mt-2">
                {" "}
                NUMERO SECONDAIRE:{" "}
                <span className="text-[12px] font-medium text-black">
                  {phoneSecondary?.slice(0, 10)}
                </span>
              </p>

              <hr className="bg-[#dfdfdf] mt-2 mb-2" />
            </>
          )}

          {emailSecondary && (
            <>
              <p className="text-[12px] font-[600] text-devinovGreen mt-2">
                {" "}
                EMAIL SECONDAIRE:{" "}
                <span className="text-[12px] font-medium text-black">
                  {emailSecondary ? emailSecondary?.slice(0, 10) : "-"}
                </span>
              </p>

              <hr className="bg-[#dfdfdf] mt-2 mb-2" />
            </>
          )}

          {adresse && (
            <>
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

              <hr className="bg-[#dfdfdf] mt-2 mb-2" />
            </>
          )}

          {sales375 > 0 && (
            <>
              <div className="flex justify-between mb-2">
                {sales375 > 0 ? (
                  <p className="text-[12px] font-[600] text-devinovGreen mt-2 uppercase">
                    {" "}
                    Prix de vente Kit avec panneaux 375:{" "}
                    <span className="text-[12px] font-medium text-black break-words">
                      {sales375}
                    </span>
                  </p>
                ) : null}
              </div>
              <hr className="bg-[#dfdfdf] mt-2 mb-2" />
            </>
          )}

          {sales375 > 0 && (
            <>
              <div className="flex justify-between mb-2">
                {sales500 > 0 ? (
                  <p className="text-[12px] font-[600] text-devinovGreen mt-2 uppercase">
                    {" "}
                    Prix de vente Kit avec panneaux 500:{" "}
                    <span className="text-[12px] font-medium text-black break-words">
                      {sales500}
                    </span>
                  </p>
                ) : null}
              </div>
            </>
          )}*/}
        </div>
        {/*<div className="w-full pl-4 pt-2">
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
          <div className="w-full pl-4 pt-2">
            <SalesModifier
              id={_id}
              sales375={sales375}
              sales500={sales500}
              role={role}
            />
          </div>
        )}*/}

        <div className="w-full pl-4 pt-2">
          <button
            className="bg-devinovGreen text-white px-4 py-2 rounded w-full"
            onClick={() => {
              window.location.href = `${href}/${_id}`; // Redirect to the page with the ID
            }}
          >
            Consulter
          </button>
        </div>
        <div className="w-full pl-4 pt-2">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded w-full"
            onClick={() => setShowDeleteModal(true)}
          >
            Supprimer
          </button>
        </div>
      </div>

      {/* Delete Modal */}
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

export default UserCard;
