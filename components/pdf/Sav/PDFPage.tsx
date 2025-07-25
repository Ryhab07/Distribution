// PDFPage.tsx
import React from "react";
import { PDFBody } from "./PDFBody";
import { PDFHeader } from "./PDFHeader";
//import { PDFFooter } from "./PDFFooter";
import { PDFUpperFooter } from "./PDFUpperFooter";

interface PDFPageProps {
  type: any;
  data: any;
}

const SavPDFPage: React.FC<PDFPageProps> = ({data, type}) => {
  return (
    <div className='mb-4 flex flex-col justify-between '>
      <div className='flex flex-col flex-1'>
        <PDFHeader
          type={type}
          data={data}
        />
        <div className="p-4 h-[910px]">
        <PDFBody data={data}/>
        </div>
        
      </div>

      <div className="mt-4 p-4">
        <div className="mt-[90px]">
          <PDFUpperFooter  data={data}/>
        </div>
       {/*} <PDFFooter />*/}
      </div>
    </div>
  );
};

export default SavPDFPage;
