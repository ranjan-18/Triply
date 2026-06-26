// src/components/dashboard/trip-details/ExpenseList.jsx

import { useState } from "react";
import { FaReceipt, FaPlus } from "react-icons/fa";
import { useExpenses } from "../../../hooks/useExpenses";
import { useDeleteExpense } from "../../../hooks/useDeleteExpense";
import ExpenseCard from "./ExpenseCard";
import ConfirmModal from "../../ui/ConfirmModal";
import toast from "react-hot-toast";

/**
 * Expense list panel shown on the TripDetailsPage.
 * Fetches and displays all expenses for a given trip.
 *
 * @param {{ tripId: string, onAddExpense: Function, onEditExpense: Function }} props
 */
const ExpenseList = ({ tripId, onAddExpense, onEditExpense }) => {
  const [page, setPage] = useState(1);
  const [expenseToDelete, setExpenseToDelete] = useState(null);

  const { data: expenses = [], isLoading, isError } = useExpenses(tripId, page);
  const deleteExpenseMutation = useDeleteExpense(tripId);

  const confirmDelete = () => {
    if (!expenseToDelete) return;
    deleteExpenseMutation.mutate(expenseToDelete, {
      onSuccess: () => {
        toast.success("Expense deleted");
        setExpenseToDelete(null);
      },
      onError: () => {
        toast.error("Failed to delete expense");
        setExpenseToDelete(null);
      },
    });
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-3xl p-6 shadow-sm">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-slate-100 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white rounded-3xl p-6 shadow-sm">
        <p className="text-red-500 text-center">Failed to load expenses.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900">
          Expenses
          {expenses.length > 0 && (
            <span className="ml-2 text-sm font-normal text-slate-400">
              ({expenses.length} items)
            </span>
          )}
        </h2>

        {onAddExpense && (
          <button
            onClick={onAddExpense}
            className="flex items-center gap-2 bg-violet-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-violet-700 transition"
          >
            <FaPlus className="text-xs" />
            Add Expense
          </button>
        )}
      </div>

      {/* Empty State */}
      {expenses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-slate-400">
          <FaReceipt className="text-5xl mb-4 text-slate-200" />
          <p className="text-lg font-medium text-slate-500">No expenses yet</p>
          <p className="text-sm mt-1">Add your first expense to get started!</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {expenses.map((expense) => (
              <ExpenseCard
                key={expense._id}
                expense={expense}
                onDelete={(id) => setExpenseToDelete(id)}
                onEdit={onEditExpense}
              />
            ))}
          </div>

          {/* Pagination */}
          {expenses.length === 10 && (
            <div className="flex justify-center gap-3 mt-6">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border rounded-xl text-sm disabled:opacity-40 hover:bg-slate-50 transition"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-sm text-slate-500">
                Page {page}
              </span>
              <button
                onClick={() => setPage((p) => p + 1)}
                className="px-4 py-2 border rounded-xl text-sm hover:bg-slate-50 transition"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      <ConfirmModal
        isOpen={!!expenseToDelete}
        onClose={() => setExpenseToDelete(null)}
        onCancel={() => setExpenseToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete Expense"
        message="Are you sure you want to delete this expense? This action cannot be undone."
        confirmText="Delete"
        isDestructive={true}
        isLoading={deleteExpenseMutation.isPending}
      />
    </div>
  );
};

export default ExpenseList;
