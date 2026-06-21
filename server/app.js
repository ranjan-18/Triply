// server/app.js

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import env from "./config/env.js";

import authRoutes from "./modules/auth/auth.routes.js";
import tripRoutes from "./modules/trips/trip.routes.js";
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