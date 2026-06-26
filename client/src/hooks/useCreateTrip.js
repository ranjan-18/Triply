// src/hooks/useCreateTrip.js

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTrip } from "../api/tripApi";
import toast from "react-hot-toast";

/**
 * Mutation hook for creating a new trip.
 * On success: invalidates the trips query so the list refreshes automatically.
 *
 * @returns {UseMutationResult}
 */
export const useCreateTrip = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const response = await createTrip(payload);
      return response.data.data;
    },

    onSuccess: () => {
      toast.success("Trip created successfully! 🎉");
      queryClient.invalidateQueries({ queryKey: ["trips"] });
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to create trip"
      );
    },
  });
};