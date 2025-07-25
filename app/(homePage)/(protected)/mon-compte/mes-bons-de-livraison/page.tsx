"use client";
import { ChangeEvent, useEffect, useState } from "react";
import Breadcrumb from "@/components/reusable/BreadCrumb";
import BannerTitle from "@/components/reusable/BannerTitle";
import PaginationCategory from "@/components/reusable/Pagination";
import { ChevronLeft } from "lucide-react";
import OrderCard from "@/components/reusable/OrderCard";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { CartItem } from "@/redux/store/cartSlice";


interface Order {
  _id: string;
  confirmationCommande: string;
  retraitDeCommande: string;
  issueDate: string;
  bonDeCommande: string;
  bonDeRetrait: string;
  composer: boolean;
}

const Page = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [count, setCount] = useState<number>(0);
  const [limit, setLimit] = useState<number>(20);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const userId = sessionStorage.getItem("id");
  const role = sessionStorage.getItem("role");

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          role !== 'picker'
            ? `/api/order/getAllOrders?userId=${userId}`
            : `/api/order/getAllOrders?createdBy=${userId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await response.json();
        const formattedOrders = data.orders.map((order) => ({
          ...order,
          issueDate: new Date(order.issueDate).toLocaleDateString("fr-FR"),
        }));
        const filtered = formattedOrders.filter((order) =>
          order.composer === false && order.bonDeCommande && order.bonDeRetrait
        );
        const reversed = filtered.slice().reverse();
        setCount(reversed.length);
        setLimit(20);
        setOrders(reversed);
        setFilteredOrders(reversed);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  const breadcrumbPaths = [
    { name: "Accueil", url: "/" },
    { name: "Mes Commandes", url: "#" },
    ...(selectedOrder ? [{ name: "Détails de commande", url: "#" }] : []),
  ];

  const handleOpenPdf = (pdfUrl: string) => {
    window.open(pdfUrl, "_blank");
  };

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = orders.filter(
      (order) =>
        order.confirmationCommande.toLowerCase().includes(query) ||
        order.issueDate.toLowerCase().includes(query)
    );
    setFilteredOrders(filtered);
  };

  const startIndex = (currentPage - 1) * limit;
  const endIndex = startIndex + limit;
  const ordersToShow = filteredOrders.slice(startIndex, endIndex);
  const cartItems = useSelector((state: RootState) => state.cart.items);


  return (
    <div className="flex-col justify-between lg:pt-[70px] pt-[60px]">
      <BannerTitle tile={"Mes Commandes"} paragraph={" "} />
      <Breadcrumb paths={breadcrumbPaths} />
      <div className="p-10 max-w-[1280px] mx-auto">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Rechercher par nom ou date..."
            value={searchQuery}
            onChange={handleSearch}
            className="border rounded-md w-full p-4 bg-white"
          />
        </div>
        {loading && <p>Chargement...</p>}
        {error && ordersToShow.length < 0 && <p>Error: {error}</p>}
        {!selectedOrder && ordersToShow.length > 0 ? (
         <div className="flex flex-wrap justify-center gap-8 mt-10">
  {ordersToShow.map((order) => (
    <OrderCard
      key={order._id}
      confirmationCommande={order.confirmationCommande}
      issueDate={order.issueDate}
      onDetailsClick={() => setSelectedOrder(order)}
    />
  ))}
</div>

        ) : selectedOrder ? (
          <div className="mt-8 bg-gray-50 p-6 rounded-xl shadow-md border border-gray-200 relative max-w-3xl mx-auto">
            <h2 className="text-xl font-bold text-larnaBlue mb-4">Détails de la commande</h2>
            <div className="mb-4 space-y-1">
              <p>
                <span className="font-semibold text-black">Commande :</span>{" "}
                <span className="text-black">{selectedOrder.confirmationCommande}</span>
              </p>
              <p>
                <span className="font-semibold text-black">Date :</span>{" "}
                <span className="text-black">{selectedOrder.issueDate}</span>
              </p>
            </div>
            <div className="flex flex-wrap gap-4 mt-6">
              <button
                className="bg-larnaBlue text-white px-5 py-2 rounded-md hover:bg-devinovGreen transition"
                onClick={() =>
                  handleOpenPdf(`/api/pdf/${selectedOrder.confirmationCommande}_BR?directory=BonDeRetrait`)
                }
              >
                Bon de Retrait
              </button>
              <button
                className="bg-devinovGreen text-white px-5 py-2 rounded-md hover:bg-larnaBlue transition"
                onClick={() =>
                  handleOpenPdf(`/api/pdf/${selectedOrder.confirmationCommande}_BC?directory=BonDeCommande`)
                }
              >
                Bon de Facture
              </button>
            </div>
           <div className="absolute top-6 right-6">
  <button
    onClick={() => setSelectedOrder(null)}
    className="text-sm text-larnaBlue font-medium hover:text-devinovGreen transition-colors duration-200 flex items-center gap-2 bg-white px-3 py-1.5 rounded shadow-sm border border-larnaBlue hover:border-devinovGreen"
  >
    <ChevronLeft size={18} /> Retour
  </button>
</div>

          </div>
        ) : (
          <p>Aucune commande trouvée.</p>
        )}
        {ordersToShow.length > 0 && !selectedOrder && (
          <div className="mt-10">
            <PaginationCategory
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              count={count}
              limit={limit}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
