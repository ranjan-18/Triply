// server/modules/expenses/expense.service.js

import Expense from "./expense.model.js";
import Trip from "../trips/trip.model.js";
import { calculateBalances } from "../../utils/calculateBalances.js";
import { getExchangeRate } from "../../utils/currencyService.js";
import { optimizeBalances } from "../../utils/optimizeBalances.js";
import { logAndEmitActivity } from "../activities/activity.service.js";

/**
 * Create a new expense with support for multi-currency and advanced splitting.
 */
export const createExpense = async (tripId, payload, userId) => {
  const trip = await Trip.findById(tripId);

  if (!trip) {
    const error = new Error("Trip not found");
    error.statusCode = 404;
    throw error;
  }

  const isMember = trip.members.some(
    (member) => member.userId.toString() === userId
  );

  if (!isMember) {
    const error = new Error("User is not a member of this trip");
    error.statusCode = 403;
    throw error;
  }

  if (trip.members.length < 1) {
    const error = new Error("Trip must have at least 1 member");
    error.statusCode = 400;
    throw error;
  }

  const amount = Number(payload.amount);
  const splitType = payload.splitType || "equal";
  let computedSplits = [];

  if (splitType === "equal") {
    const splitAmount = amount / trip.members.length;
    computedSplits = trip.members.map((member) => ({
      userId: member.userId,
      owedAmount: Number(splitAmount.toFixed(2)),
    }));
  } else if (splitType === "unequal") {
    if (!payload.splits || payload.splits.length === 0) {
      const err = new Error("Splits array required for unequal split");
      err.statusCode = 422;
      throw err;
    }
    const totalUnequal = payload.splits.reduce((sum, s) => sum + Number(s.value), 0);
    if (Math.abs(totalUnequal - amount) > 0.05) {
      const err = new Error(`Sum of unequal splits (${totalUnequal}) must equal total amount (${amount})`);
      err.statusCode = 422;
      throw err;
    }
    computedSplits = payload.splits.map((s) => ({
      userId: s.userId,
      owedAmount: Number(Number(s.value).toFixed(2)),
    }));
  } else if (splitType === "percentage") {
    if (!payload.splits || payload.splits.length === 0) {
      const err = new Error("Splits array required for percentage split");
      err.statusCode = 422;
      throw err;
    }
    const totalPercent = payload.splits.reduce((sum, s) => sum + Number(s.value), 0);
    if (Math.abs(totalPercent - 100) > 0.05) {
      const err = new Error(`Sum of percentages (${totalPercent}) must equal 100`);
      err.statusCode = 422;
      throw err;
    }
    computedSplits = payload.splits.map((s) => ({
      userId: s.userId,
      owedAmount: Number(((amount * Number(s.value)) / 100).toFixed(2)),
    }));
  } else if (splitType === "shares") {
    if (!payload.splits || payload.splits.length === 0) {
      const err = new Error("Splits array required for shares split");
      err.statusCode = 422;
      throw err;
    }
    const totalShares = payload.splits.reduce((sum, s) => sum + Number(s.value), 0);
    if (totalShares <= 0) {
      const err = new Error("Total shares must be greater than 0");
      err.statusCode = 422;
      throw err;
    }
    computedSplits = payload.splits.map((s) => ({
      userId: s.userId,
      owedAmount: Number(((amount * Number(s.value)) / totalShares).toFixed(2)),
    }));
  }

  const currency = payload.currency?.toUpperCase() || trip.baseCurrency || "INR";
  const date = payload.date ? new Date(payload.date) : new Date();
  
  let exchangeRate = 1;
  if (currency !== (trip.baseCurrency || "INR")) {
    exchangeRate = await getExchangeRate(currency, trip.baseCurrency || "INR", date);
  }

  const amountInBase = Number((amount * exchangeRate).toFixed(2));

  if (exchangeRate !== 1) {
    computedSplits = computedSplits.map(s => ({
      ...s,
      owedAmount: Number((s.owedAmount * exchangeRate).toFixed(2))
    }));
  }

  const expense = await Expense.create({
    tripId,
    paidBy: userId,
    title: payload.title,
    amount: amount, 
    currency: currency,
    amountInBase: amountInBase,
    exchangeRate: exchangeRate,
    date: date,
    category: payload.category || "Other",
    splitType: splitType,
    splits: computedSplits,
  });

  const populatedExpense = await Expense.findById(expense._id)
    .populate("paidBy", "name email avatar")
    .populate("splits.userId", "name avatar")
    .lean();

  // Log activity
  await logAndEmitActivity({
    tripId,
    userId,
    action: "ADDED_EXPENSE",
    message: `added an expense "${payload.title}" for ${currency} ${amount}`,
    metadata: { expenseId: expense._id, amount, currency }
  });

  return populatedExpense;
};

