// src/components/dashboard/expenses/ExpenseItem.jsx

import { FaReceipt } from "react-icons/fa";

/**
 * Minimal single-line expense list item.
 * Used in compact views or dropdowns.
 *
 * @param {{ expense: Object }} props
 */
const ExpenseItem = ({ expense }) => {
  if (!expense) return null;

  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-100 last:border-none">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-violet-100 text-violet-600 flex items-center justify-center">
          <FaReceipt className="text-xs" />
        </div>

        <div>
          <p className="text-sm font-medium text-slate-800">{expense.title}</p>
          <p className="text-xs text-slate-400">{expense.category}</p>
        </div>
      </div>

      <p className="text-sm font-bold text-slate-700">₹{expense.amount}</p>
    </div>
  );
};

export default ExpenseItem;
