// server/modules/expenses/expense.routes.js

import express from "express";

import authMiddleware from "../../middleware/authMiddleware.js";
import validate from "../../middleware/validate.js";

import { createExpenseSchema } from "./expense.validation.js";

import {
  createExpenseController,
  updateExpenseController,
  getExpensesController,
  getGlobalExpensesController,
  deleteExpenseController,
  getBalancesController,
  getOptimizedSettlementsController,
} from "./expense.controller.js";

import { scanReceiptController } from "./ocr.controller.js";
import { upload } from "../../middleware/uploadMiddleware.js";

const router = express.Router();

/**
 * Create Expense
 */
router.post(
  "/trips/:tripId/expenses",
  authMiddleware,
  validate(createExpenseSchema),
  createExpenseController
);

/**
 * Update Expense
 */
router.put(
  "/trips/:tripId/expenses/:id",
  authMiddleware,
  validate(createExpenseSchema), // Can reuse same schema for now
  updateExpenseController
);

/**
 * Scan Receipt via OCR
 */
router.post(
  "/expenses/scan-receipt",
  authMiddleware,
  upload.single("receipt"),
  scanReceiptController
);

/**
 * Get Expenses (Trip specific)
 */
router.get(
  "/trips/:tripId/expenses",
  authMiddleware,
  getExpensesController
);

/**
 * Get Global Expenses (All trips)
 */
router.get(
  "/expenses",
  authMiddleware,
  getGlobalExpensesController
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
 * Get Optimized Settlements
 */
router.get(
  "/trips/:tripId/settlements/optimize",
  authMiddleware,
  getOptimizedSettlementsController
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