// server/modules/activities/activity.routes.js

import express from "express";
import authMiddleware from "../../middleware/authMiddleware.js";
import { getActivitiesController } from "./activity.controller.js";

const router = express.Router();

/**
 * Get Activity Feed for a Trip
 */
router.get(
  "/trips/:tripId/activities",
  authMiddleware,
  getActivitiesController
);

export default router;
