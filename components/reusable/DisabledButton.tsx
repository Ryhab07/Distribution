interface DisabledButtonProps {
    children: React.ReactNode;
  }
  
  const DisabledButton: React.FC<DisabledButtonProps> = ({ children }) => {
    return (
      <a
        href="#_"
        className="px-5 py-2.5 relative rounded group overflow-hidden font-medium bg-transparent text-black inline-block"
      >
        <span className="absolute top-0 left-0 flex w-0 h-full mr-0 transition-all duration-200 ease-out transform translate-x-0 bg-transparent group-hover:w-full opacity-90"></span>
        <span className="relative group-hover:text-black flex gap-2 opacity-40">{children}</span>
      </a>
    );
  };
  
  export default DisabledButton;
  