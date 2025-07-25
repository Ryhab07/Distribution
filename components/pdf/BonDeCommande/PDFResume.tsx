export function PDFResume({TVA, totalTTC, totalPreTax, PostDiscount, totalSales, sales }) {
  return (
    <div className="p-2 bg-[#FBFBFB] border border-[#dfdfdf]   rounded-[10px]">
      <div className="w-full flex justify-between font-bold text-[12px]">
        <p>Total EUR HT </p>
        <p>{totalPreTax} €</p>
      </div>
      <div className="w-full flex justify-between font-[400] text-[10px]">
                <p>Remise {sales}%  </p>
                <p>{totalSales} €</p>
              </div>
              <div className="w-full flex justify-between font-bold text-[12px]">
                <p>Total HT après Remise  </p>
                <p>{PostDiscount} €</p>
              </div>   
      <div className="w-full flex justify-between font-[400] text-[10px]">
        <p>TVA 20% </p>
        <p>{TVA} €</p>
      </div>
      <div className="w-full flex justify-between font-[400] text-[10px]">
        <p>Escompte sur TVA </p>
        <p>0,00 €</p>
      </div>
      <div className="w-full flex justify-between font-bold text-[12px]">
        <p>Total EUR TTC </p>
        <p>{totalTTC} €</p>
      </div>
    </div>
  );
}

