// server/modules/expenses/expense.controller.js

import catchAsync from "../../utils/catchAsync.js";
import { apiResponse } from "../../utils/apiResponse.js";

import {
createExpense,
getExpenses,
deleteExpense,
getTripBalances,
} from "./expense.service.js";

/**

* Create Expense
* @route POST /api/trips/:tripId/expenses
  */
  export const createExpenseController =
  catchAsync(async (req, res) => {
  const expense =
  await createExpense(
  req.params.tripId,
  req.body,
  req.user.id
  );

  return res.status(201).json(
  apiResponse(
  true,
  "Expense created successfully",
  expense
  )
  );
  });

/**

* Get Expenses
* @route GET /api/trips/:tripId/expenses
  */
  export const getExpensesController =
  catchAsync(async (req, res) => {
  const page =
  Number(req.query.page) || 1;

  const expenses =
  await getExpenses(
  req.params.tripId,
  req.user.id,
  page
  );

  return res.status(200).json(
  apiResponse(
  true,
  "Expenses fetched successfully",
  expenses
  )
  );
  });

/**

* Delete Expense
* @route DELETE /api/expenses/:id
  */
  export const deleteExpenseController =
  catchAsync(async (req, res) => {
  await deleteExpense(
  req.params.id,
  req.user.id
  );

  return res.status(204).send();
  });

/**

* Get Trip Balances
* @route GET /api/trips/:tripId/balances
  */
  export const getBalancesController =
  catchAsync(async (req, res) => {
  const balances =
  await getTripBalances(
  req.params.tripId
  );

  return res.status(200).json(
  apiResponse(
  true,
  "Balances fetched successfully",
  balances
  )
  );
  });
  
