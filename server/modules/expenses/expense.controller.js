// server/modules/expenses/expense.controller.js

import catchAsync from "../../utils/catchAsync.js";
import { apiResponse } from "../../utils/apiResponse.js";

import {
  createExpense,
  updateExpense,
  getExpenses,
  getGlobalExpenses,
  deleteExpense,
  getTripBalances,
  getOptimizedSettlements,
} from "./expense.service.js";

export const updateExpenseController = catchAsync(async (req, res) => {
  const expense = await updateExpense(req.params.tripId, req.params.id, req.body, req.user.id);

  return res.status(200).json(
    apiResponse(true, "Expense updated successfully", expense)
  );
});

export const createExpenseController = catchAsync(async (req, res) => {
  const expense = await createExpense(req.params.tripId, req.body, req.user.id);

  return res.status(201).json(
    apiResponse(true, "Expense created successfully", expense)
  );
});

export const getGlobalExpensesController = catchAsync(async (req, res) => {
  const page = Number(req.query.page) || 1;

  const expenses = await getGlobalExpenses(req.user.id, page);

  return res.status(200).json(
    apiResponse(true, "Global expenses fetched successfully", expenses)
  );
});

export const getExpensesController = catchAsync(async (req, res) => {
  const page = Number(req.query.page) || 1;

  const expenses = await getExpenses(req.params.tripId, req.user.id, page);

  return res.status(200).json(
    apiResponse(true, "Expenses fetched successfully", expenses)
  );
});

export const deleteExpenseController = catchAsync(async (req, res) => {
  await deleteExpense(req.params.id, req.user.id);

  return res.status(204).send();
});

export const getBalancesController = catchAsync(async (req, res) => {
  const balances = await getTripBalances(req.params.tripId);

  return res.status(200).json(
    apiResponse(true, "Balances fetched successfully", balances)
  );
});

export const getOptimizedSettlementsController = catchAsync(async (req, res) => {
  const optimized = await getOptimizedSettlements(req.params.tripId);

  return res.status(200).json(
    apiResponse(true, "Optimized settlements fetched successfully", optimized)
  );
});
