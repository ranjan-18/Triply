import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import toast from "react-hot-toast";
import axiosInstance from "../api/axiosInstance";

export const useLeaveTrip = () => {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: async (
      tripId
    ) => {
      const response =
        await axiosInstance.post(
          `/trips/${tripId}/leave`
        );

      return response.data;
    },

    onSuccess: () => {
      toast.success(
        "Left trip successfully"
      );

      queryClient.invalidateQueries({
        queryKey: ["trips"],
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });
    },

    onError: (error) => {
      toast.error(
        error.response?.data
          ?.message ||
          "Failed to leave trip"
      );
    },
  });
};