import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import toast from "react-hot-toast";
import { joinTripByCode } from "../api/tripApi";

export const useJoinTrip = () => {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: joinTripByCode,

    onSuccess: () => {
      toast.success(
        "Joined successfully"
      );

      queryClient.invalidateQueries({
        queryKey: ["trips"],
      });
    },

    onError: (error) => {
      toast.error(
        error.response?.data?.message
      );
    },
  });
};