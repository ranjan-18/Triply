import mongoose from "mongoose";

const memberSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    role: {
      type: String,
      enum: ["admin", "member", "viewer"],
      default: "member",
    },

    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: false,
  }
);

const tripSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    baseCurrency: {
      type: String,
      required: true,
      default: "INR",
    },

    inviteCode: {
      type: String,
      required: true,
      unique: true,
    },

    budget: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["active", "finalized"],
      default: "active",
    },

    members: [memberSchema],
  },
  {
    timestamps: true,
  }
);

const Trip = mongoose.model(
  "Trip",
  tripSchema
);

export default Trip;