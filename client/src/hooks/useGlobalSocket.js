// src/hooks/useGlobalSocket.js

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { initSocket, disconnectSocket } from "../socket/socketClient";
import useAuthStore from "../store/authStore";
import toast from "react-hot-toast";

export const useGlobalSocket = () => {
  const { token, user } = useAuthStore();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!token || !user) return;

    const socket = initSocket(token);

    // Listen for incoming global notifications (like friend requests, accepted requests, or settlements)
    socket.on("NEW_NOTIFICATION", (notification) => {
      // Invalidate the unread notifications count query if you have one, or the notifications list
      queryClient.invalidateQueries({ queryKey: ["notifications"] });

      // Show toast
      if (notification.type === "FRIEND_REQUEST") {
        toast.success(`New Friend Request: ${notification.message}`);
        queryClient.invalidateQueries({ queryKey: ["friends"] });
      } else if (notification.type === "FRIEND_ACCEPTED") {
        toast.success(notification.message);
        queryClient.invalidateQueries({ queryKey: ["friends"] });
      } else {
        toast.success(notification.message);
      }
    });

    // Listen for friend request specific signals to instantly update UI lists
    socket.on("FRIEND_REQUEST_RECEIVED", () => {
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    });

    socket.on("FRIEND_REQUEST_ACCEPTED", () => {
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    });

    return () => {
      // Don't disconnect here because other components (like LiveFeed) rely on the same socket instance
      // We just clean up the listeners
      socket.off("NEW_NOTIFICATION");
      socket.off("FRIEND_REQUEST_RECEIVED");
      socket.off("FRIEND_REQUEST_ACCEPTED");
    };
  }, [token, user, queryClient]);
};
