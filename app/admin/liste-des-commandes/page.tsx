"use client";
import { ChangeEvent, useEffect, useState } from "react";
import Breadcrumb from "@/components/reusable/BreadCrumb";
import BannerTitle from "@/components/reusable/BannerTitle";
import PaginationCategory from "@/components/reusable/Pagination";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar, XIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface Order {
  _id: string;
  confirmationCommande: string;
  retraitDeCommande: string;
  issueDate: string | Date; // Allow both string and Date
  bonDeCommande: string;
  bonDeRetrait: string;
  composer: boolean;
  userId: { name: string; lastname: string };
  createdBy: { name: string; lastname: string };
}

const Page = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedUserIds, setSelectedUserIds] = useState<string>("");
  const [selectedCreatedByIds, setSelectedCreatedByIds] = useState<string[]>(
    []
  );

  const userId = sessionStorage.getItem("id");
  const role = sessionStorage.getItem("role");

  const [clientSearch, setClientSearch] = useState<string>("");
  const [creatorSearch, setCreatorSearch] = useState<string>("");

  // Filter out undefined or empty values from uniqueUserIds and uniqueCreatedByIds
  const uniqueUserIds = [
    ...new Set(
      orders
        .map((order) => `${order.userId?.name} ${order.userId?.lastname}`)
        .filter((user) => user !== "undefined undefined")
    ),
  ];

  const uniqueCreatedByIds = [
    ...new Set(
      orders
        .map((order) => `${order.createdBy?.name} ${order.createdBy?.lastname}`)
        .filter((creator) => creator !== "undefined undefined")
    ),
  ];

  // Handle search within the Client dropdown
  const handleClientSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setClientSearch(event.target.value.toLowerCase());
  };

  // Handle search within the Creator dropdown
  const handleCreatorSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setCreatorSearch(event.target.value.toLowerCase());
  };

  const filteredClients = uniqueUserIds.filter((client) =>
    client.toLowerCase().includes(clientSearch)
  );

  const filteredCreators = uniqueCreatedByIds.filter((creator) =>
    creator.toLowerCase().includes(creatorSearch)
  );

  // Add a useEffect hook to handle filtering
  useEffect(() => {
    const filteredByUserAndCreator = orders.filter((order) => {
      const userMatch = selectedUserIds.length
        ? selectedUserIds.includes(
            `${order.userId?.name} ${order.userId?.lastname}`
          )
        : true;

      const creatorMatch = selectedCreatedByIds.length
        ? selectedCreatedByIds.some(
            (id) =>
              id === `${order.createdBy?.name} ${order.createdBy?.lastname}`
          )
        : true;

      return userMatch && creatorMatch;
    });

    setFilteredOrders(filteredByUserAndCreator);
  }, [orders, selectedUserIds, selectedCreatedByIds]);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          role !== "picker" ? `/api/order/allOrfers` : `/api/order/allOrfers`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await response.json();

        // Ensure issueDate is always a Date object
        const formattedOrders = data.orders.map((order) => ({
          ...order,
          issueDate: new Date(order.issueDate), // Convert to Date object
        }));

        // Filter orders based on criteria
        const filteredOrders = formattedOrders.filter((order) => {
          return (
            order.composer === false &&
            order.bonDeCommande &&
            order.bonDeRetrait
          );
        });

        // Reverse orders based on issueDate
        const reversedOrders = filteredOrders.slice().reverse();

        // Set the orders
        setOrders(reversedOrders);
        setFilteredOrders(reversedOrders);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  const breadcrumbPaths = [
    { name: "Accueil", url: "/admin/mon-compte" },
    { name: "Mon compte", url: "/admin/mon-compte" },
    { name: "Mes Commandes", url: "#" },
  ];

  const handleOpenPdf = (pdfUrl: string) => {
    window.open(pdfUrl, "_blank");
  };

  // Filter orders based on search query
  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    if (!query) {
      // If search is empty, reset the filtered orders
      setFilteredOrders(orders);
    } else {
      const filtered = orders.filter((order) => {
        const confirmationMatch = order.confirmationCommande
          .toLowerCase()
          .includes(query);
        const userMatch = order.userId
          ? `${order.userId.name} ${order.userId.lastname}`
              .toLowerCase()
              .includes(query)
          : false;
        const creatorMatch = order.createdBy
          ? `${order.createdBy.name} ${order.createdBy.lastname}`
              .toLowerCase()
              .includes(query)
          : false;

        return confirmationMatch || userMatch || creatorMatch;
      });
      setFilteredOrders(filtered);
    }
  };

  // Handle date selection from the calendar
  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);

    if (date) {
      const filteredByDate = orders.filter((order) => {
        const orderDate = new Date(order.issueDate);
        return (
          orderDate.toLocaleDateString("fr-FR") ===
          date.toLocaleDateString("fr-FR")
        );
      });
      setFilteredOrders(filteredByDate);
    } else {
      // Reset filteredOrders when date is cleared
      setFilteredOrders(orders);
    }
  };

  const resetDate = () => {
    setSelectedDate(null);
    // Reset filteredOrders when date is cleared
    setFilteredOrders(orders);
  };

  // Pagination
  const limit = 20;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const startIndex = (currentPage - 1) * limit;
  const endIndex = startIndex + limit;
  const ordersToShow = filteredOrders.slice(startIndex, endIndex);

  const handleUserIdChange = (value: string) => {
    if (value === "Tous") {
      setSelectedUserIds(""); // Clear the filter if "Tous" is selected
    } else {
      setSelectedUserIds(value); // Update the selected user ID
    }
  };

  const handleCreatedByChange = (value: string) => {
    if (value === "Tous") {
      // Clear all selections if "Tous" is selected
      setSelectedCreatedByIds([]);
    } else {
      setSelectedCreatedByIds((prev) =>
        prev.includes(value)
          ? prev.filter((id) => id !== value)
          : [...prev, value]
      );
    }
  };

  console.log("selectedCreatedByIds", selectedCreatedByIds)

  return (
    <div className="flex-col justify-between lg:pt-[70px] pt-[60px]">
      <div className="z-[20]">
        <BannerTitle tile={"Mes Commandes"} paragraph={" "} />
        <Breadcrumb paths={breadcrumbPaths} />
      </div>
      <div className="p-10 max-w-[1280px] mx-auto">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Rechercher par confirmation, client, ou préparateur..."
            value={searchQuery}
            onChange={handleSearch}
            className="border rounded-md w-full p-4 bg-white"
          />
        </div>

        <div className="w-full rounded bg-[#EFEFEF] p-4 my-[30px] border border-[#DFDFDF]">
          <p className="font-semibold text-devinovGreen text-sm">
            Nombre Total de Commandes: {filteredOrders.length}
          </p>
        </div>

        <div className="flex justify-start gap-2 lg:flex-row flex-col">
          {/* Calendar Picker */}
          <div className="mt-8">
            <div className="mb-4 flex border rounded-md p-2 w-full justify-between items-center">
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                dateFormat="dd/MM/yyyy"
                className="z-[9999] lg:w-full"
                placeholderText="Date"
              />
              <Calendar className="text-gray-600 h-[20px] w-[20px]" />
              {selectedDate && (
                <span
                  className="ml-2 cursor-pointer text-red-500"
                  onClick={() => resetDate()}
                >
                  <XIcon className="h-4 w-4" />
                </span>
              )}
            </div>
          </div>

          {/* Filter by Client (userId) */}
          <div className="mb-4 mt-8">
            <Select value={selectedUserIds} onValueChange={handleUserIdChange}>
              <SelectTrigger className="lg:w-[250px] w-full">
                <SelectValue placeholder="Client" />
              </SelectTrigger>
              <SelectContent className="absolute top-full mt-2">
                <SelectGroup>
                  <div className="p-2">
                    <Input
                      placeholder="Search Client..."
                      value={clientSearch}
                      onChange={handleClientSearch}
                      className="mb-2"
                    />
                  </div>
                  <SelectItem value="Tous">Tous</SelectItem>
                  {filteredClients.map((userId) => (
                    <SelectItem key={userId} value={userId}>
                      {userId}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Filter by CreatedBy */}
          <div className="mb-4 mt-4">
            <div className="lg:w-[250px] w-full  rounded-md p-2">
            {selectedCreatedByIds.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {selectedCreatedByIds.map((id) => (
                  <span
                    key={id}
                    className="bg-devinovGreen text-white text-sm px-2 py-1 rounded flex items-center gap-1"
                  >
                    {id}
                    <button
                      onClick={() =>
                        setSelectedCreatedByIds((prev) =>
                          prev.filter((item) => item !== id)
                        )
                      }
                    >
                      <XIcon className="h-4 w-4" />
                    </button>
                  </span>
                ))}
              </div>
            ) : null}
              <Select onValueChange={handleCreatedByChange}>
                <SelectTrigger className="lg:w-[250px] w-full mt-2">
                  <SelectValue placeholder="Préparateur de commande" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <div className="p-2">
                      <Input
                        placeholder="Search Préparateur..."
                        value={creatorSearch}
                        onChange={handleCreatorSearch}
                        className="mb-2"
                      />
                    </div>
                    <SelectItem value="Tous">Tous</SelectItem>
                    {filteredCreators.map((creator) => (
                      <SelectItem key={creator} value={creator}>
                        {creator}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {loading && <p>Chargement...</p>}
        {error && <p>Error: {error}</p>}
        {ordersToShow.length > 0 ? (
          <div className="grid lg:grid-cols-1 gap-8 mt-10 grid-cols-1">
            {ordersToShow.map((order) => (
              <div key={order._id} className="flex lg:flex-row flex-col justify-center">
                <div className="flex lg:flex-row flex-col items-center justify-between w-full border border-gray-300 p-4 rounded-md">
                  <div className="flex lg:flex-row flex-col justify-start lg:gap-10 gap-0 items-center">
                    <p className="text-center text-[14px]">
                      {order.issueDate instanceof Date
                        ? order.issueDate.toLocaleDateString("fr-FR")
                        : order.issueDate}
                    </p>
                    <div className="lg:border-r lg:border-gray-300 h-8"></div>
                    <p className="text-center text-[14px] ">
                      {order.confirmationCommande}
                    </p>
                    <div className="lg:border-r lg:border-gray-300 h-8"></div>
                    <p className="text-center text-[14px]">
                      <span className="font-semibold">Client: </span>
                      {order.userId
                        ? `${order.userId.name} ${order.userId.lastname}`
                        : "-"}
                    </p>
                    <div className="lg:border-r lg:border-gray-300 h-8"></div>
                    <p className="text-center text-[14px]">
                      <span className="font-semibold">
                        Préparateur de commande:{" "}
                      </span>
                      {order.createdBy
                        ? `${order.createdBy.name} ${order.createdBy.lastname}`
                        : "-"}
                    </p>
                  </div>
                  <button
                    className="text-devinovGreen bg-[#fffff] hover:bg-devinovGreen hover:text-white font-[500] text-[15px] py-1 px-4 rounded border border-devinovGreen lg:mt-0 mt-6"
                    onClick={() =>
                      handleOpenPdf(
                        `/api/pdf/${order.confirmationCommande}_BR?directory=BonDeRetrait`
                      )
                    }
                  >
                    Télécharger
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>Aucune commande trouvée.</p>
        )}

        {ordersToShow.length > 0 && (
          <div className="mt-10">
            <PaginationCategory
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              count={filteredOrders.length}
              limit={limit}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
