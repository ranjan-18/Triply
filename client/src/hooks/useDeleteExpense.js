// src/hooks/useDeleteExpense.js

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteExpense } from "../api/expenseApi";
import toast from "react-hot-toast";

/**
 * Mutation hook for soft-deleting an expense.
 * On success: invalidates expenses and balances queries for the trip.
 *
 * @param {string} tripId - Used to invalidate the correct query keys
 * @returns {UseMutationResult}
 */
export const useDeleteExpense = (tripId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (expenseId) => {
      await deleteExpense(expenseId);
    },

    onSuccess: () => {
      toast.success("Expense deleted");
      queryClient.invalidateQueries({ queryKey: ["expenses", tripId] });
      queryClient.invalidateQueries({ queryKey: ["balances", tripId] });
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to delete expense"
      );
    },
  });
};
