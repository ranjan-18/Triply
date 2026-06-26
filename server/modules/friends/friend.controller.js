// server/modules/friends/friend.controller.js

import catchAsync from "../../utils/catchAsync.js";
import { apiResponse } from "../../utils/apiResponse.js";
import {
  searchUsers,
  sendFriendRequest,
  acceptFriendRequest,
  getFriendsAndRequests,
  removeFriend,
} from "./friend.service.js";

export const searchUsersController = catchAsync(async (req, res) => {
  const users = await searchUsers(req.user.id, req.query.q);
  return res.status(200).json(apiResponse(true, "Users found", users));
});

export const sendFriendRequestController = catchAsync(async (req, res) => {
  const request = await sendFriendRequest(req.user.id, req.body.recipientId);
  return res.status(201).json(apiResponse(true, "Friend request sent", request));
});

export const acceptFriendRequestController = catchAsync(async (req, res) => {
  const request = await acceptFriendRequest(req.user.id, req.params.id);
  return res.status(200).json(apiResponse(true, "Friend request accepted", request));
});

export const getFriendsController = catchAsync(async (req, res) => {
  const data = await getFriendsAndRequests(req.user.id);
  return res.status(200).json(apiResponse(true, "Friends fetched", data));
});

export const removeFriendController = catchAsync(async (req, res) => {
  await removeFriend(req.user.id, req.params.friendId);
  return res.status(200).json(apiResponse(true, "Friend removed", null));
});
