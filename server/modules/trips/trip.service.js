// server/modules/trips/trip.service.js

import { nanoid } from "nanoid";
import Trip from "./trip.model.js";

/**
 * Create a new trip
 * @param {Object} payload
 * @param {string} userId
 * @returns {Promise<Object>}
 */
export const createTrip = async (
  payload,
  userId
) => {
  const inviteCode = nanoid(8);

  const trip = await Trip.create({
    title: payload.title,
    baseCurrency:
      payload.baseCurrency,
    budget: payload.budget || 0,
    inviteCode,
    members: [
      {
        userId,
        role: "admin",
      },
    ],
  });

  return await Trip.findById(trip._id)
    .populate(
      "members.userId",
      "name email avatar"
    )
    .lean();
};

/**
 * Get all trips of logged-in user
 * @param {string} userId
 * @returns {Promise<Array>}
 */
export const getUserTrips = async (
  userId
) => {
  const trips = await Trip.find({
    "members.userId": userId,
  })
    .populate(
      "members.userId",
      "name avatar"
    )
    .lean();

  return trips;
};

/**
 * Get single trip details
 * @param {string} tripId
 * @returns {Promise<Object>}
 */
export const getTripById = async (
  tripId
) => {
  const trip = await Trip.findById(
    tripId
  )
    .populate(
      "members.userId",
      "name email avatar"
    )
    .lean();

  if (!trip) {
    const error = new Error(
      "Trip not found"
    );

    error.statusCode = 404;

    throw error;
  }

  return trip;
};

/**
 * Join trip using invite code
 * @param {string} tripId
 * @param {string} inviteCode
 * @param {string} userId
 * @returns {Promise<Object>}
 */
export const joinTrip = async (
  tripId,
  inviteCode,
  userId
) => {
  const trip = await Trip.findById(
    tripId
  );

  if (!trip) {
    const error = new Error(
      "Trip not found"
    );

    error.statusCode = 404;

    throw error;
  }

  if (
    trip.inviteCode !== inviteCode
  ) {
    const error = new Error(
      "Invalid invite code"
    );

    error.statusCode = 400;

    throw error;
  }

  const alreadyMember =
    trip.members.some(
      (member) =>
        member.userId.toString() ===
        userId
    );

  if (alreadyMember) {
    const error = new Error(
      "User already joined this trip"
    );

    error.statusCode = 409;

    throw error;
  }

  trip.members.push({
    userId,
    role: "member",
  });

  await trip.save();

  return await Trip.findById(trip._id)
    .populate(
      "members.userId",
      "name email avatar"
    )
    .lean();
};

/**
 * Update trip
 * Admin only
 * @param {string} tripId
 * @param {Object} payload
 * @param {string} userId
 * @returns {Promise<Object>}
 */
export const updateTrip = async (
  tripId,
  payload,
  userId
) => {
  const trip = await Trip.findById(
    tripId
  );

  if (!trip) {
    const error = new Error(
      "Trip not found"
    );

    error.statusCode = 404;

    throw error;
  }

  const adminMember =
    trip.members.find(
      (member) =>
        member.userId.toString() ===
          userId &&
        member.role === "admin"
    );

  if (!adminMember) {
    const error = new Error(
      "Only admins can update trip"
    );

    error.statusCode = 403;

    throw error;
  }

  if (payload.title) {
    trip.title = payload.title;
  }

  if (
    payload.budget !== undefined
  ) {
    trip.budget = payload.budget;
  }

  await trip.save();

  return await Trip.findById(trip._id)
    .populate(
      "members.userId",
      "name email avatar"
    )
    .lean();
};