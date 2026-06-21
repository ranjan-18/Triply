// server/modules/trips/trip.routes.js

import express from "express";

import authMiddleware from "../../middleware/authMiddleware.js";
import validate from "../../middleware/validate.js";

import {
  createTripSchema,
  joinTripSchema,
  updateTripSchema,
} from "./trip.validation.js";

import {
  createTripController,
  getUserTripsController,
  getTripByIdController,
  joinTripController,
  updateTripController,
} from "./trip.controller.js";

const router = express.Router();

/**
 * Create Trip
 * POST /api/trips
 */
router.post(
  "/",
  authMiddleware,
  validate(createTripSchema),
  createTripController
);

/**
 * Get User Trips
 * GET /api/trips
 */
router.get(
  "/",
  authMiddleware,
  getUserTripsController
);

/**
 * Get Single Trip
 * GET /api/trips/:id
 */
router.get(
  "/:id",
  authMiddleware,
  getTripByIdController
);

/**
 * Join Trip
 * POST /api/trips/:id/join
 */
router.post(
  "/:id/join",
  authMiddleware,
  validate(joinTripSchema),
  joinTripController
);

/**
 * Update Trip
 * PATCH /api/trips/:id
 */
router.patch(
  "/:id",
  authMiddleware,
  validate(updateTripSchema),
  updateTripController
);

export default router;