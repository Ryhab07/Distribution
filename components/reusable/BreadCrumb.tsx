import { Home } from 'lucide-react';

interface BreadcrumbProps {
  paths: { name: string; url: string }[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ paths }) => {
  return (
    <div className="relative h-[60px] w-[90%] mx-auto flex flex-wrap items-center bg-devinovGreen z-10 py-3 px-4 rounded-full mt-[-35px] text-white">
      {/* Home Icon */}
      <Home className="h-5 w-5 lg:h-6 lg:w-6 mr-2 text-black " />
      {paths.map((path, index) => (
        <div
          key={index}
          className="flex items-center space-x-2 lg:text-sm text-xs text-start text-black "
        >
          {/* Separator */}
          {index > 0 && (
            <span
              className={`text-${
                index === paths.length - 1 ? '[#ffffff]' : '[#ffffff]'
              } mx-2`}
            >
              {'>'}
            </span>
          )}

          {/* Breadcrumb Links */}
          {path.url !== '#' ? (
            <a
              href={path.url}
              className={`text-${
                index === paths.length - 1 ? '[#ffffff]' : '[#ffffff]'
              } font-${index === paths.length - 1 ? 'bold' : 'semiBold'} hover:text-[#255D74] hover:font-bold cursor-pointer truncate overflow-hidden text-ellipsis whitespace-nowrap max-w-[100px] lg:max-w-[200px]`}
            >
              {path.name}
            </a>
          ) : (
            <p
              className={`text-${
                index === paths.length - 1 ? '[#ffffff]' : '[#ffffff]'
              } font-${index === paths.length - 1 ? 'bold' : 'semiBold'} truncate overflow-hidden text-ellipsis whitespace-nowrap max-w-[100px] lg:max-w-[200px]`}
            >
              {path.name}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default Breadcrumb;
