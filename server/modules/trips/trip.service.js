// server/modules/trips/trip.service.js

import { nanoid } from "nanoid";
import Trip from "./trip.model.js";
import logger from "../../utils/logger.js";
import { getCityImage } from "../../utils/cityImageService.js";

/**
 * Create a new trip.
 * The creator is automatically assigned the 'admin' role.
 *
 * @param {Object} payload - { title, destination, baseCurrency, budget }
 * @param {string} userId - ID of the user creating the trip
 * @returns {Promise<Object>} Populated trip as plain object
 */
export const createTrip = async (payload, userId) => {
  const inviteCode = nanoid(8);
  let coverImage = "";

  try {
    coverImage = await getCityImage(payload.destination);
  } catch (error) {
    logger.error(`Image fetch failed during trip creation: ${error.message}`);
  }

  const trip = await Trip.create({
    title: payload.title,
    destination: payload.destination,
    coverImage,
    baseCurrency: payload.baseCurrency || "INR",
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
    .populate("members.userId", "name email avatar")
    .lean();
};

/**
 * Get all trips the logged-in user is a member of.
 *
 * @param {string} userId - The authenticated user's ID
 * @returns {Promise<Array>} Array of trip plain objects
 */
export const getUserTrips = async (userId) => {
  const trips = await Trip.find({
    "members.userId": userId,
  })
    .populate("members.userId", "name avatar")
    .lean();

  return trips;
};

/**
 * Get a single trip by ID with populated members.
 *
 * @param {string} tripId - The trip's ID
 * @returns {Promise<Object>} Trip plain object
 */
export const getTripById = async (tripId) => {
  const trip = await Trip.findById(tripId)
    .populate("members.userId", "name email avatar")
    .lean();

  if (!trip) {
    const error = new Error("Trip not found");
    error.statusCode = 404;
    throw error;
  }

  return trip;
};

/**
 * Join a trip using its ID and a matching invite code.
 *
 * @param {string} tripId - The trip's ID
 * @param {string} inviteCode - The invite code to validate
 * @param {string} userId - The joining user's ID
 * @returns {Promise<Object>} Updated trip plain object
 */
export const joinTrip = async (tripId, inviteCode, userId) => {
  const trip = await Trip.findById(tripId);

  if (!trip) {
    const error = new Error("Trip not found");
    error.statusCode = 404;
    throw error;
  }

  if (trip.inviteCode !== inviteCode) {
    const error = new Error("Invalid invite code");
    error.statusCode = 400;
    throw error;
  }

  const alreadyMember = trip.members.some(
    (member) => member.userId.toString() === userId
  );

  if (alreadyMember) {
    const error = new Error("User already joined this trip");
    error.statusCode = 409;
    throw error;
  }

  trip.members.push({
    userId,
    role: "member",
  });

  await trip.save();

  return await Trip.findById(trip._id)
    .populate("members.userId", "name email avatar")
    .lean();
};

/**
 * Update a trip's title and/or budget. Admin only.
 *
 * @param {string} tripId - The trip's ID
 * @param {Object} payload - Fields to update: { title, destination, budget }
 * @param {string} userId - The requesting user's ID
 * @returns {Promise<Object>} Updated trip plain object
 */
export const updateTrip = async (tripId, payload, userId) => {
  const trip = await Trip.findById(tripId);

  if (!trip) {
    const error = new Error("Trip not found");
    error.statusCode = 404;
    throw error;
  }

  const adminMember = trip.members.find(
    (member) =>
      member.userId.toString() === userId && member.role === "admin"
  );

  if (!adminMember) {
    const error = new Error("Only admins can update trip");
    error.statusCode = 403;
    throw error;
  }

  if (payload.title) {
    trip.title = payload.title;
  }

  if (payload.destination) {
    trip.destination = payload.destination;
    try {
      trip.coverImage = await getCityImage(payload.destination);
    } catch (error) {
      logger.error(`Image fetch failed during trip update: ${error.message}`);
    }
  }

  if (payload.budget !== undefined) {
    trip.budget = payload.budget;
  }

  await trip.save();

  return await Trip.findById(trip._id)
    .populate("members.userId", "name email avatar")
    .lean();
};

/**
 * Delete a trip. Admin only.
 *
 * @param {string} tripId - The trip's ID
 * @param {string} userId - The requesting user's ID
 * @returns {Promise<boolean>} True on success
 */
export const deleteTrip = async (tripId, userId) => {
  const trip = await Trip.findById(tripId);

  if (!trip) {
    const error = new Error("Trip not found");
    error.statusCode = 404;
    throw error;
  }

  const adminMember = trip.members.find(
    (member) =>
      member.userId.toString() === userId && member.role === "admin"
  );

  if (!adminMember) {
    const error = new Error("Only admin can delete trip");
    error.statusCode = 403;
    throw error;
  }

  await Trip.findByIdAndDelete(tripId);

  return true;
};

/**
 * Leave a trip (remove self from members).
 *
 * @param {string} tripId - The trip's ID
 * @param {string} userId - The requesting user's ID
 * @returns {Promise<Object>} Updated trip
 */
export const leaveTrip = async (tripId, userId) => {
  const trip = await Trip.findById(tripId);

  if (!trip) {
    const error = new Error("Trip not found");
    error.statusCode = 404;
    throw error;
  }

  const memberIndex = trip.members.findIndex(
    (member) => member.userId.toString() === userId
  );

  if (memberIndex === -1) {
    const error = new Error("You are not a member of this trip");
    error.statusCode = 400;
    throw error;
  }

  trip.members.splice(memberIndex, 1);
  await trip.save();

  return trip;
};

/**
 * Join a trip directly by invite code (no tripId needed).
 *
 * @param {string} inviteCode - The 8-character invite code
 * @param {string} userId - The joining user's ID
 * @returns {Promise<Object>} Updated trip plain object
 */
export const joinTripByCode = async (inviteCode, userId) => {
  const trip = await Trip.findOne({ inviteCode });

  if (!trip) {
    const error = new Error("Invalid invite code");
    error.statusCode = 404;
    throw error;
  }

  const alreadyMember = trip.members.some(
    (member) => member.userId.toString() === userId
  );

  if (alreadyMember) {
    const error = new Error("You are already a member of this trip");
    error.statusCode = 409;
    throw error;
  }

  trip.members.push({
    userId,
    role: "member",
  });

  await trip.save();

  return await Trip.findById(trip._id)
    .populate("members.userId", "name email avatar")
    .lean();
};