import { useState } from 'react';

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
  phoneSecondaire: string;
  email2: string;
}

interface SearchBoxProps {
  userData: CardProps[];
  onFilter: (filteredData: CardProps[], message: string | null) => void;
}

const UserSearchBox: React.FC<SearchBoxProps> = ({ userData, onFilter }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleSearch = (searchTerm: string) => {
    setSearchTerm(searchTerm);

    if (searchTerm.trim() === '') {
      onFilter(userData, null); // Reset to all data
      return;
    }

    // Filter user data based on the search term
    const filteredData = userData.filter((user) => {
      return (
        user.entreprise.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.sales375.toString().includes(searchTerm) ||
        user.sales500.toString().includes(searchTerm)
      );
    });

    console.log("Filtered Data:", filteredData);

    // Send the filtered data and message to the parent component
    if (filteredData.length > 0) {
      onFilter(filteredData, null); // No message if data is found
    } else {
      onFilter([], "Aucune information trouvée");
    }
  };

  return (
    <div>
      <input
        className='w-full p-4 bg-white mt-10 border border-[#DFDFDF] rounded-[5px]'
        type="text"
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder='Rechercher...'
      />
    </div>
  );
};

export default UserSearchBox;
