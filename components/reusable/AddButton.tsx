import Image from 'next/image';
//import { useRouter } from 'next/navigation';
import React from 'react';


interface AddButtonProps {
  title: string;
  destination: string;
}

const AddButton: React.FC<AddButtonProps> = ({ title, destination }) => {
  //const router = useRouter();

  const handleClick = () => {
    window.location.href = destination;

  };

  return (
<button
  onClick={handleClick}
  className="bg-transparent hover:bg-[#fab516] hover:text-white text-[#fab516] text-center font-bold py-2 px-4  border border-[#fab516] flex gap-1 rounded-sm items-center "
>
  <Image src="/images/add.png" alt="Image" width={32} height={32} className="mr-2" />
  {title}
</button>

  );
};

export default AddButton;
