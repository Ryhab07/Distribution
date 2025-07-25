import { ReactNode } from 'react';
import { Separator } from '../ui/separator';

interface TitleProps {
  children: ReactNode;
}

const TitleNew: React.FC<TitleProps> = ({ children }) => {
  return (
    <>
      <h1 className="lg:text-[40px] lg:font-bold text-[25px] font-semibold relative text-[#1E56A1] text-center">
        {children}
        <div className='mx-auto mt-[4px]'>
            <Separator className='lg:w-[200px] w-[120px] bg-[#1E56A1] mx-auto'/>
            <Separator className='lg:w-[200px] w-[120px] bg-[#1E56A1] mx-auto'/>
            <Separator className='lg:w-[200px] w-[120px] bg-[#1E56A1] mx-auto'/>
            <Separator className='lg:w-[200px] w-[120px] bg-[#1E56A1] mx-auto'/>
        </div>
      </h1>

    </>
  );
};

export default TitleNew;
