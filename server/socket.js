// server/socket.js

import { Server } from "socket.io";
import logger from "./utils/logger.js";
import env from "./config/env.js";
import jwt from "jsonwebtoken";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: env.CLIENT_URL,
      credentials: true,
    },
  });

  // Basic authentication middleware for sockets
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error("Authentication error: No token provided"));
    }
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET);
      socket.user = decoded;
      next();
    } catch (err) {
      next(new Error("Authentication error: Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    logger.info(`Socket connected: ${socket.id} (User: ${socket.user.id})`);

    // Join a personal room for global notifications (friend requests, settlements)
    socket.join(`user_${socket.user.id}`);

    // Users join rooms based on trip IDs they are viewing
    socket.on("join_trip", (tripId) => {
      socket.join(tripId);
      logger.info(`User ${socket.user.id} joined trip room ${tripId}`);
    });

    socket.on("leave_trip", (tripId) => {
      socket.leave(tripId);
      logger.info(`User ${socket.user.id} left trip room ${tripId}`);
    });

    socket.on("disconnect", () => {
      logger.info(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};

// Expose a helper to emit events to a specific trip from anywhere in the backend
export const emitToTrip = (tripId, event, data) => {
  if (io) {
    io.to(tripId.toString()).emit(event, data);
  } else {
    logger.error("Socket.io not initialized");
  }
};

// Expose a helper to emit events to a specific user's personal room
export const emitToUser = (userId, event, data) => {
  if (io) {
    io.to(`user_${userId.toString()}`).emit(event, data);
  } else {
    logger.error("Socket.io not initialized");
  }
};
