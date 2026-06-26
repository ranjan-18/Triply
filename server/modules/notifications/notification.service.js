// server/modules/notifications/notification.service.js

import Notification from "./notification.model.js";
import { emitToUser } from "../../socket.js";

/**
 * Create a new notification and emit a real-time event.
 */
export const createNotification = async ({ userId, senderId, type, message, link }) => {
  const notification = await Notification.create({
    userId,
    senderId,
    type,
    message,
    link,
  });

  const populated = await Notification.findById(notification._id)
    .populate("senderId", "name avatar")
    .lean();

  // Emit real-time socket event to the user's personal room
  emitToUser(userId, "NEW_NOTIFICATION", populated);

  return populated;
};

/**
 * Get all notifications for a user.
 */
export const getUserNotifications = async (userId, page = 1) => {
  const limit = 20;
  const skip = (page - 1) * limit;

  return await Notification.find({ userId })
    .populate("senderId", "name avatar")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
};

/**
 * Mark a notification as read.
 */
export const markAsRead = async (notificationId, userId) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, userId },
    { isRead: true },
    { new: true }
  );

  if (!notification) {
    const error = new Error("Notification not found");
    error.statusCode = 404;
    throw error;
  }

  return notification;
};

/**
 * Mark all notifications as read.
 */
export const markAllAsRead = async (userId) => {
  await Notification.updateMany({ userId, isRead: false }, { isRead: true });
  return { success: true };
};
