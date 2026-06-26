// server/server.js

import http from "http";
import app from "./app.js";
import env from "./config/env.js";
import connectDB from "./config/db.js";
import logger from "./utils/logger.js";
import { initSocket } from "./socket.js";

/**
 * Start Server
 */
const startServer = async () => {
  try {
    await connectDB();

    // Create HTTP server from the Express app
    const server = http.createServer(app);

    // Initialize Socket.io
    initSocket(server);

    // Listen using the HTTP server instead of the Express app
    server.listen(env.PORT, () => {
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