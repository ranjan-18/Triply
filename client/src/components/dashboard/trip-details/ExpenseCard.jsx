import {
  FaUtensils,
  FaCar,
  FaBed,
  FaReceipt,
  FaTrash,
  FaEdit,
} from "react-icons/fa";
import useAuthStore from "../../../store/authStore";

const categoryIcons = {
  Food: <FaUtensils />,
  Transport: <FaCar />,
  Stay: <FaBed />,
  Other: <FaReceipt />,
};

const categoryColors = {
  Food: "bg-violet-100 text-violet-600",
  Transport: "bg-emerald-100 text-emerald-600",
  Stay: "bg-blue-100 text-blue-600",
  Other: "bg-orange-100 text-orange-600",
};

const ExpenseCard = ({ expense, onEdit, onDelete }) => {
  const { user } = useAuthStore();
  
  // The user.id from JWT might be a string, and expense.paidBy._id is an object ID
  const isCreator = expense.paidBy?._id?.toString() === user?.id?.toString() || 
                    expense.paidBy?.toString() === user?.id?.toString();

  return (
    <div className="bg-white rounded-[24px] sm:rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-slate-100 flex flex-col gap-4">
      {/* Top Section: Icon, Title, Amount, Date */}
      <div className="flex justify-between items-start gap-3 sm:gap-4">
        
        <div className="flex gap-3 sm:gap-4 items-center overflow-hidden">
          {/* Category Icon */}
          <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-xl sm:text-2xl shrink-0 ${categoryColors[expense.category] || "bg-slate-100 text-slate-600"}`}>
            {categoryIcons[expense.category] || <FaReceipt />}
          </div>

          {/* Title & Category */}
          <div className="flex flex-col overflow-hidden">
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 truncate leading-tight">
              {expense.title}
            </h3>
            <p className="text-slate-500 mt-1 text-xs sm:text-sm font-semibold uppercase tracking-wider">
              {expense.category}
            </p>
          </div>
        </div>

        {/* Amount & Date */}
        <div className="text-right shrink-0">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {expense.currency || "₹"}{expense.amount}
          </h2>
          <p className="text-slate-400 mt-1 sm:mt-2 text-[10px] sm:text-sm font-bold uppercase tracking-wider">
            {new Date(expense.date).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Middle Section: Payer & Actions */}
      <div className="flex items-center justify-between mt-1 sm:mt-2">
        
        {/* Paid By Badge */}
        <div className="flex items-center gap-2 sm:gap-3 bg-slate-50/80 py-1.5 sm:py-2 px-2.5 sm:px-3 rounded-xl border border-slate-100">
          <img
            src={expense.paidBy?.avatar || `https://ui-avatars.com/api/?name=${expense.paidBy?.name}`}
            alt=""
            className="w-7 h-7 sm:w-9 sm:h-9 rounded-full border border-white shadow-sm"
          />
          <div className="flex flex-col">
            <span className="text-[9px] sm:text-[10px] text-slate-400 font-extrabold uppercase tracking-widest leading-none mb-0.5 sm:mb-1">Paid by</span>
            <span className="text-xs sm:text-sm font-bold text-slate-700 leading-none truncate max-w-[100px] sm:max-w-none">{expense.paidBy?.name}</span>
          </div>
        </div>

        {/* Actions */}
        {isCreator && (
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(expense)}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center hover:bg-violet-600 hover:text-white transition-colors border border-violet-100"
            >
              <FaEdit className="text-sm sm:text-base" />
            </button>
            <button
              onClick={() => onDelete(expense._id)}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors border border-red-100"
            >
              <FaTrash className="text-sm sm:text-base" />
            </button>
          </div>
        )}
      </div>

      {/* Bottom Summary */}
      <div className="pt-3 sm:pt-4 mt-1 sm:mt-2 border-t border-slate-100 flex justify-between items-center">
        <div className="bg-slate-50 px-3 py-1.5 rounded-lg flex items-center gap-1.5 border border-slate-100/50">
          <span className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider">Split</span>
          <span className="text-xs sm:text-sm font-black text-slate-700 capitalize">{expense.splitType}</span>
        </div>
        
        <div className="bg-slate-50 px-3 py-1.5 rounded-lg flex items-center gap-1.5 border border-slate-100/50">
          <span className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider">Members</span>
          <span className="text-xs sm:text-sm font-black text-slate-700">{expense.splits?.length || 0}</span>
        </div>
      </div>
      
    </div>
  );
};

export default ExpenseCard;