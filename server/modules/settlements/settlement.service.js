// server/modules/settlements/settlement.service.js

import Settlement from "./settlement.model.js";
import Trip from "../trips/trip.model.js";
import Expense from "../expenses/expense.model.js";
import { logAndEmitActivity } from "../activities/activity.service.js";

/**
 * Propose a new settlement (partial or full).
 */
export const proposeSettlement = async (tripId, payload, userId) => {
  const trip = await Trip.findById(tripId);

  if (!trip) {
    const error = new Error("Trip not found");
    error.statusCode = 404;
    throw error;
  }

  if (payload.paidBy !== userId) {
    const error = new Error("You can only propose settlements for yourself");
    error.statusCode = 403;
    throw error;
  }

  const settlement = await Settlement.create({
    tripId,
    paidBy: payload.paidBy,
    paidTo: payload.paidTo,
    amount: payload.amount,
    currency: payload.currency || trip.baseCurrency,
    proofImageUrl: payload.proofImageUrl,
    status: "Pending",
  });

  const populatedSettlement = await Settlement.findById(settlement._id)
    .populate("paidBy", "name avatar")
    .populate("paidTo", "name avatar")
    .lean();

  await logAndEmitActivity({
    tripId,
    userId,
    action: "PROPOSED_SETTLEMENT",
    message: `recorded a payment of ${payload.currency || trip.baseCurrency} ${payload.amount} to ${populatedSettlement.paidTo.name}`,
    metadata: { settlementId: settlement._id }
  });

  return populatedSettlement;
};

/**
 * Approve a settlement. This acts as a reverse expense.
 */
export const approveSettlement = async (settlementId, userId) => {
  const settlement = await Settlement.findById(settlementId);

  if (!settlement) {
    const error = new Error("Settlement not found");
    error.statusCode = 404;
    throw error;
  }

  if (settlement.paidTo.toString() !== userId && settlement.paidBy.toString() !== userId) {
    const error = new Error("Only the payer or receiver can approve this settlement");
    error.statusCode = 403;
    throw error;
  }

  settlement.status = "Settled";
  await settlement.save();
  
  await Expense.create({
    tripId: settlement.tripId,
    paidBy: settlement.paidBy, // Debtor
    title: "Settlement Payment",
    amount: settlement.amount,
    currency: settlement.currency,
    amountInBase: settlement.amount, 
    exchangeRate: 1,
    date: new Date(),
    category: "Other",
    splitType: "unequal",
    splits: [
      {
        userId: settlement.paidTo, // Creditor owes this amount in the ledger
        owedAmount: settlement.amount
      }
    ],
    isSettlement: true 
  });

  const populatedSettlement = await Settlement.findById(settlement._id)
    .populate("paidBy", "name avatar")
    .populate("paidTo", "name avatar")
    .lean();

  await logAndEmitActivity({
    tripId: settlement.tripId,
    userId,
    action: "APPROVED_SETTLEMENT",
    message: `approved a payment of ${settlement.currency} ${settlement.amount} from ${populatedSettlement.paidBy.name}`,
    metadata: { settlementId: settlement._id }
  });

  return populatedSettlement;
};

/**
 * Get all settlements for a trip.
 */
export const getSettlements = async (tripId) => {
  return await Settlement.find({ tripId })
    .populate("paidBy", "name avatar")
    .populate("paidTo", "name avatar")
    .sort({ createdAt: -1 })
    .lean();
};

/**
 * Get all global settlements involving a user (paidBy or paidTo) across all trips.
 */
export const getGlobalSettlements = async (userId, page = 1) => {
  const limit = 20;
  const skip = (page - 1) * limit;

  return await Settlement.find({
    $or: [{ paidBy: userId }, { paidTo: userId }]
  })
    .populate("tripId", "name coverImageUrl")
    .populate("paidBy", "name avatar")
    .populate("paidTo", "name avatar")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
};

import { getOptimizedSettlements } from "../expenses/expense.service.js";

export const getGlobalOptimizedSettlements = async (userId) => {
  // Find all trips the user is part of
  const trips = await Trip.find({
    "members.userId": userId
  }).lean();

  let globalOptimized = [];

  for (const trip of trips) {
    const optimized = await getOptimizedSettlements(trip._id);
    
    // Filter to only include settlements where user is payer or payee
    const userOptimized = optimized.filter(
      (txn) => txn.from.userId.toString() === userId || txn.to.userId.toString() === userId
    );

    userOptimized.forEach(txn => {
      globalOptimized.push({
        tripId: trip._id,
        tripName: trip.name,
        baseCurrency: trip.baseCurrency || "INR",
        transaction: txn
      });
    });
  }

  return globalOptimized;
};
