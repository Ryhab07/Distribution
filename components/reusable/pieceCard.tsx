import { useState } from "react";
import { Button } from "../ui/button";
import { GenericDeleteAlertDialog } from "./DeletePopup";

interface CardProps {
  _id: string;
  created_at: string;
  societe: string;
  client: string;
  marque: string;
  articleName: string;
  serieNumber: string;
  type: string;
  numeroBlOuFacture: string;
  onSelectCard: (id: string) => void; // New prop
}

const PieceCard: React.FC<CardProps> = ({
  _id,
  created_at,
  societe,
  client,
  marque,
  articleName,
  serieNumber,
  type,
  numeroBlOuFacture,
  onSelectCard,
}) => {
  const [selectedId] = useState("");

  const handleSalesModifierClick = () => {
    onSelectCard(_id); // Pass _id as an argument to onSelectCard function
  };

  const dateObject = new Date(created_at);
  const formattedDate = dateObject.toLocaleDateString("fr-FR");

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/pieces/delete`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ _id: _id }), // Send ID in the body as JSON
        }
      );

      console.log("response", response);

      if (response.ok) {
        const role = sessionStorage.getItem("role");

        if (role === "collaborator") {
          window.location.href = "/collaborateur/sav/liste-sav-piece";
        } else if (role === "admin") {
          window.location.href = "/admin/sav/liste-sav-piece";
        }
      }

      if (!response.ok) {
        throw new Error("Failed to delete piece");
      }
    } catch (error) {
      console.error("Error deleting piece:", error);
      // Optionally, handle error (e.g., show an error message)
    }
  };

  return (
    <div className="relative cursor-pointer lg:w-[24%] w-full mb-10">
      <div
        className={`border-gray-300 absolute left-1/2 -translate-x-1/2 ${
          type === "client" ? "mt-[380px]" : "mt-[450px]"
        } bg-devinovGreen z-10 h-[10%] rounded-lg w-[80%] mx-auto flex justify-center`}
      ></div>
      <div
        className={` ${
          type === "client" ? "h-[400px]" : "h-[480px]"
        } z-40 p-4 group cursor-pointe bg-white rounded-md border border-gray-300 overflow-hidden relative hover:rounded-t-[0px] hover:border-t-2 hover:border-t-[#fab516] transition-all duration-200 ease-out transform translate-x-0 ${
          selectedId === _id ? "bg-gray-200" : ""
        }`}
      >
        <div className="flex-col justify-between  h-full text-start px-4 pt-4">
          <div className="h-[75%]">
            <h2 className="text-[14px] font-bold text-[#255D74]">
              DATE DEMANDE: {formattedDate}
            </h2>
            {societe && (
              <>
                <p className="text-[12px] font-[600] text-devinovGreen mt-2 break-words">
                  {" "}
                  ENTREPRISE:{" "}
                  <span className="text-[12px] font-medium text-black">
                  {societe && societe.length > 32 ? societe.substring(0, 32) + '...' : societe || "-"}


                  </span>
                </p>
                <hr className="bg-[#dfdfdf] mt-2 mb-2" />
              </>
            )}

            {numeroBlOuFacture && (
              <>
                <p className="text-[12px] font-[600] text-devinovGreen mt-2 break-words">
                  {" "}
                  N° BL ou Facture:{" "}
                  <span className="text-[12px] font-medium text-black">
                    {numeroBlOuFacture && numeroBlOuFacture.length > 32 ? numeroBlOuFacture.substring(0, 32) + '...' : numeroBlOuFacture || "-"}
                  </span>
                </p>
                <hr className="bg-[#dfdfdf] mt-2 mb-2" />
              </>
            )}
            {client && (
              <>
                <p className="text-[12px] font-[600] text-devinovGreen mt-2 break-words">
                  {" "}
                  CLIENT:{" "}
                  <span className="text-[12px] font-medium text-black">
                    {client && client.length > 32 ? client.substring(0, 32) + '...' : client || "-"}
                  </span>
                </p>
                <hr className="bg-[#dfdfdf] mt-2 mb-2" />
              </>
            )}
            {marque && (
              <>
                <p className="text-[12px] font-[600] text-devinovGreen mt-2 break-words">
                  {" "}
                  MARQUE:{" "}
                  <span className="text-[12px] font-medium text-black">
                    {marque && marque.length > 32 ? marque.substring(0, 32) + '...' : marque || "-"}
                  </span>
                </p>
                <hr className="bg-[#dfdfdf] mt-2 mb-2" />
              </>
            )}
            {articleName && (
              <>
                <p className="text-[12px] font-[600] text-devinovGreen mt-2 break-words">
                  {" "}
                  ARTICLE:{" "}
                  <span className="text-[12px] font-medium text-black">
                    {articleName && articleName.length > 32 ? articleName.substring(0, 32) + '...' : articleName || "-"}
                  </span>
                </p>
                <hr className="bg-[#dfdfdf] mt-2 mb-2" />
              </>
            )}
            {serieNumber && (
              <>
                <p className="text-[12px] font-[600] text-devinovGreen mt-2 break-words">
                  {" "}
                  NUMERO DE SERIE:{" "}
                  <span className="text-[12px] font-medium text-black">
                    {serieNumber && serieNumber.length > 32 ? serieNumber.substring(0, 32) + '...' : serieNumber ||"-"}
                  </span>
                </p>
              </>
            )}
          </div>
          <div className="h-[20%]">
            <div className="mt-4">
              <Button onClick={handleSalesModifierClick} variant={"pieceBtn"}>
                Consulter
              </Button>
            </div>
            <GenericDeleteAlertDialog
              id={_id}
              type="pieces"
              onDelete={handleDelete}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PieceCard;
