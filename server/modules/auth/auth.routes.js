// server/modules/auth/auth.routes.js

import express from "express";

import validate from "../../middleware/validate.js";
import authMiddleware from "../../middleware/authMiddleware.js";

import {
  registerSchema,
  loginSchema,
  refreshSchema,
} from "./auth.validation.js";

import {
  register,
  login,
  refresh,
  logout,
} from "./auth.controller.js";

const router = express.Router();

/**
 * POST /api/auth/register
 */
router.post(
  "/register",
  validate(registerSchema),
  register
);

/**
 * POST /api/auth/login
 */
router.post(
  "/login",
  validate(loginSchema),
  login
);

/**
 * POST /api/auth/refresh
 */
router.post(
  "/refresh",
  validate(refreshSchema),
  refresh
);

/**
 * POST /api/auth/logout
 */
router.post(
  "/logout",
  authMiddleware,
  logout
);

export default router;