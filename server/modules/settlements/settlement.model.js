// server/modules/settlements/settlement.model.js

import mongoose from "mongoose";

const settlementSchema = new mongoose.Schema(
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
    }, // The debtor making the payment
    paidTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // The creditor receiving the payment
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "INR",
    },
    proofImageUrl: {
      type: String, // URL of the uploaded receipt/screenshot (via Multer)
    },
    status: {
      type: String,
      enum: ["Pending", "Settled", "Rejected"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

const Settlement = mongoose.model("Settlement", settlementSchema);

export default Settlement;