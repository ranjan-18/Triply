// server/server.js

import app from "./app.js";
import env from "./config/env.js";
import connectDB from "./config/db.js";
import logger from "./utils/logger.js";

/**
 * Start Server
 */
const startServer = async () => {
  try {
    await connectDB();

    app.listen(env.PORT, () => {
      logger.info(
        `🚀 Server running on port ${env.PORT}`
      );
    });
  } catch (error) {
    logger.error(error.message);
    process.exit(1);
  }
};

startServer();