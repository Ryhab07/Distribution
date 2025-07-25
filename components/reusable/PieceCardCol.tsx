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
  onSelectCard: (id: string) => void; // New prop
}

const PieceCardCol: React.FC<CardProps> = ({
  _id,
  created_at,
  societe,
  client,
  marque,
  articleName,
  serieNumber,

  onSelectCard,
}) => {
  const selectedId = "123";

  const handleSalesModifierClick = () => {
    onSelectCard(_id);
  };

  const dateObject = new Date(created_at);
  // Format the date as "01/01/2020" in French
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
    <div className="relative cursor-pointer w-full mb-10 ">
      <div className="border-gray-300 absolute left-1/2 -translate-x-1/2  mt-[210px] lg:mt-[105px] bg-devinovGreen z-10 h-[20%] rounded-lg w-[80%] mx-auto flex justify-center"></div>
      <div
        className={` lg:h-[180px] h-[300px] z-40 p-4 group cursor-pointe bg-white rounded-md border border-gray-300 overflow-hidden relative hover:rounded-t-[0px] hover:border-t-2 hover:border-t-[#fab516] transition-all duration-200 ease-out transform translate-x-0 ${
          selectedId === _id ? "bg-gray-200" : ""
        }`}
      >
        <div className="text-start px-4 items-center flex justify-between lg:flex-row flex-col">
          <div className="lg:w-[150px] w-full">
            <h2 className="text-[14px] font-bold text-[#255D74]">
              DATE DEMANDE: {formattedDate}
            </h2>
          </div>
          <div className="border-r border-gray-300 h-20 mx-auto lg:flex hidden"></div>
          <div className="lg:w-[180px] w-full">
            {societe && (
              <p className="text-[12px] font-[600] text-devinovGreen mt-2 break-words">
                {" "}
                ENTREPRISE:{" "}
                <span className="text-[12px] font-medium text-black">
                {societe && societe.length > 20 ? societe.substring(0, 20) + '...' : societe || "-"}

                </span>
              </p>
            )}
            {client && (
              <p className="text-[12px] font-[600] text-devinovGreen mt-2 break-words">
                {" "}
                CLIENT:{" "}
                <span className="text-[12px] font-medium text-black">
                {client && client.length > 20 ? client.substring(0, 20) + '...' : client || "-"}
                </span>
              </p>
            )}
          </div>
          <div className="border-r border-gray-300 h-20 mx-auto lg:flex hidden"></div>
          <div className="lg:w-[180px] w-full">
            {marque && (
              <p className="text-[12px] font-[600] text-devinovGreen mt-2 break-words">
                {" "}
                MARQUE:{" "}
                <span className="text-[12px] font-medium text-black">
                {marque && marque.length > 20 ? marque.substring(0, 20) + '...' : marque || "-"}
                </span>
              </p>
            )}
            {articleName && (
              <p className="text-[12px] font-[600] text-devinovGreen mt-2 break-words">
                {" "}
                ARTICLE:{" "}
                <span className="text-[12px] font-medium text-black">
                {articleName && articleName.length > 20 ? articleName.substring(0, 20) + '...' : articleName || "-"}
                </span>
              </p>
            )}
            {serieNumber && (
              <p className="text-[12px] font-[600] text-devinovGreen mt-2 break-words">
                {" "}
                NUMERO DE SERIE:{" "}
                <span className="text-[12px] font-medium text-black">
                {serieNumber && serieNumber.length > 20 ? serieNumber.substring(0, 20) + '...' : serieNumber ||"-"}
                </span>
              </p>
            )}
          </div>
          <div className="border-r border-gray-300 h-20 mx-auto lg:flex hidden"></div>
          <div className="lg:w-[180px] w-full lg:mt-0 mt-4">
            <div className="w-full   flex lg:flex-end">
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

export default PieceCardCol;
