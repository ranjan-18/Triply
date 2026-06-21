// server/modules/expenses/expense.routes.js

import express from "express";

import authMiddleware from "../../middleware/authMiddleware.js";
import validate from "../../middleware/validate.js";

import {
  createExpenseSchema,
} from "./expense.validation.js";

import {
  createExpenseController,
  getExpensesController,
  deleteExpenseController,
  getBalancesController,
} from "./expense.controller.js";

const router =
  express.Router();

/**
 * Create Expense
 */
router.post(
  "/trips/:tripId/expenses",
  authMiddleware,
  validate(
    createExpenseSchema
  ),
  createExpenseController
);

/**
 * Get Expenses
 */
router.get(
  "/trips/:tripId/expenses",
  authMiddleware,
  getExpensesController
);

/**
 * Get Balances
 */
router.get(
  "/trips/:tripId/balances",
  authMiddleware,
  getBalancesController
);

/**
 * Delete Expense
 */
router.delete(
  "/expenses/:id",
  authMiddleware,
  deleteExpenseController
);

export default router;