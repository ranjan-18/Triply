// src/api/notificationApi.js

import axiosInstance from "./axiosInstance";

export const getNotifications = async (page = 1) => {
  const response = await axiosInstance.get(`/notifications?page=${page}`);
  return response.data.data;
};

export const markAsRead = async (id) => {
  const response = await axiosInstance.patch(`/notifications/${id}/read`);
  return response.data.data;
};

export const markAllAsRead = async () => {
  const response = await axiosInstance.patch(`/notifications/read-all`);
  return response.data.data;
};
