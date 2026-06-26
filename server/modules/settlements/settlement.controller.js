// server/modules/settlements/settlement.controller.js

import catchAsync from "../../utils/catchAsync.js";
import { apiResponse } from "../../utils/apiResponse.js";
import {
  proposeSettlement,
  approveSettlement,
  getSettlements,
  getGlobalSettlements,
  getGlobalOptimizedSettlements,
} from "./settlement.service.js";

export const proposeSettlementController = catchAsync(async (req, res) => {
  if (req.file) {
    req.body.proofImageUrl = `/uploads/${req.file.filename}`;
  }

  const settlement = await proposeSettlement(
    req.params.tripId,
    req.body,
    req.user.id
  );

  return res.status(201).json(
    apiResponse(true, "Settlement proposed successfully", settlement)
  );
});

export const approveSettlementController = catchAsync(async (req, res) => {
  const settlement = await approveSettlement(req.params.id, req.user.id);

  return res.status(200).json(
    apiResponse(true, "Settlement approved", settlement)
  );
});

export const getSettlementsController = catchAsync(async (req, res) => {
  const settlements = await getSettlements(req.params.tripId);

  return res.status(200).json(
    apiResponse(true, "Settlements fetched", settlements)
  );
});

export const getGlobalSettlementsController = catchAsync(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const settlements = await getGlobalSettlements(req.user.id, page);

  return res.status(200).json(
    apiResponse(true, "Global settlements fetched", settlements)
  );
});

export const getGlobalOptimizedSettlementsController = catchAsync(async (req, res) => {
  const optimized = await getGlobalOptimizedSettlements(req.user.id);

  return res.status(200).json(
    apiResponse(true, "Global optimized settlements fetched", optimized)
  );
});
