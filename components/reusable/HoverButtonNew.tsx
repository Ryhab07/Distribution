interface HoverButtonProps {
    children: React.ReactNode;
    color: string;
    directTo: string;
    onClick?: () => void;
  }
  
  const HoverButtonNew: React.FC<HoverButtonProps> = ({ children, color, directTo }) => {
    console.log("color: " + color)
    return (
        <div>

        <a
          href={directTo}
          className={`border border-[#FAB517] hidden lg:inline-block px-5 py-2 relative rounded-[4px] group overflow-hidden font-medium bg-[#FFFFFF] text-[#FAB517]  `}
        >
          <span className={`text-[#FAB517] absolute top-0 left-0 flex w-0 h-full mr-0 transition-all duration-200 ease-out transform translate-x-0 bg-[#FAB517] group-hover:w-full opacity-90`}></span>
          <span className={`text-[#FAB517] relative group-hover:text-white flex gap-2`}>{children}</span>
        </a>
  
        {/* For smaller screens (mobile/tablet) */}
        <a
          href={directTo}
          className={`lg:hidden px-5 py-2.5 relative rounded group overflow-hidden font-medium bg-[#FAB517] text-white inline-block`}
        >
          {/* Background fill */}
          <span className={`text-[#FAB517] absolute top-0 left-0 flex w-full h-full transition-all duration-200 ease-out transform translate-x-0 opacity-90`}></span>
          {/* Text content */}
          <span className={`relative flex gap-2`}>{children}</span>
        </a>
      </div>
    );
  };
  
  export default HoverButtonNew;
  