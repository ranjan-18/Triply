// src/hooks/useSettlements.js

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../api/axiosInstance";
import toast from "react-hot-toast";

// 1. Fetch Optimized Settlements (Min-Transaction Algorithm)
export const useOptimizedSettlements = (tripId) => {
  return useQuery({
    queryKey: ["optimizedSettlements", tripId],
    queryFn: async () => {
      const response = await axiosInstance.get(`/trips/${tripId}/settlements/optimize`);
      return response.data.data;
    },
    enabled: !!tripId,
  });
};

// 2. Fetch All Settlements (History)
export const useSettlements = (tripId) => {
  return useQuery({
    queryKey: ["settlements", tripId],
    queryFn: async () => {
      const response = await axiosInstance.get(`/trips/${tripId}/settlements`);
      return response.data.data;
    },
    enabled: !!tripId,
  });
};

// 3. Propose a Settlement (Payment)
export const useProposeSettlement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ tripId, payload }) => {
      const response = await axiosInstance.post(
        `/trips/${tripId}/settlements`,
        payload
      );
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      toast.success("Payment proposed successfully!");
      queryClient.invalidateQueries({ queryKey: ["settlements", variables.tripId] });
      queryClient.invalidateQueries({ queryKey: ["optimizedSettlements", variables.tripId] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to propose payment");
    },
  });
};

// 4. Approve a Settlement
export const useApproveSettlement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ tripId, settlementId }) => {
      const response = await axiosInstance.patch(`/settlements/${settlementId}/approve`);
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      toast.success("Payment approved!");
      // Invalidate everything since balances changed
      queryClient.invalidateQueries({ queryKey: ["settlements", variables.tripId] });
      queryClient.invalidateQueries({ queryKey: ["optimizedSettlements", variables.tripId] });
      queryClient.invalidateQueries({ queryKey: ["balances", variables.tripId] });
      queryClient.invalidateQueries({ queryKey: ["expenses", variables.tripId] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to approve payment");
    },
  });
};
