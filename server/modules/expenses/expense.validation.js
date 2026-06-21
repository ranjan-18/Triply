// server/modules/expenses/expense.validation.js

import Joi from "joi";

export const createExpenseSchema =
  Joi.object({
    title: Joi.string()
      .min(2)
      .max(100)
      .required(),

    amount: Joi.number()
      .positive()
      .required(),

    category: Joi.string()
      .valid(
        "Food",
        "Transport",
        "Stay",
        "Other"
      )
      .required(),
  });