import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import axiosInstance from "../api/axiosInstance";

export const useDeleteTrip =
  () => {
    const queryClient =
      useQueryClient();

    return useMutation({
      mutationFn: (
        tripId
      ) =>
        axiosInstance.delete(
          `/trips/${tripId}`
        ),

      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["trips"],
        });
      },
    });
  };