//import { Trash } from "lucide-react";
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

const InterventionCardCol: React.FC<CardProps> = ({
  _id,
  created_at,
  installateur,
  causeSAV,
  marque,
  categorieArticle,
  serieNumber,
  onSelectCard,

  //onSelectCard,
}) => {
  const selectedId = "123";

  const handleSalesModifierClick = () => {
    onSelectCard(_id); // Pass _id as an argument to onSelectCard function
  };

  console.log("causeSAV", causeSAV);

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
    <div className="relative cursor-pointer w-full mb-10 ">
      <div className="border-gray-300 absolute left-1/2 -translate-x-1/2  mt-[210px] lg:mt-[105px] bg-devinovGreen z-10 h-[20%] rounded-lg w-[80%] mx-auto flex justify-center"></div>
      <div
        className={` lg:h-[150px] h-[250px] z-40 p-4 group cursor-pointe bg-white rounded-md border border-gray-300 overflow-hidden relative hover:rounded-t-[0px] hover:border-t-2 hover:border-t-[#fab516] transition-all duration-200 ease-out transform translate-x-0 ${
          selectedId === _id ? "bg-gray-200" : ""
        }`}
      >
        <div className="text-start px-4 items-center flex justify-between lg:flex-row flex-col h-[120px] ">
          <div className="lg:w-[150px] w-full py-8">
            <h2 className="text-[14px] font-bold text-[#255D74]">
              DATE DEMANDE: {formattedDate}
            </h2>
          </div>
          <div className="border-r border-gray-300 h-[100px] mx-auto lg:flex hidden py-8"></div>
          <div className="lg:w-[160px] w-full py-8">
            {categorieArticle && (
              <p className="text-[12px] font-[600] text-devinovGreen">
                {" "}
                SOCIETE:{" "}
                <span className="text-[12px] font-medium text-black">
                  {categorieArticle}
                </span>
              </p>
            )}
            {installateur && (
              <p className="text-[12px] font-[600] text-devinovGreen">
                {" "}
                CLIENT:{" "}
                <span className="text-[12px] font-medium text-black">
                  {installateur}
                </span>
              </p>
            )}
          </div>
          <div className="border-r border-gray-300 h-[100px] mx-auto lg:flex hidden py-8"></div>
          <div className="lg:w-[200px] w-full py-2">
            {marque && (
              <p className="text-[12px] font-[600] text-devinovGreen">
                {" "}
                Marque:{" "}
                <span className="text-[12px] font-medium text-black">
                  {marque}
                </span>
              </p>
            )}
            {serieNumber && (
              <p className="text-[12px] font-[600] text-devinovGreen">
                {" "}
                NUMÉRO DE SÉRIE:{" "}
                <span className="text-[12px] font-medium text-black">
                  {serieNumber}
                </span>
              </p>
            )}
          </div>
          <div className="border-r border-gray-300 h-[100px] mx-auto lg:flex hidden py-8"></div>
          <div className="lg:w-[180px] w-full py-2">
            <div className="w-full  pt-2 flex lg:flex-end">
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
    </div>
  );
};

export default InterventionCardCol;
