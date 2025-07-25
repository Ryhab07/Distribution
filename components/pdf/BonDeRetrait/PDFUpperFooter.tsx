"use client";

export function PDFUpperFooter() {
  return (
    <div className="w-full px-6 pt-4 text-[11px]">
      {/* Tableau Collisage & Immatriculation avec coins arrondis */}
      <div className="overflow-hidden rounded-md border border-[#ccc] mb-6">
        <table className="w-full text-left">
          <thead className="bg-[#215d74] text-white text-[12px]">
            <tr>
              <th className="py-2 px-3 w-1/2">Collisage</th>
              <th className="py-2 px-3 w-1/2">P. Immatriculation véhicule transporteur</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-white">
              <td className="py-4 px-3 border-r border-[#ccc] h-[60px] align-top" />
              <td className="py-4 px-3 h-[60px] align-top" />
            </tr>
          </tbody>
        </table>
      </div>

      {/* Signatures modernisées */}
      <div className="flex justify-between gap-4">
        {/* Signature Dépôt */}
        <div className="w-1/2 p-4 border border-[#ccc] rounded-md">
          <div className="text-[12px] font-semibold mb-2">Signature Dépôt</div>
          <div className="h-[40px] border-t border-dashed border-gray-400 mb-2" />
        </div>

        {/* Signature Client */}
        <div className="w-1/2 p-4 border border-[#ccc] rounded-md">
          <div className="text-[12px] font-semibold mb-2">Signature Client</div>
          <div className="h-[40px] border-t border-dashed border-gray-400 mb-2" />
        </div>
      </div>
    </div>
  );
}
