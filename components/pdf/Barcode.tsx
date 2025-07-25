import React from "react";
//import Barcode from "react-barcode";
import BarcodeNext from "./BarcodeNext";

interface Props {
  barcodeData: string;
}

const BarcodeComponent: React.FC<Props> = ({ barcodeData }) => {

    console.log("accessed")
  return (
    <div>

      <BarcodeNext barcodeData={barcodeData} width={200} height={80} />
    </div>
  );
};

export default BarcodeComponent;
