// src/hooks/useBalances.js

import { useQuery } from "@tanstack/react-query";
import { getBalances } from "../api/expenseApi";

/**
 * Query hook for fetching net balances for all members of a trip.
 *
 * @param {string} tripId
 * @returns {UseQueryResult}
 */
export const useBalances = (tripId) => {
  return useQuery({
    queryKey: ["balances", tripId],

    queryFn: async () => {
      const response = await getBalances(tripId);
      return response.data.data;
    },

    enabled: !!tripId,
    staleTime: 0, // always refetch when invalidated
  });
};
