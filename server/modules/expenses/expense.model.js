// server/modules/expenses/expense.model.js

import mongoose from "mongoose";

const splitSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    owedAmount: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    _id: false,
  }
);

const expenseSchema = new mongoose.Schema(
  {
    tripId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
      required: true,
    },

    paidBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      default: "INR",
    },

    amountInBase: {
      type: Number,
      required: true,
    },

    exchangeRate: {
      type: Number,
      default: 1,
    },

    date: {
      type: Date,
      default: Date.now,
    },

    category: {
      type: String,
      enum: [
        "Food",
        "Transport",
        "Stay",
        "Other",
      ],
      default: "Other",
    },

    splitType: {
      type: String,
      enum: [
        "equal",
        "unequal",
        "percentage",
        "shares",
      ],
      default: "equal",
    },

    splits: [splitSchema],

    isDeleted: {
      type: Boolean,
      default: false,
    },
    
    isSettlement: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Expense = mongoose.model(
  "Expense",
  expenseSchema
);

export default Expense;