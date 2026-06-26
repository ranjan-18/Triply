// server/modules/notifications/notification.controller.js

import catchAsync from "../../utils/catchAsync.js";
import { apiResponse } from "../../utils/apiResponse.js";
import { getUserNotifications, markAsRead, markAllAsRead } from "./notification.service.js";

export const getNotificationsController = catchAsync(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const notifications = await getUserNotifications(req.user.id, page);

  return res.status(200).json(
    apiResponse(true, "Notifications fetched successfully", notifications)
  );
});

export const markAsReadController = catchAsync(async (req, res) => {
  const notification = await markAsRead(req.params.id, req.user.id);

  return res.status(200).json(
    apiResponse(true, "Notification marked as read", notification)
  );
});

export const markAllAsReadController = catchAsync(async (req, res) => {
  await markAllAsRead(req.user.id);

  return res.status(200).json(
    apiResponse(true, "All notifications marked as read", null)
  );
});
