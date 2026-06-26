// src/hooks/useScanReceipt.js

import { useMutation } from "@tanstack/react-query";
import { scanReceipt } from "../api/ocrApi";
import toast from "react-hot-toast";

export const useScanReceipt = () => {
  return useMutation({
    mutationFn: async (file) => {
      const response = await scanReceipt(file);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Receipt scanned successfully!");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to scan receipt");
    },
  });
};
