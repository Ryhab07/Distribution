import { Product } from "@/types/types";
import React, { useState } from "react";

interface CardProps {
  displayedProducts: Product[]; // Use Product[] to define the type of displayedProducts
  type: string; //
}

const AdminProductCardCol: React.FC<CardProps> = ({
  displayedProducts,
  type,
}) => {
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editField, setEditField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  console.log(message, loading, error);

  const handleStatusClick = (product: Product) => {
    setSelectedProduct(product);
    setIsStatusModalOpen(true);
  };

  const handleEditClick = (field: string, product: Product) => {
    setSelectedProduct(product);
    setEditField(field);
    setEditValue(product[field as keyof Product].toString());
    setIsEditModalOpen(true);
  };

  const confirmStatusChange = async () => {
    if (selectedProduct) {
      const newStatus =
        selectedProduct.status === "available" ? "unavailable" : "available";
  
      try {
        const response = await fetch(
          `/api/kits/productRoutes?id=${selectedProduct._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              updateData: { status: newStatus },
            }),
          }
        );
  
        const data = await response.json();
  
        if (response.ok) {
          console.log(
            `Status for ${selectedProduct.name} updated to ${newStatus}`
          );
          setIsEditModalOpen(false);
          setIsStatusModalOpen(false)
          window.location.reload();
        } else {
          console.error("Failed to update status:", data.message);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };
  

  const handleActivateKit = async (kitId: string) => {
    setLoading(true);
    setMessage("");
    setError("");
    try {
      const response = await fetch(
        `/api/kits/activateKit?action=activate&kitId=${kitId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        setMessage(`Kit activated: ${data.data.name}`);
        setIsEditModalOpen(false);
        setIsStatusModalOpen(false);
        window.location.reload();

        
      } else {
        setError(data.error || "Failed to activate kit");
      }
    } catch (err) {
      setError("An error occurred while activating the kit");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  

  const handleDeactivateKit = async (kitId: string) => {
    setLoading(true);
    setMessage("");
    setError("");
    try {
      const response = await fetch(
        `/api/kits/activateKit?action=deactivate&kitId=${kitId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        setMessage(`Kit deactivated: ${data.data.name}`);
        setIsEditModalOpen(false);
        setIsStatusModalOpen(false);
        window.location.reload();

        
      } else {
        setError(data.error || "Failed to deactivate kit");
      }
    } catch (err) {
      setError("An error occurred while deactivating the kit");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  

  const handleDeleteKit = async (kitId: string) => {
    setLoading(true);
    setMessage("");
    setError("");
  
    try {
      const response = await fetch(`/api/kits/activateKit?kitId=${kitId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ kitId }),
      });
  
      const data = await response.json();
  
      if (data.success) {
        setMessage("Kit deleted successfully");
        setIsEditModalOpen(false);
        setIsStatusModalOpen(false);
        window.location.reload();

        
      } else {
        setError(data.error || "Failed to delete kit");
      }
    } catch (err) {
      setError("An error occurred while deleting the kit");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  

  const confirmEditChange = async () => {
    if (selectedProduct && editField && editValue) {
      try {
        const response = await fetch(
          `/api/kits/productRoutes?id=${selectedProduct._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              updateData: {
                [editField]: editValue,
                ...(editField === "stock" &&
                  parseInt(editValue) === 0 && { status: "unavailable" }),
              },
            })
          }
        );
  
        const data = await response.json();

        if (response.ok) {
          console.log(
            `${editField} for ${selectedProduct.name} updated to ${editValue}`
          );
          if (editField === "stock" && parseInt(editValue) === 0) {
            console.log(`Status for ${selectedProduct.name} updated to unavailable`);
          }
          setIsEditModalOpen(false); // Close the modal here
          window.location.reload();
        } else {
          console.error("Failed to update product:", data.message);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };
  
  console.log("displayedProducts", displayedProducts);

  return (
    <>
      {type === "products" ? (
        <div className="mt-10">
          {displayedProducts.map((user, index) => {
            const { name, ref, stock, cost, status } = user;
            return (
              <div key={index} className="relative cursor-pointer w-full mb-10">
                <div className="border-gray-300 absolute left-1/2 -translate-x-1/2 mt-[270px] lg:mt-[105px] bg-devinovGreen z-10 h-[20%] rounded-lg w-[80%] mx-auto flex justify-center"></div>
                <div
                  className={`lg:h-[120px] h-[320px] z-40 p-4 group cursor-pointer bg-white rounded-md border border-gray-300 overflow-hidden relative hover:rounded-t-[0px] hover:border-t-2 hover:border-t-[#fab516] transition-all duration-200 ease-out transform translate-x-0`}
                >
                  <div className="text-start px-4 items-center flex justify-between lg:flex-row flex-col">
                    <div className="lg:w-[250px] w-full">
                      <p className="text-[13px] font-bold text-[#255D74]">
                        {name}
                      </p>
                      <p className="text-[13px] text-devinovGreen font-[600]">
                        Référence:{" "}
                        <span className="text-[13px] font-medium text-black">
                          {ref}
                        </span>
                      </p>
                    </div>
                    <div className="border-r border-gray-300 h-20 mx-auto lg:flex lg:flex-row flex-col hidden"></div>
                    <div className="lg:w-[150px] w-full">
                      <p className="text-[13px] text-devinovGreen font-[600]">
                        Prix:{" "}
                        <span className="text-[13px] font-medium text-black">
                          {cost.toString().slice(0, 6)} €
                        </span>
                      </p>
                      <p className="text-[13px] text-devinovGreen font-[600]">
                        Stock:{" "}
                        <span className="text-[13px] font-medium text-black">
                          {stock.toString().slice(0, 6)}
                        </span>
                      </p>
                    </div>
                    <div className="border-r border-gray-300 h-20 mx-auto lg:flex  lg:flex-row flex-col hidden"></div>
                    <div className="lg:w-[450px] w-full flex justify-between lg:flex-row flex-col gap-2 lg:mt-0 mt-4">
                      <button
                        className={`${
                          status === "available"
                            ? "text-devinovGreen border-devinovGreen"
                            : "text-red-500 border-red-500"
                        } border px-4 py-2 rounded text-[12px]`}
                        onClick={() => handleStatusClick(user)}
                      >
                        {status === "available" ? "Désactiver" : "Activer"}
                      </button>

                      <button
                        className="text-devinovBleu border-devinovBleu border px-4 py-2 rounded text-[12px]"
                        onClick={() => handleEditClick("ref", user)}
                      >
                        Modifier Ref
                      </button>
                      <button
                        className="text-devinovBleu border-devinovBleu border px-4 py-2 rounded text-[12px]"
                        onClick={() => handleEditClick("cost", user)}
                      >
                        Modifier Prix
                      </button>
                      <button
                        className="text-devinovBleu border-devinovBleu border px-4 py-2 rounded text-[12px]"
                        onClick={() => handleEditClick("stock", user)}
                      >
                        Modifier Stock
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Status Confirmation Modal */}
          {isStatusModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[9999]">
              <div className="bg-white p-5 rounded-lg w-80">
                <p>
                  Êtes-vous sûr de vouloir changer le produit à{" "}
                  {selectedProduct?.status === "available"
                    ? "Désactiver"
                    : "Activer"}{" "}
                  ?
                </p>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => setIsStatusModalOpen(false)}
                    className="px-4 py-2 mr-2 rounded bg-gray-300"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={confirmStatusChange}
                    className="px-4 py-2 rounded bg-devinovGreen text-white"
                  >
                    Confirmer
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Edit Modal */}
          {isEditModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[9999]">
              <div className="bg-white p-5 rounded-lg w-80">
                <p>Modifier {editField} :</p>
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="w-full mt-2 p-2 border rounded"
                />
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 mr-2 rounded bg-gray-300"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={confirmEditChange}
                    className="px-4 py-2 rounded bg-devinovGreen text-white"
                  >
                    Sauvegarder
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-10">
          {displayedProducts.map((user, index) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const { name, totalPrice, status } = user;
            return (
              <div key={index} className="relative cursor-pointer w-full mb-10">
                <div className="border-gray-300 absolute left-1/2 -translate-x-1/2 mt-[270px] lg:mt-[105px] bg-devinovGreen z-10 h-[20%] rounded-lg w-[80%] mx-auto flex justify-center"></div>
                <div
                  className={`lg:h-[120px] h-[380px] z-40 p-4 group cursor-pointer bg-white rounded-md border border-gray-300 overflow-hidden relative hover:rounded-t-[0px] hover:border-t-2 hover:border-t-[#fab516] transition-all duration-200 ease-out transform translate-x-0`}
                >
                  <div className="text-start px-4 items-center flex justify-between lg:flex-row flex-col">
                    <div className="lg:w-[350px] w-full">
                      <p className="text-[13px] font-bold text-[#255D74]">
                        {name}
                      </p>
                    </div>
                    <div className="border-r border-gray-300 h-20 mx-auto lg:flex lg:flex-row flex-col hidden"></div>
                    <div className="lg:w-[100px] w-full">
                      <p className="text-[13px] text-devinovGreen font-[600]">
                        Prix:{" "}
                        <span className="text-[13px] font-medium text-black">
                          {totalPrice.toString().slice(0, 6)} €
                        </span>
                      </p>
                    </div>
                    <div className="border-r border-gray-300 h-20 mx-auto lg:flex  lg:flex-row flex-col hidden"></div>
                    <div className="lg:w-[250px] w-full flex justify-center lg:flex-row flex-col gap-2 lg:mt-0 mt-4">
                      <button
                        className={`${
                          status === "available"
                            ? "text-devinovGreen border-devinovGreen"
                            : "text-red-500 border-red-500"
                        } border px-4 py-2 rounded text-[12px]`}
                        onClick={() => handleStatusClick(user)}
                      >
                        {status === "available" ? "Désactiver" : "Activer"}
                      </button>

                      <button
                        className={`${"text-red-500 border-red-500"} border px-4 py-2 rounded text-[12px]`}
                        onClick={() => handleDeleteKit(user._id)}
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Status Confirmation Modal */}
          {isStatusModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[9999]">
              <div className="bg-white p-5 rounded-lg w-80">
                <p>
                  Êtes-vous sûr de vouloir changer le produit à{" "}
                  {selectedProduct?.status === "available"
                    ? "Désactiver"
                    : "Activer"}{" "}
                  ?
                </p>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => setIsStatusModalOpen(false)}
                    className="px-4 py-2 mr-2 rounded bg-gray-300"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={() => {
                      console.log("selectedProduct", selectedProduct?.status); // Log selectedProduct here
                      selectedProduct?.status === "available"
                        ? handleDeactivateKit(selectedProduct._id)
                        : handleActivateKit(selectedProduct?._id);
                    }}
                    className="px-4 py-2 rounded bg-devinovGreen text-white"
                  >
                    Confirmer
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Edit Modal */}
          {isEditModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[9999]">
              <div className="bg-white p-5 rounded-lg w-80">
                <p>Modifier {editField} :</p>
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="w-full mt-2 p-2 border rounded"
                />
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 mr-2 rounded bg-gray-300"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={confirmEditChange}
                    className="px-4 py-2 rounded bg-devinovGreen text-white"
                  >
                    Sauvegarder
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default AdminProductCardCol;
