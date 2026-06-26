// src/api/friendApi.js

import axiosInstance from "./axiosInstance";

export const searchUsers = async (query) => {
  const response = await axiosInstance.get(`/friends/search?q=${query}`);
  return response.data.data;
};

export const sendFriendRequest = async (recipientId) => {
  const response = await axiosInstance.post(`/friends/request`, { recipientId });
  return response.data.data;
};

export const acceptFriendRequest = async (requestId) => {
  const response = await axiosInstance.patch(`/friends/accept/${requestId}`);
  return response.data.data;
};

export const getFriends = async () => {
  const response = await axiosInstance.get(`/friends`);
  return response.data.data;
};

export const removeFriend = async (friendId) => {
  const response = await axiosInstance.delete(`/friends/${friendId}`);
  return response.data.data;
};
