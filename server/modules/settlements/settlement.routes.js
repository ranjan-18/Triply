// server/modules/settlements/settlement.routes.js

import express from "express";
import authMiddleware from "../../middleware/authMiddleware.js";
import validate from "../../middleware/validate.js";
import { createSettlementSchema } from "./settlement.validation.js";
import {
  proposeSettlementController,
  approveSettlementController,
  getSettlementsController,
  getGlobalSettlementsController,
  getGlobalOptimizedSettlementsController,
} from "./settlement.controller.js";
import { upload } from "../../middleware/uploadMiddleware.js";

const router = express.Router();

/**
 * Get all Global Optimized Settlements
 */
router.get(
  "/settlements/optimize",
  authMiddleware,
  getGlobalOptimizedSettlementsController
);

/**
 * Propose a Settlement
 */
router.post(
  "/trips/:tripId/settlements",
  authMiddleware,
  upload.single("receipt"),
  validate(createSettlementSchema),
  proposeSettlementController
);

/**
 * Get all Settlements for a Trip
 */
router.get(
  "/trips/:tripId/settlements",
  authMiddleware,
  getSettlementsController
);

/**
 * Get all Global Settlements for a User
 */
router.get(
  "/",
  authMiddleware,
  getGlobalSettlementsController
);

/**
 * Approve a Settlement
 */
router.patch(
  "/settlements/:id/approve",
  authMiddleware,
  approveSettlementController
);

export default router;
