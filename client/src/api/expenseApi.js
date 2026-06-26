

import axiosInstance from "./axiosInstance";

export const createExpense = (
tripId,
payload
) =>
axiosInstance.post(
`/trips/${tripId}/expenses`,
payload
);

export const getExpenses = (
tripId,
page = 1
) =>
axiosInstance.get(
`/trips/${tripId}/expenses?page=${page}`
);

export const deleteExpense = async (expenseId) => {
  const { data } = await axiosInstance.delete(`/expenses/${expenseId}`);
  return data;
};

export const updateExpense = async ({ tripId, expenseId, payload }) => {
  const { data } = await axiosInstance.put(
    `/trips/${tripId}/expenses/${expenseId}`,
    payload
  );
  return data;
};

export const getBalances = (
tripId
) =>
axiosInstance.get(
`/trips/${tripId}/balances`
);
