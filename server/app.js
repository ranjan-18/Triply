// server/app.js

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import env from "./config/env.js";

import authRoutes from "./modules/auth/auth.routes.js";
import tripRoutes from "./modules/trips/trip.routes.js";
import expenseRoutes from "./modules/expenses/expense.routes.js";
import settlementRoutes from "./modules/settlements/settlement.routes.js";
import activityRoutes from "./modules/activities/activity.routes.js";
import notificationRoutes from "./modules/notifications/notification.routes.js";
import friendRoutes from "./modules/friends/friend.routes.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();

/**
 * Security Middleware
 */
app.use(helmet());

/**
 * CORS Configuration
 */
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  })
);

/**
 * Request Logger
 */
app.use(morgan("dev"));

/**
 * Body Parsers
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


/**
 * Serve Uploads Statically
 */
import path from "path";
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

/**
 * Health Check Route
 */
app.get("/health", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Triply API is running",
    data: null,
    error: null,
  });
});

/**
 * API Routes
 */
app.use("/api/auth", authRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api", expenseRoutes);
app.use("/api", settlementRoutes);
app.use("/api", activityRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/friends", friendRoutes);

/**
 * 404 Handler
 */
/**
 * 404 Handler
 */
app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: "Route not found",
    data: null,
    error: "Not Found",
  });
});

/**
 * Global Error Handler
 * Must be last middleware
 */
app.use(errorHandler);

export default app;