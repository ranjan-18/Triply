// server/modules/activities/activity.model.js

import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    tripId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      required: true,
      enum: ["ADDED_EXPENSE", "DELETED_EXPENSE", "PROPOSED_SETTLEMENT", "APPROVED_SETTLEMENT", "JOINED_TRIP"],
    },
    message: {
      type: String,
      required: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed, // flexible object for amounts, expense names etc
    },
  },
  {
    timestamps: true,
  }
);

const Activity = mongoose.model("Activity", activitySchema);

export default Activity;
