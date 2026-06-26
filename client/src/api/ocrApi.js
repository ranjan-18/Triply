// src/api/ocrApi.js

import axiosInstance from "./axiosInstance";

export const scanReceipt = async (file) => {
  const formData = new FormData();
  formData.append("receipt", file);

  const response = await axiosInstance.post("/expenses/scan-receipt", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
