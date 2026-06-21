// server/middleware/authMiddleware.js

import jwt from "jsonwebtoken";

import env from "../config/env.js";
import User from "../modules/auth/auth.model.js";

/**
 * Verify Access Token
 */
const authMiddleware = async (
  req,
  res,
  next
) => {
  try {
    const authHeader =
      req.headers.authorization;

    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        success: false,
        message: "Access token missing",
        data: null,
        error: "Unauthorized",
      });
    }

    const token =
      authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      env.JWT_SECRET
    );

    const user = await User.findById(
      decoded.userId
    )
      .select(
        "-passwordHash -refreshToken"
      )
      .lean();

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
        data: null,
        error: "Unauthorized",
      });
    }

    req.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message:
        "Invalid or expired token",
      data: null,
      error: error.message,
    });
  }
};

export default authMiddleware;