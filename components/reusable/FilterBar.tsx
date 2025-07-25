import { LayoutGrid, LayoutListIcon } from "lucide-react";

interface FilterBarProps {
  affichage: string;
  setAffichage: React.Dispatch<React.SetStateAction<string>>;
  count: any;
}

const FilterBar: React.FC<FilterBarProps> = ({
  affichage,
  setAffichage,
  count,
}) => {
  const handleGridClick = () => {
    setAffichage("grid");
  };

  const handleListClick = () => {
    setAffichage("list");
  };

  return (
    <div className="lg:w-full p-4 bg-[#EFEFEF] mt-10 border rounded-[5px] lg:flex justify-between ">
      <div className="flex justify-start gap-10 cursor-pointer">
        <h1 className="text-[#fab516]">
          Nombre total: <span className="font-bold">{count}</span>
        </h1>
      </div>
      <div className="hidden md:flex justify-end gap-[6px] cursor-pointer">
        <LayoutGrid
          className={` ${
            affichage === "grid" ? "text-[#227ba8]" : "text-[#5F5F5F]"
          }`}
          onClick={handleGridClick}
        />
        <LayoutListIcon
          className={` ${
            affichage === "list" ? "text-[#227ba8]" : "text-[#5F5F5F]"
          }`}
          onClick={handleListClick}
        />
      </div>
    </div>
  );
};

export default FilterBar;
