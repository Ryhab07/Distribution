"use client";

export function PDFUpperFooter({data}) {
  console.log("data", data);
  return (
    <div className="w-full">
      <div className="flex justify-between w-full gap-10">
        <div className="p-2 bg-[#FBFBFB] border border-[#dfdfdf] mt-4 mb-10 w-[60%] h-[120px] rounded-[10px]">
          <h1 className="font-bold text-[12px]">Signature ECONEGOCE </h1>
        </div>
        <div className="p-2 bg-[#FBFBFB] border border-[#dfdfdf] mt-4 mb-10 w-[60%] h-[120px] rounded-[10px]">
          <h1 className="font-bold text-[12px]">
          Signature du CLIENT
          </h1>
        </div>
      </div>
      {/*<div className="flex justify-between w-full gap-10">
        <div className="p-2 bg-[#FBFBFB] border border-[#dfdfdf] mt-4 mb-10 w-[100%] h-[120px] rounded-[10px]">
          <h1 className="font-bold text-[12px]">OBSERVATIONS</h1>
          <p>{data?.observation}</p>
        </div>
      </div>*/}
    </div>
  );
}
