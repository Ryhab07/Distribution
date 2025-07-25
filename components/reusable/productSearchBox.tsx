import { useState } from "react";

interface CardProps {
  _id: string;
  name: string;
  [key: string]: any;
}

interface SearchBoxProps {
  userData: CardProps[];
  onFilter: (filteredData: CardProps[]) => void;
  type?: string;
}

const ProductSearchBox: React.FC<SearchBoxProps> = ({ userData, onFilter, type }) => {

  console.log("type", type)
  console.log("userData", userData)
  console.log("onFilter", onFilter)

  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleSearch = (searchTerm: string) => {
    setSearchTerm(searchTerm);

    // If the search term is empty, return the original data
    if (searchTerm.trim() === "") {
      onFilter(userData);
      return;
    }



    // Implement your search logic here
    // For simplicity, check if the search term exists in the "name" field
    const filteredData = userData.filter((user) => {
      return user.name?.toLowerCase().includes(searchTerm.toLowerCase());
    });

    // Update the filtered data in the parent component
    onFilter(filteredData);
  };

  return (
    <div>
      <input
        className="w-full p-4 bg-white mt-10 border border-[#DFDFDF] rounded-[5px]"
        type="text"
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Rechercher..."
      />
    </div>
  );
};

export default ProductSearchBox;
