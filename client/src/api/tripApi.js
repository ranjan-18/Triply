// src/api/tripApi.js

import axiosInstance from "./axiosInstance";

/**
 * Get all trips
 */
export const getTrips = async () => {
  const response = await axiosInstance.get(
    "/trips"
  );

  return response;
};

/**
 * Get single trip
 */
export const getTripById = async (
  tripId
) => {
  const response =
    await axiosInstance.get(
      `/trips/${tripId}`
    );

  return response;
};

/**
 * Create trip
 */
export const createTrip = async (
  payload
) => {
  const response =
    await axiosInstance.post(
      "/trips",
      payload
    );

  return response;
};

/**
 * Update trip
 */
export const updateTrip = async (
  tripId,
  payload
) => {
  const response =
    await axiosInstance.patch(
      `/trips/${tripId}`,
      payload
    );

  return response;
};

/**
 * Delete trip
 */
export const deleteTrip = async (
  tripId
) => {
  const response =
    await axiosInstance.delete(
      `/trips/${tripId}`
    );

  return response;
};

/**
 * Leave trip
 */
export const leaveTrip = async (
  tripId
) => {
  const response =
    await axiosInstance.post(
      `/trips/${tripId}/leave`
    );

  return response;
};

/**
 * Join trip by invite code
 */
export const joinTripByCode =
  async (inviteCode) => {
    const response =
      await axiosInstance.post(
        "/trips/join-by-code",
        {
          inviteCode,
        }
      );

    return response;
  };