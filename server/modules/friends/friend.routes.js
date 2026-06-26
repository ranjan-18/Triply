// server/modules/friends/friend.routes.js

import express from "express";
import authMiddleware from "../../middleware/authMiddleware.js";
import {
  searchUsersController,
  sendFriendRequestController,
  acceptFriendRequestController,
  getFriendsController,
  removeFriendController,
} from "./friend.controller.js";

const router = express.Router();

router.get("/search", authMiddleware, searchUsersController);
router.post("/request", authMiddleware, sendFriendRequestController);
router.patch("/accept/:id", authMiddleware, acceptFriendRequestController);
router.get("/", authMiddleware, getFriendsController);
router.delete("/:friendId", authMiddleware, removeFriendController);

export default router;
