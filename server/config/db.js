// server/config/db.js

import mongoose from "mongoose";
import env from "./env.js";
import logger from "../utils/logger.js";

const connectDB = async () => {
  let retries = 5;

  while (retries) {
    try {
      await mongoose.connect(env.MONGO_URI);

      logger.info("MongoDB Connected");

      return;
    } catch (error) {
      retries--;

      logger.error(error.message);

      logger.warn(
        `MongoDB retrying... attempts left: ${retries}`
      );

      await new Promise((resolve) =>
        setTimeout(resolve, 5000)
      );
    }
  }

  process.exit(1);
};

export default connectDB;