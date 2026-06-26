// src/socket/socketClient.js

import { io } from "socket.io-client";

const API_URL = import.meta.env.VITE_API_URL;
const SOCKET_URL = API_URL.replace("/api", "");

let socket = null;

export const initSocket = (token) => {
  if (socket) return socket;

  socket = io(SOCKET_URL, {
    auth: { token },
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
