// server/modules/friends/friend.service.js

import Friendship from "./friend.model.js";
import User from "../auth/auth.model.js";
import { createNotification } from "../notifications/notification.service.js";
import { emitToUser } from "../../socket.js";

/**
 * Search users by email or name (excluding self and already friends/pending).
 */
export const searchUsers = async (userId, query) => {
  if (!query || query.length < 2) return [];

  const users = await User.find({
    _id: { $ne: userId },
    $or: [
      { name: { $regex: query, $options: "i" } },
      { email: { $regex: query, $options: "i" } },
    ],
  }).select("_id name email avatar");

  // Get existing friendships to filter out people we are already friends with or have pending requests
  const friendships = await Friendship.find({
    $or: [{ requester: userId }, { recipient: userId }]
  });

  const friendIds = new Set();
  friendships.forEach(f => {
    friendIds.add(f.requester.toString());
    friendIds.add(f.recipient.toString());
  });

  return users.filter(u => !friendIds.has(u._id.toString()));
};

/**
 * Send a friend request
 */
export const sendFriendRequest = async (requesterId, recipientId) => {
  if (requesterId === recipientId) {
    throw new Error("Cannot send request to yourself");
  }

  // Check if request already exists
  const existing = await Friendship.findOne({
    $or: [
      { requester: requesterId, recipient: recipientId },
      { requester: recipientId, recipient: requesterId }
    ]
  });

  if (existing) {
    throw new Error(`Friend request already ${existing.status.toLowerCase()}`);
  }

  const friendship = await Friendship.create({
    requester: requesterId,
    recipient: recipientId,
    status: "PENDING"
  });

  const requesterUser = await User.findById(requesterId);

  // Send Notification
  await createNotification({
    userId: recipientId,
    senderId: requesterId,
    type: "FRIEND_REQUEST",
    message: `${requesterUser.name} sent you a friend request`,
    link: "/dashboard/friends"
  });

  // Emit event specifically for updating the pending list
  emitToUser(recipientId, "FRIEND_REQUEST_RECEIVED", {});

  return friendship;
};

/**
 * Accept a friend request
 */
export const acceptFriendRequest = async (userId, requestId) => {
  const friendship = await Friendship.findOne({
    _id: requestId,
    recipient: userId,
    status: "PENDING"
  });

  if (!friendship) {
    throw new Error("Friend request not found or already processed");
  }

  friendship.status = "ACCEPTED";
  await friendship.save();

  const recipientUser = await User.findById(userId);

  // Notify original requester
  await createNotification({
    userId: friendship.requester,
    senderId: userId,
    type: "FRIEND_ACCEPTED",
    message: `${recipientUser.name} accepted your friend request`,
    link: "/dashboard/friends"
  });

  emitToUser(friendship.requester, "FRIEND_REQUEST_ACCEPTED", {});

  return friendship;
};

/**
 * Get all friends and pending requests for a user
 */
export const getFriendsAndRequests = async (userId) => {
  const friendships = await Friendship.find({
    $or: [{ requester: userId }, { recipient: userId }]
  }).populate("requester", "name email avatar").populate("recipient", "name email avatar");

  const friends = [];
  const pendingSent = [];
  const pendingReceived = [];

  for (const f of friendships) {
    if (f.status === "ACCEPTED") {
      // Add the OTHER user to friends array
      friends.push(f.requester._id.toString() === userId ? f.recipient : f.requester);
    } else if (f.status === "PENDING") {
      if (f.requester._id.toString() === userId) {
        pendingSent.push(f);
      } else {
        pendingReceived.push(f);
      }
    }
  }

  return { friends, pendingSent, pendingReceived };
};

/**
 * Remove a friend or cancel a request
 */
export const removeFriend = async (userId, friendId) => {
  const friendship = await Friendship.findOneAndDelete({
    $or: [
      { requester: userId, recipient: friendId },
      { requester: friendId, recipient: userId }
    ]
  });

  if (!friendship) {
    throw new Error("Friendship or request not found");
  }

  return { success: true };
};
