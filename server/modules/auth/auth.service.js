// server/modules/auth/auth.service.js

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "./auth.model.js";
import env from "../../config/env.js";

import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/jwt.js";

/**
 * Register new user
 * @param {Object} payload
 * @returns {Promise<Object>}
 */
export const registerUser = async (payload) => {
  const { name, email, password } = payload;

  const existingUser = await User.findOne({
    email: email.toLowerCase(),
  });

  if (existingUser) {
    const error = new Error(
      "User already exists with this email"
    );
    error.statusCode = 409;
    throw error;
  }

  const passwordHash = await bcrypt.hash(
    password,
    10
  );

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    passwordHash,
  });

  const accessToken = generateAccessToken(
    user._id.toString()
  );

  const refreshToken = generateRefreshToken(
    user._id.toString()
  );

  user.refreshToken = refreshToken;

  await user.save();

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    },
    accessToken,
    refreshToken,
  };
};

/**
 * Login user
 * @param {Object} payload
 * @returns {Promise<Object>}
 */
export const loginUser = async (payload) => {
  const { email, password } = payload;

  const user = await User.findOne({
    email: email.toLowerCase(),
  });

  if (!user) {
    const error = new Error(
      "Invalid email or password"
    );
    error.statusCode = 401;
    throw error;
  }

  const isPasswordValid =
    await bcrypt.compare(
      password,
      user.passwordHash
    );

  if (!isPasswordValid) {
    const error = new Error(
      "Invalid email or password"
    );
    error.statusCode = 401;
    throw error;
  }

  const accessToken = generateAccessToken(
    user._id.toString()
  );

  const refreshToken = generateRefreshToken(
    user._id.toString()
  );

  user.refreshToken = refreshToken;

  await user.save();

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    },
    accessToken,
    refreshToken,
  };
};

/**
 * Refresh access & refresh tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
export const refreshTokens = async (
  refreshToken
) => {
  try {
    const decoded = jwt.verify(
      refreshToken,
      env.JWT_REFRESH_SECRET
    );

    const user = await User.findById(
      decoded.userId
    );

    if (!user) {
      const error = new Error(
        "User not found"
      );
      error.statusCode = 404;
      throw error;
    }

    if (
      !user.refreshToken ||
      user.refreshToken !== refreshToken
    ) {
      const error = new Error(
        "Invalid refresh token"
      );
      error.statusCode = 401;
      throw error;
    }

    const newAccessToken =
      generateAccessToken(
        user._id.toString()
      );

    const newRefreshToken =
      generateRefreshToken(
        user._id.toString()
      );

    user.refreshToken = newRefreshToken;

    await user.save();

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  } catch (err) {
    const error = new Error(
      "Invalid or expired refresh token"
    );
    error.statusCode = 401;
    throw error;
  }
};

/**
 * Logout user
 * @param {string} userId
 * @returns {Promise<Object>}
 */
export const logoutUser = async (
  userId
) => {
  const user = await User.findById(userId);

  if (!user) {
    const error = new Error(
      "User not found"
    );
    error.statusCode = 404;
    throw error;
  }

  user.refreshToken = null;

  await user.save();

  return {};
};