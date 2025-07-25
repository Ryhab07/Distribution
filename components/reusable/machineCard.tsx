import { Button } from "../ui/button";
import { GenericDeleteAlertDialog } from "./DeletePopup";

interface CardProps {
  _id: string;
  created_at: string;
  installateur: string;
  causeSAV: string;
  marque: string;
  categorieArticle: string;
  serieNumber: string;
  type: string;
  onSelectCard: (id: string) => void; // New prop
}

const MachineCard: React.FC<CardProps> = ({
  _id,
  created_at,
  installateur,
  causeSAV,
  marque,
  categorieArticle,
  serieNumber,
  type,
  onSelectCard,
}) => {
  const selectedId = "123";
  console.log("onSelectCard", onSelectCard);

  const handleSalesModifierClick = () => {
    onSelectCard(_id); // Pass _id as an argument to onSelectCard function
  };

  const dateObject = new Date(created_at);
  // Format the date as "01/01/2020" in French
  const formattedDate = dateObject.toLocaleDateString("fr-FR");

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/machines/delete`,
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
          window.location.href = "/collaborateur/sav/iste-sav-machine";
        } else if (role === "admin") {
          window.location.href = "/admin/sav/iste-sav-machine";
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
    <div className="relative cursor-pointer lg:w-[24%] w-full mb-10 ">
      <div
        className={`border-gray-300 absolute left-1/2 -translate-x-1/2 ${
          type === "client" ? "mt-[380px]" : "mt-[360px]"
        } bg-devinovGreen z-10 h-[10%] rounded-lg w-[80%] mx-auto flex justify-center`}
      ></div>
      <div
        className={` ${
          type === "client" ? "h-[450px]" : "h-[380px]"
        } z-40 p-4 group cursor-pointe bg-white rounded-md border border-gray-300 overflow-hidden relative hover:rounded-t-[0px] hover:border-t-2 hover:border-t-[#fab516] transition-all duration-200 ease-out transform translate-x-0 ${
          selectedId === _id ? "bg-gray-200" : ""
        }`}
      >
        <div className="text-start px-4 pt-4 ">
          <div className="h-[200px]">
            <h2 className="text-[14px] font-bold text-[#255D74]">
              DATE DEMANDE: {formattedDate}
            </h2>
            {installateur && (
              <>
                <p className="text-[12px] font-[600] text-devinovGreen mt-4">
                  {" "}
                  INSTALLATEUR:{" "}
                  <span className="text-[12px] font-medium text-black">
                    {installateur ? installateur : "-"}
                  </span>
                </p>
                <hr className="bg-[#dfdfdf] mt-2 mb-2" />
              </>
            )}

            {causeSAV && (
              <>
                <p className="text-[12px] font-[600] text-devinovGreen mt-2">
                  {" "}
                  cAUSE SAV:{" "}
                  <span className="text-[12px] font-medium text-black">
                    {causeSAV ? causeSAV : "-"}
                  </span>
                </p>
                <hr className="bg-[#dfdfdf] mt-2 mb-2" />
              </>
            )}

            {marque && (
              <>
                <p className="text-[12px] font-[600] text-devinovGreen mt-2">
                  {" "}
                  MARQUE:{" "}
                  <span className="text-[12px] font-medium text-black">
                    {marque ? marque : "-"}
                  </span>
                </p>
                <hr className="bg-[#dfdfdf] mt-2 mb-2" />
              </>
            )}

            {categorieArticle && (
              <>
                <p className="text-[12px] font-[600] text-devinovGreen mt-2">
                  {" "}
                  ARTICLE:{" "}
                  <span className="text-[12px] font-medium text-black">
                    {categorieArticle ? categorieArticle : "-"}
                  </span>
                </p>
                <hr className="bg-[#dfdfdf] mt-2 mb-2" />
              </>
            )}

            {serieNumber && (
              <>
                <p className="text-[12px] font-[600] text-devinovGreen mt-2">
                  {" "}
                  NUMERO DE SERIE:{" "}
                  <span className="text-[12px] font-medium text-black">
                    {serieNumber ? serieNumber : "-"}
                  </span>
                </p>
              </>
            )}
          </div>

          <div className="mt-4">
            <Button onClick={handleSalesModifierClick} variant={"pieceBtn"}>
              Consulter
            </Button>
          </div>
          <div className="mt-2 mb-2 flex justify-start gap-2">
            <GenericDeleteAlertDialog
              id={_id}
              type="machines"
              onDelete={handleDelete}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MachineCard;
