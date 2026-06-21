

import jwt from "jsonwebtoken";
import env from "../config/env.js";

/**
 * Generate Access Token
 * @param {string} userId
 * @returns {string}
 */
export const generateAccessToken = (userId) => {
  return jwt.sign(
    { userId },
    env.JWT_SECRET,
    {
      expiresIn: "15m"
    }
  );
};

/**
 * Generate Refresh Token
 * @param {string} userId
 * @returns {string}
 */
export const generateRefreshToken = (userId) => {
  return jwt.sign(
    { userId },
    env.JWT_REFRESH_SECRET,
    {
      expiresIn: "30d"
    }
  );
};