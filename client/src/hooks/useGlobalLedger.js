// src/hooks/useGlobalLedger.js

import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../api/axiosInstance";

export const useGlobalExpenses = (page = 1) => {
  return useQuery({
    queryKey: ["globalExpenses", page],
    queryFn: async () => {
      const response = await axiosInstance.get(`/expenses?page=${page}`);
      return response.data.data;
    },
  });
};

export const useGlobalSettlements = (page = 1) => {
  return useQuery({
    queryKey: ["globalSettlements", page],
    queryFn: async () => {
      const response = await axiosInstance.get(`/settlements?page=${page}`);
      return response.data.data;
    },
  });
};

export const useGlobalOptimizedSettlements = () => {
  return useQuery({
    queryKey: ["globalOptimizedSettlements"],
    queryFn: async () => {
      const response = await axiosInstance.get("/settlements/optimize");
      return response.data.data;
    },
  });
};
