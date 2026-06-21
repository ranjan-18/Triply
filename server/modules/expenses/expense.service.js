// server/modules/expenses/expense.service.js

import Expense from "./expense.model.js";
import Trip from "../trips/trip.model.js";
import { calculateBalances } from "../../utils/calculateBalances.js";

/**

* Create Expense
* Equal Split Only
* @param {string} tripId
* @param {Object} payload
* @param {string} userId
* @returns {Promise<Object>}
  */
  export const createExpense = async (
  tripId,
  payload,
  userId
  ) => {
  const trip = await Trip.findById(tripId);

if (!trip) {
const error = new Error("Trip not found");
error.statusCode = 404;
throw error;
}

const isMember = trip.members.some(
(member) =>
member.userId.toString() === userId
);

if (!isMember) {
const error = new Error(
"User is not a member of this trip"
);

```
error.statusCode = 403;
throw error;
```

}

if (trip.members.length < 2) {
const error = new Error(
"At least 2 members are required to split expenses"
);

```
error.statusCode = 422;
throw error;
```

}

const splitAmount =
payload.amount / trip.members.length;

const splits = trip.members.map(
(member) => ({
userId: member.userId,
owedAmount: Number(
splitAmount.toFixed(2)
),
})
);

const expense = await Expense.create({
tripId,
paidBy: userId,
title: payload.title,
amount: payload.amount,
amountInBase: payload.amount,
exchangeRate: 1,
category: payload.category,
splitType: "equal",
splits,
});

return await Expense.findById(
expense._id
)
.populate(
"paidBy",
"name email avatar"
)
.populate(
"splits.userId",
"name avatar"
)
.lean();
};

/**

* Get Expenses
* @param {string} tripId
* @param {string} userId
* @param {number} page
* @returns {Promise<Array>}
  */
  export const getExpenses = async (
  tripId,
  userId,
  page = 1
  ) => {
  const trip = await Trip.findById(tripId);

if (!trip) {
const error = new Error("Trip not found");
error.statusCode = 404;
throw error;
}

const isMember = trip.members.some(
(member) =>
member.userId.toString() === userId
);

if (!isMember) {
const error = new Error(
"User is not a member of this trip"
);

```
error.statusCode = 403;
throw error;
```

}

const limit = 10;

const skip = (page - 1) * limit;

const expenses = await Expense.find({
tripId,
isDeleted: false,
})
.populate(
"paidBy",
"name avatar"
)
.sort({
createdAt: -1,
})
.skip(skip)
.limit(limit)
.lean();

return expenses;
};

/**

* Soft Delete Expense
* @param {string} expenseId
* @param {string} userId
* @returns {Promise<Object>}
  */
  export const deleteExpense = async (
  expenseId,
  userId
  ) => {
  const expense =
  await Expense.findById(expenseId);

if (!expense) {
const error = new Error(
"Expense not found"
);

```
error.statusCode = 404;
throw error;
```

}

const trip = await Trip.findById(
expense.tripId
);

if (!trip) {
const error = new Error(
"Trip not found"
);

```
error.statusCode = 404;
throw error;
```

}

const isAdmin = trip.members.some(
(member) =>
member.userId.toString() ===
userId &&
member.role === "admin"
);

const isOwner =
expense.paidBy.toString() ===
userId;

if (!isAdmin && !isOwner) {
const error = new Error(
"Not authorized to delete this expense"
);

```
error.statusCode = 403;
throw error;
```

}

expense.isDeleted = true;

await expense.save();

return {};
};

/**

* Get Trip Balances
* @param {string} tripId
* @returns {Promise<Array>}
  */
  export const getTripBalances = async (
  tripId
  ) => {
  const trip = await Trip.findById(
  tripId
  )
  .populate(
  "members.userId",
  "name avatar"
  )
  .lean();

if (!trip) {
const error = new Error(
"Trip not found"
);

```
error.statusCode = 404;
throw error;
```

}

const expenses = await Expense.find({
tripId,
isDeleted: false,
})
.populate(
"paidBy",
"name avatar"
)
.populate(
"splits.userId",
"name avatar"
)
.lean();

const balanceMap =
calculateBalances(expenses);

return trip.members.map((member) => ({
userId: member.userId._id,
name: member.userId.name,
avatar: member.userId.avatar,
netBalance: Number(
(
balanceMap[
member.userId._id.toString()
] || 0
).toFixed(2)
),
}));
};
