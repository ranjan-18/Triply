// src/components/dashboard/expenses/ExpenseCard.jsx
// NOTE: This is the standalone version for the expenses/ folder.
// The full detailed version lives in trip-details/ExpenseCard.jsx.

import {
  FaUtensils,
  FaCar,
  FaBed,
  FaReceipt,
  FaTrash,
} from "react-icons/fa";

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

/**
 * Compact expense card for use in list views.
 *
 * @param {{ expense: Object, onDelete: Function }} props
 */
const ExpenseCard = ({ expense, onDelete }) => {
  return (
    <div className="flex items-center justify-between bg-white rounded-2xl p-4 border border-slate-100 hover:shadow-md transition-all duration-200">
      {/* Left */}
      <div className="flex items-center gap-4">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg ${
            categoryColors[expense.category] || "bg-slate-100 text-slate-500"
          }`}
        >
          {categoryIcons[expense.category] || <FaReceipt />}
        </div>

        <div>
          <h4 className="font-semibold text-slate-800">{expense.title}</h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Paid by{" "}
            <span className="font-medium text-slate-600">
              {expense.paidBy?.name}
            </span>{" "}
            · {new Date(expense.date || expense.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        <p className="font-bold text-lg text-slate-800">₹{expense.amount}</p>

        {onDelete && (
          <button
            onClick={() => onDelete(expense._id)}
            className="w-8 h-8 rounded-lg bg-red-50 text-red-400 flex items-center justify-center hover:bg-red-500 hover:text-white transition"
          >
            <FaTrash className="text-xs" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ExpenseCard;