export const updateExpense = async (tripId, expenseId, payload, userId) => {
  const expense = await Expense.findById(expenseId);
  if (!expense) {
    const error = new Error("Expense not found");
    error.statusCode = 404;
    throw error;
  }

  const trip = await Trip.findById(tripId);
  if (!trip) {
    const error = new Error("Trip not found");
    error.statusCode = 404;
    throw error;
  }

  const isAdmin = trip.members.some(
    (member) => member.userId.toString() === userId && member.role === "admin"
  );
  const isOwner = expense.paidBy.toString() === userId;

  if (!isAdmin && !isOwner) {
    const error = new Error("Not authorized to edit this expense");
    error.statusCode = 403;
    throw error;
  }

  const amount = Number(payload.amount);
  const splitType = payload.splitType || expense.splitType;
  let computedSplits = [];

  // Re-calculate splits
  if (splitType === "equal") {
    const splitAmount = amount / trip.members.length;
    computedSplits = trip.members.map((member) => ({
      userId: member.userId,
      owedAmount: Number(splitAmount.toFixed(2)),
    }));
  } else if (splitType === "unequal" || splitType === "percentage" || splitType === "shares") {
    // Just map payload.splits directly for simplicity assuming frontend sends exact values if splitType changed
    computedSplits = payload.splits.map((s) => ({
      userId: s.userId,
      owedAmount: Number(Number(s.value).toFixed(2)),
    }));
  }

  const currency = payload.currency?.toUpperCase() || expense.currency;
  const date = payload.date ? new Date(payload.date) : expense.date;
  
  let exchangeRate = 1;
  if (currency !== (trip.baseCurrency || "INR")) {
    exchangeRate = await getExchangeRate(currency, trip.baseCurrency || "INR", date);
  }

  const amountInBase = Number((amount * exchangeRate).toFixed(2));
  
  if (exchangeRate !== 1) {
    computedSplits = computedSplits.map(s => ({
      ...s,
      owedAmount: Number((s.owedAmount * exchangeRate).toFixed(2))
    }));
  }

  expense.title = payload.title || expense.title;
  expense.amount = amount;
  expense.currency = currency;
  expense.amountInBase = amountInBase;
  expense.exchangeRate = exchangeRate;
  expense.date = date;
  expense.category = payload.category || expense.category;
  expense.splitType = splitType;
  expense.splits = computedSplits;

  await expense.save();

  const populatedExpense = await Expense.findById(expense._id)
    .populate("paidBy", "name email avatar")
    .populate("splits.userId", "name avatar")
    .lean();

  await logAndEmitActivity({
    tripId,
    userId,
    action: "EDITED_EXPENSE",
    message: `edited the expense "${expense.title}"`,
    metadata: { expenseId: expense._id, amount, currency }
  });

  return populatedExpense;
};

export const getExpenses = async (tripId, userId, page = 1) => {
  const trip = await Trip.findById(tripId);

  if (!trip) {
    const error = new Error("Trip not found");
    error.statusCode = 404;
    throw error;
  }

  const isMember = trip.members.some(
    (member) => member.userId.toString() === userId
  );

  if (!isMember) {
    const error = new Error("User is not a member of this trip");
    error.statusCode = 403;
    throw error;
  }

  const limit = 10;
  const skip = (page - 1) * limit;

  const expenses = await Expense.find({
    tripId,
    isDeleted: false,
  })
    .populate("paidBy", "name avatar")
    .populate("splits.userId", "name avatar")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  return expenses;
};

/**
 * Get all global expenses for a user across all trips.
 */
export const getGlobalExpenses = async (userId, page = 1) => {
  const limit = 20;
  const skip = (page - 1) * limit;

  const expenses = await Expense.find({
    $or: [{ paidBy: userId }, { "splits.userId": userId }],
    isDeleted: false,
  })
    .populate("tripId", "name coverImageUrl")
    .populate("paidBy", "name avatar")
    .populate("splits.userId", "name avatar")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  return expenses;
};

export const deleteExpense = async (expenseId, userId) => {
  const expense = await Expense.findById(expenseId);

  if (!expense) {
    const error = new Error("Expense not found");
    error.statusCode = 404;
    throw error;
  }

  const trip = await Trip.findById(expense.tripId);

  if (!trip) {
    const error = new Error("Trip not found");
    error.statusCode = 404;
    throw error;
  }

  const isAdmin = trip.members.some(
    (member) =>
      member.userId.toString() === userId && member.role === "admin"
  );

  const isOwner = expense.paidBy.toString() === userId;

  if (!isAdmin && !isOwner) {
    const error = new Error("Not authorized to delete this expense");
    error.statusCode = 403;
    throw error;
  }

  expense.isDeleted = true;
  await expense.save();

  // Log activity
  await logAndEmitActivity({
    tripId: expense.tripId,
    userId,
    action: "DELETED_EXPENSE",
    message: `deleted the expense "${expense.title}"`,
    metadata: { expenseId: expense._id }
  });

  return {};
};

export const getTripBalances = async (tripId) => {
  const trip = await Trip.findById(tripId)
    .populate("members.userId", "name avatar")
    .lean();

  if (!trip) {
    const error = new Error("Trip not found");
    error.statusCode = 404;
    throw error;
  }

  const expenses = await Expense.find({
    tripId,
    isDeleted: false,
  })
    .populate("paidBy", "name avatar")
    .populate("splits.userId", "name avatar")
    .lean();

  const normalizedExpenses = expenses.map(e => ({
    ...e,
    amount: e.amountInBase
  }));

  const balanceMap = calculateBalances(normalizedExpenses);

  return trip.members.map((member) => ({
    userId: member.userId._id,
    name: member.userId.name,
    avatar: member.userId.avatar,
    netBalance: Number(
      (balanceMap[member.userId._id.toString()] || 0).toFixed(2)
    ),
  }));
};

/**
 * Get the optimized peer-to-peer settlement transactions using the min-transaction algorithm.
 */
export const getOptimizedSettlements = async (tripId) => {
  const balances = await getTripBalances(tripId);
  return optimizeBalances(balances);
};
