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

const InterventionCard: React.FC<CardProps> = ({
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
  console.log("causeSAV", causeSAV);
  const handleSalesModifierClick = () => {
    onSelectCard(_id);
  };

  const dateObject = new Date(created_at);
  // Format the date as "01/01/2020" in French
  const formattedDate = dateObject.toLocaleDateString("fr-FR");

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/intervention/delete`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ _id: _id }),
        }
      );

      console.log("response", response);

      if (response.ok) {
        const role = sessionStorage.getItem("role");

        if (role === "collaborator") {
          window.location.href = "/collaborateur/sav/liste-intervention";
        } else if (role === "admin") {
          window.location.href = "/admin/sav/liste-intervention";
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
          type === "client" ? "mt-[380px]" : "mt-[300px]"
        } bg-devinovGreen z-10 h-[10%] rounded-lg w-[80%] mx-auto flex justify-center`}
      ></div>
      <div
        className={` ${
          type === "client" ? "h-[450px]" : "h-[320px]"
        } z-40 p-4 group cursor-pointe bg-white rounded-md border border-gray-300 overflow-hidden relative hover:rounded-t-[0px] hover:border-t-2 hover:border-t-[#fab516] transition-all duration-200 ease-out transform translate-x-0 ${
          selectedId === _id ? "bg-gray-200" : ""
        }`}
      >
        <div className="text-start px-4 pt-4">
          <h2 className="text-[14px] font-bold text-[#255D74]">
            DATE DEMANDE: {formattedDate}
          </h2>
          {categorieArticle && (
            <>
              <p className="text-[12px] font-[600] text-devinovGreen mt-2">
                {" "}
                SOCIETE:{" "}
                <span className="text-[12px] font-medium text-black">
                  {categorieArticle}
                </span>
              </p>
              <hr className="bg-[#dfdfdf] mt-2 mb-2" />
            </>
          )}
          {installateur && (
            <>
              <p className="text-[12px] font-[600] text-devinovGreen mt-2">
                {" "}
                CLIENT:{" "}
                <span className="text-[12px] font-medium text-black">
                  {installateur}
                </span>
              </p>
              <hr className="bg-[#dfdfdf] mt-2 mb-2" />
            </>
          )}
          {/*<h2 className="text-[12px] font-medium mt-2">{causeSAV}</h2>*/}
          {marque && (
            <>
              <p className="text-[12px] font-[600] text-devinovGreen mt-2">
                {" "}
                Marque:{" "}
                <span className="text-[12px] font-medium text-black">
                  {marque}
                </span>
              </p>
              <hr className="bg-[#dfdfdf] mt-2 mb-2" />
            </>
          )}
          {serieNumber && (
            <>
              <p className="text-[12px] font-[600] text-devinovGreen mt-2">
                {" "}
                NUMÉRO DE SÉRIE:{" "}
                <span className="text-[12px] font-medium text-black">
                  {serieNumber}
                </span>
              </p>
            </>
          )}
          <div className="mt-4">
            <Button onClick={handleSalesModifierClick} variant={"pieceBtn"}>
              Consulter
            </Button>
          </div>
          <div className="mt-2 mb-2 flex justify-start gap-2">
            <GenericDeleteAlertDialog
              id={_id}
              type="intervention"
              onDelete={handleDelete}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterventionCard;
