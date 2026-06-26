// src/hooks/useTrip.js

import { useQuery } from "@tanstack/react-query";
import { getTripById } from "../api/tripApi";

/**
 * Query hook for fetching a single trip by ID.
 *
 * @param {string} tripId
 * @returns {UseQueryResult}
 */
export const useTrip = (tripId) => {
  return useQuery({
    queryKey: ["trip", tripId],

    queryFn: async () => {
      const response = await getTripById(tripId);
      return response.data.data;
    },

    enabled: !!tripId,
    staleTime: 30_000,
  });
};