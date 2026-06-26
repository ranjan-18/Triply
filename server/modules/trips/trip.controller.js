// server/modules/trips/trip.controller.js

import catchAsync from "../../utils/catchAsync.js";
import { apiResponse } from "../../utils/apiResponse.js";

import {
  createTrip,
  getUserTrips,
  getTripById,
  joinTrip,
  updateTrip,
  deleteTrip,
  leaveTrip,
  joinTripByCode, 
} from "./trip.service.js";

/**
 * Create Trip
 * @route POST /api/trips
 */
export const createTripController =
  catchAsync(async (req, res) => {
    const trip = await createTrip(
      req.body,
      req.user.id
    );

    return res.status(201).json(
      apiResponse(
        true,
        "Trip created successfully",
        trip
      )
    );
  });

/**
 * Get Logged-in User Trips
 * @route GET /api/trips
 */
export const getUserTripsController =
  catchAsync(async (req, res) => {
    const trips = await getUserTrips(
      req.user.id
    );

    return res.status(200).json(
      apiResponse(
        true,
        "Trips fetched successfully",
        trips
      )
    );
  });

/**
 * Get Single Trip
 * @route GET /api/trips/:id
 */
export const getTripByIdController =
  catchAsync(async (req, res) => {
    const trip = await getTripById(
      req.params.id
    );

    return res.status(200).json(
      apiResponse(
        true,
        "Trip fetched successfully",
        trip
      )
    );
  });

/**
 * Join Trip
 * @route POST /api/trips/:id/join
 */
export const joinTripController =
  catchAsync(async (req, res) => {
    const trip = await joinTrip(
      req.params.id,
      req.body.inviteCode,
      req.user.id
    );

    return res.status(200).json(
      apiResponse(
        true,
        "Joined trip successfully",
        trip
      )
    );
  });

/**
 * Update Trip
 * @route PATCH /api/trips/:id
 */
export const updateTripController =
  catchAsync(async (req, res) => {
    const trip = await updateTrip(
      req.params.id,
      req.body,
      req.user.id
    );

    return res.status(200).json(
      apiResponse(
        true,
        "Trip updated successfully",
        trip
      )
    );
  });

  /**
 * Delete Trip
 * @route DELETE /api/trips/:id
 */
export const deleteTripController =
  catchAsync(async (req, res) => {
    await deleteTrip(
      req.params.id,
      req.user.id
    );

    return res.status(200).json(
      apiResponse(
        true,
        "Trip deleted successfully"
      )
    );
  });

/**
 * Leave Trip
 * @route POST /api/trips/:id/leave
 */
export const leaveTripController =
  catchAsync(async (req, res) => {
    await leaveTrip(
      req.params.id,
      req.user.id
    );

    return res.status(200).json(
      apiResponse(
        true,
        "Left trip successfully"
      )
    );
  });


  /**
 * Join Trip By Code
 * @route POST /api/trips/join-by-code
 */
export const joinTripByCodeController =
  catchAsync(async (req, res) => {
    const trip =
      await joinTripByCode(
        req.body.inviteCode,
        req.user.id
      );

    return res.status(200).json(
      apiResponse(
        true,
        "Joined trip successfully",
        trip
      )
    );
  });