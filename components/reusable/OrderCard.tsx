interface OrderCardProps {
  confirmationCommande: string;
  issueDate: string;
  onDetailsClick: () => void;
}

const OrderCard = ({ confirmationCommande, issueDate, onDetailsClick }: OrderCardProps) => {
  return (
    <div className="bg-white border border-blue-200 shadow-md hover:shadow-lg transition-shadow rounded-2xl w-[300px] min-h-[160px] flex flex-col justify-between p-6">
      <div className="space-y-2">
        <p className="text-larnaBlue font-bold text-[15px] leading-snug">
          Commande N° {confirmationCommande}
        </p>
        <p className="text-gray-600 text-sm">📅 {issueDate}</p>
      </div>
      <button
        onClick={onDetailsClick}
        className="mt-4 bg-[#B2EAFC] hover:bg-devinovGreen hover:text-white text-larnaBlue font-semibold py-2 px-4 rounded-md border border-larnaBlue transition-all duration-200 ease-in-out text-sm"
      >
        Détails
      </button>
    </div>
  );
};

export default OrderCard;
