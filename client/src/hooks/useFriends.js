// src/hooks/useFriends.js

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { searchUsers, sendFriendRequest, acceptFriendRequest, getFriends, removeFriend } from "../api/friendApi";
import toast from "react-hot-toast";

export const useSearchUsers = (query) => {
  return useQuery({
    queryKey: ["users", "search", query],
    queryFn: () => searchUsers(query),
    enabled: query.length >= 2,
  });
};

export const useGetFriends = () => {
  return useQuery({
    queryKey: ["friends"],
    queryFn: getFriends,
  });
};

export const useSendFriendRequest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (recipientId) => sendFriendRequest(recipientId),
    onSuccess: () => {
      toast.success("Friend request sent!");
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      queryClient.invalidateQueries({ queryKey: ["users", "search"] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to send request");
    }
  });
};

export const useAcceptFriendRequest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (requestId) => acceptFriendRequest(requestId),
    onSuccess: () => {
      toast.success("Friend request accepted!");
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to accept request");
    }
  });
};

export const useRemoveFriend = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (friendId) => removeFriend(friendId),
    onSuccess: () => {
      toast.success("Friend removed");
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to remove friend");
    }
  });
};
