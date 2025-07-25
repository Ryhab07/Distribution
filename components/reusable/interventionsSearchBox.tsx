import { useState } from 'react';

interface CardProps {
    _id: string;
    created_at: string;
    installateur: string;
    causeSAV: string;
    marque: string;
    categorieArticle: string;
    serieNumber: string;
    type: string;
    societe: string;
    onSelectCard: (id: string) => void;
}

interface SearchBoxProps {
    userData: CardProps[];
    onFilter: (filteredData: CardProps[]) => void;
}

const InterventionsSearchBox: React.FC<SearchBoxProps> = ({ userData, onFilter }) => {
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
            // Convert created_at to a formatted string
            //const formattedDate = user.created_at.toLocaleDateString('fr-FR');
            return (
                user.created_at?.includes(searchTerm.toLowerCase()) ||
                user.societe?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.installateur?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.causeSAV?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.marque?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.categorieArticle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

export default InterventionsSearchBox;
