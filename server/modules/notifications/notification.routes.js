// server/modules/notifications/notification.routes.js

import express from "express";
import authMiddleware from "../../middleware/authMiddleware.js";
import {
  getNotificationsController,
  markAsReadController,
  markAllAsReadController,
} from "./notification.controller.js";

const router = express.Router();

/**
 * Get all notifications
 */
router.get("/", authMiddleware, getNotificationsController);

/**
 * Mark all as read
 */
router.patch("/read-all", authMiddleware, markAllAsReadController);

/**
 * Mark single as read
 */
router.patch("/:id/read", authMiddleware, markAsReadController);

export default router;
