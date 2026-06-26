// src/hooks/useTrips.js

import { useQuery } from "@tanstack/react-query";
import { getTrips } from "../api/tripApi";

/**
 * Query hook for fetching all trips of the logged-in user.
 *
 * @returns {UseQueryResult}
 */
export const useTrips = () => {
  return useQuery({
    queryKey: ["trips"],

    queryFn: async () => {
      const response = await getTrips();
      return response.data.data;
    },

    retry: 1,
    staleTime: 30_000, // 30 seconds
  });
};