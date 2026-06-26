// src/hooks/useUpdateTrip.js

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../api/axiosInstance";
import toast from "react-hot-toast";

export const useUpdateTrip = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ tripId, payload }) => {
      const response = await axiosInstance.patch(`/trips/${tripId}`, payload);
      return response.data;
    },

    onSuccess: () => {
      toast.success("Trip updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["trips"],
      });
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to update trip"
      );
    },
  });
};