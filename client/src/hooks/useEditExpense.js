import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateExpense } from "../api/expenseApi";
import toast from "react-hot-toast";

export const useEditExpense = (tripId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateExpense,
    onSuccess: () => {
      // Invalidate relevant queries to trigger refetch
      if (tripId) {
        queryClient.invalidateQueries({
          queryKey: ["expenses", tripId],
        });
        queryClient.invalidateQueries({
          queryKey: ["balances", tripId],
        });
        queryClient.invalidateQueries({
          queryKey: ["settlements", tripId],
        });
      }
      queryClient.invalidateQueries({
        queryKey: ["globalExpenses"],
      });
      queryClient.invalidateQueries({
        queryKey: ["trips"],
      });

      toast.success("Expense updated successfully!");
    },
    onError: (error) => {
      console.error("Error updating expense:", error);
      toast.error(
        error.response?.data?.message || "Failed to update expense. Please try again."
      );
    },
  });
};
