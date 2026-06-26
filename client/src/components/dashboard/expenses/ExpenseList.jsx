// src/components/dashboard/expenses/ExpenseList.jsx
// Wrapper component — delegates to trip-details ExpenseList or renders standalone.

import { useExpenses } from "../../../hooks/useExpenses";
import ExpenseCard from "./ExpenseCard";
import { useDeleteExpense } from "../../../hooks/useDeleteExpense";
import { FaReceipt } from "react-icons/fa";

/**
 * Standalone expense list used outside of trip-details context.
 *
 * @param {{ tripId: string }} props
 */
const ExpenseList = ({ tripId }) => {
  const { data: expenses = [], isLoading } = useExpenses(tripId);
  const deleteExpenseMutation = useDeleteExpense(tripId);

  if (isLoading) {
    return (
      <div className="space-y-3 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-slate-100 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="flex flex-col items-center py-10 text-slate-400">
        <FaReceipt className="text-4xl mb-3 text-slate-200" />
        <p className="text-sm">No expenses yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {expenses.map((expense) => (
        <ExpenseCard
          key={expense._id}
          expense={expense}
          onDelete={(id) => deleteExpenseMutation.mutate(id)}
        />
      ))}
    </div>
  );
};

export default ExpenseList;
