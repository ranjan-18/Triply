// src/hooks/useCreateExpense.js

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createExpense } from "../api/expenseApi";
import toast from "react-hot-toast";

/**
 * Mutation hook for creating a new expense.
 *
 * On success:
 *  - Invalidates the exact ["expenses", tripId] prefix → triggers ExpenseList refetch
 *  - Invalidates the exact ["balances", tripId]       → triggers BalanceSummary refetch
 *  - Invalidates ["trip", tripId]                     → triggers TripStats refetch
 *
 * @returns {UseMutationResult}
 */
export const useCreateExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ tripId, payload }) => {
      const response = await createExpense(tripId, payload);
      // Unwrap to response.data.data (the actual expense object)
      return response.data.data;
    },

    onSuccess: (_, variables) => {
      const { tripId } = variables;

      toast.success("Expense added successfully! 🎉");

      // Use exact tripId prefix so React Query matches ["expenses", tripId, page]
      queryClient.invalidateQueries({
        queryKey: ["expenses", tripId],
      });

      // Invalidate balances for this trip
      queryClient.invalidateQueries({
        queryKey: ["balances", tripId],
      });

      // Also invalidate the trip itself (member stats may change)
      queryClient.invalidateQueries({
        queryKey: ["trip", tripId],
      });
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to add expense"
      );
    },
  });
};