// server/modules/auth/auth.controller.js

import catchAsync from "../../utils/catchAsync.js";
import { apiResponse } from "../../utils/apiResponse.js";

import {
  registerUser,
  loginUser,
  refreshTokens,
  logoutUser,
  updateProfile,
} from "./auth.service.js";

/**
 * Register User
 * @route POST /api/auth/register
 */
export const register = catchAsync(
  async (req, res) => {
    const result = await registerUser(
      req.body
    );

    return res.status(201).json(
      apiResponse(
        true,
        "User registered successfully",
        result
      )
    );
  }
);

/**
 * Login User
 * @route POST /api/auth/login
 */
export const login = catchAsync(
  async (req, res) => {
    const result = await loginUser(
      req.body
    );

    return res.status(200).json(
      apiResponse(
        true,
        "Login successful",
        result
      )
    );
  }
);

/**
 * Refresh Tokens
 * @route POST /api/auth/refresh
 */
export const refresh = catchAsync(
  async (req, res) => {
    const { refreshToken } = req.body;

    const result =
      await refreshTokens(refreshToken);

    return res.status(200).json(
      apiResponse(
        true,
        "Tokens refreshed successfully",
        result
      )
    );
  }
);

/**
 * Logout User
 * @route POST /api/auth/logout
 */
export const logout = catchAsync(
  async (req, res) => {
    await logoutUser(req.user.id);

    return res.status(200).json(
      apiResponse(
        true,
        "Logged out successfully",
        null
      )
    );
  }
);

/**
 * Update Profile
 * @route PATCH /api/auth/update-profile
 */
export const updateProfileController = catchAsync(async (req, res) => {
  const updatedUser = await updateProfile(req.user.id, req.body);

  return res.status(200).json(
    apiResponse(true, "Profile updated successfully", updatedUser)
  );
});