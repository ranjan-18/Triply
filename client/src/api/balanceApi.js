import axiosInstance from "./axiosInstance";

export const getBalances = (
  tripId
) =>
  axiosInstance.get(
    `/expenses/trip/${tripId}/balances`
  );