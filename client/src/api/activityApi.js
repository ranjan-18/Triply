// src/api/activityApi.js

import axiosInstance from "./axiosInstance";

export const getActivities = async (tripId, page = 1) => {
  const response = await axiosInstance.get(`/trips/${tripId}/activities?page=${page}`);
  return response.data.data;
};
