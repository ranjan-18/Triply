// server/modules/activities/activity.service.js

import Activity from "./activity.model.js";
import { emitToTrip } from "../../socket.js";

/**
 * Log an activity to the database and emit it via Socket.io to the trip room.
 */
export const logAndEmitActivity = async ({ tripId, userId, action, message, metadata = {} }) => {
  try {
    const activity = await Activity.create({
      tripId,
      userId,
      action,
      message,
      metadata,
    });

    const populatedActivity = await Activity.findById(activity._id)
      .populate("userId", "name avatar")
      .lean();

    // Emit to connected clients in the trip room
    emitToTrip(tripId, "NEW_ACTIVITY", populatedActivity);
    
    // Also emit a general update trigger so clients know to invalidate queries
    emitToTrip(tripId, "TRIP_UPDATED", { action, message });

    return populatedActivity;
  } catch (error) {
    console.error("Failed to log activity:", error);
    // Don't throw, we don't want to break the main transaction if activity logging fails
  }
};

/**
 * Get paginated activity feed for a trip.
 */
export const getActivities = async (tripId, page = 1) => {
  const limit = 20;
  const skip = (page - 1) * limit;

  return await Activity.find({ tripId })
    .populate("userId", "name avatar")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
};
