interface HoverButtonProps {
  children: React.ReactNode;
  color: string;
  directTo: string;
  onClick?: () => void;
}

const HoverButton: React.FC<HoverButtonProps> = ({ children, color, directTo }) => {
  return (
    <>
      {/* For larger screens (lg and above) */}
      <a
        href={directTo}
        className={`hidden lg:inline-block px-5 py-2.5 relative rounded group overflow-hidden font-medium bg-transparent text-[#${color}]  `}
      >
        <span className={`absolute top-0 left-0 flex w-0 h-full mr-0 transition-all duration-200 ease-out transform translate-x-0 bg-[#${color}] group-hover:w-full opacity-90`}></span>
        <span className={`relative group-hover:text-white flex gap-2`}>{children}</span>
      </a>

      {/* For smaller screens (mobile/tablet) */}
      <a
        href={directTo}
        className={`lg:hidden px-5 py-2.5 relative rounded group overflow-hidden font-medium bg-[#${color}] text-white inline-block`}
      >
        {/* Background fill */}
        <span className={`absolute top-0 left-0 flex w-full h-full transition-all duration-200 ease-out transform translate-x-0 opacity-90`}></span>
        {/* Text content */}
        <span className={`relative flex gap-2`}>{children}</span>
      </a>
    </>
  );
};

export default HoverButton;
