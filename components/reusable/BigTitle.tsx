import { ReactNode } from 'react';
import { Separator } from '../ui/separator';

interface TitleProps {
  children: ReactNode;
}

const Title: React.FC<TitleProps> = ({ children }) => {
  return (
    <>
      <h2 className="lg:text-[40px] lg:font-bold text-center text-[25px] font-semibold relative">
        {children}
        <Separator className='lg:w-[180px] w-[100px] bg-[#255D74] mx-auto'/>
        <Separator className='lg:w-[180px] w-[100px] bg-[#255D74] mx-auto'/>
        <Separator className='lg:w-[180px] w-[100px] bg-[#255D74] mx-auto'/>
        <Separator className='lg:w-[180px] w-[100px] bg-[#255D74] mx-auto'/>
        <Separator className='lg:w-[180px] w-[100px] bg-[#255D74] mx-auto'/>
        <Separator className='lg:w-[180px] w-[100px] bg-[#255D74] mx-auto'/>
      </h2>

    </>
  );
};

export default Title;
