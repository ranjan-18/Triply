// src/hooks/useExpenses.js

import { useQuery } from "@tanstack/react-query";
import { getExpenses } from "../api/expenseApi";

/**
 * Query hook for fetching paginated expenses for a trip.
 *
 * @param {string} tripId
 * @param {number} [page=1]
 * @returns {UseQueryResult}
 */
export const useExpenses = (tripId, page = 1) => {
  return useQuery({
    queryKey: ["expenses", tripId, page],

    queryFn: async () => {
      const response = await getExpenses(tripId, page);
      return response.data.data;
    },

    enabled: !!tripId,
    staleTime: 0, // always refetch when invalidated
  });
};
