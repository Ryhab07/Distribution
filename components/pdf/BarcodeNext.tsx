import { useBarcode } from 'next-barcode';

function BarcodeNext({ barcodeData, width, height  }) {
  
  const { inputRef } = useBarcode({
    value: barcodeData, 
    options: {
        displayValue: false,
        background: '#ffffff',
        width: width,
        height: height
    }
  });

  
  
  return <canvas ref={inputRef} style={{ width: `${width}px`, height: `${height}px` }} />;
};

export default BarcodeNext;
