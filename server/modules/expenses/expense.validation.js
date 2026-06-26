// server/modules/expenses/expense.validation.js

import Joi from "joi";

/**
 * Validation schema for creating an expense.
 */
export const createExpenseSchema = Joi.object({
  title: Joi.string().min(2).max(100).required(),

  amount: Joi.number().positive().required(),

  category: Joi.string()
    .valid("Food", "Transport", "Stay", "Other")
    .default("Other"),

  date: Joi.date().optional(),

  currency: Joi.string().length(3).uppercase().default("INR").optional(),

  splitType: Joi.string()
    .valid("equal", "unequal", "percentage", "shares")
    .default("equal")
    .optional(),

  // Only required if splitType is NOT equal
  splits: Joi.array()
    .items(
      Joi.object({
        userId: Joi.string().required(),
        value: Joi.number().min(0).required(), // Can be exact amount, percentage, or share count
      })
    )
    .optional(),
});
