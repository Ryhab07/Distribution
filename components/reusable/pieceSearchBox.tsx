import { useState } from 'react';

interface CardProps {
    _id: string;
    created_at: string;
    societe: string;
    client: string;
    marque: string;
    articleName: string;
    serieNumber: string;
    type: string;
    onSelectCard: (id: string) => void;
}

interface SearchBoxProps {
    userData: CardProps[];
    onFilter: (filteredData: CardProps[]) => void;
}

const PieceSearchBox: React.FC<SearchBoxProps> = ({ userData, onFilter }) => {
    const [searchTerm, setSearchTerm] = useState<string>('');

    const handleSearch = (searchTerm: string) => {
        setSearchTerm(searchTerm);

        if (searchTerm.trim() === '') {
            onFilter(userData);
            return;
        }

        // Implement your search logic here
        // For simplicity, check if the search term exists in any of the user data fields
        const filteredData = userData.filter((user) => {
            console.log("user", user)
            // Convert created_at to a formatted string
            //const formattedDate = user.created_at.toLocaleDateString('fr-FR');
            return (
                //formattedDate.includes(searchTerm.toLowerCase()) ||
                user.societe?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.client?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.marque?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.articleName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.serieNumber?.toString().includes(searchTerm)
            );
        });

        // Update the filtered data in the parent component
        onFilter(filteredData);
    };

    return (
        <>
            <input
                className='w-full p-4 bg-white mt-10 border border-[#DFDFDF] rounded-[5px]'
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder='Rechercher...'
            />
        </>
    );
};

export default PieceSearchBox;
