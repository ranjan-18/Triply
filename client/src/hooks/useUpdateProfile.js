// src/hooks/useUpdateProfile.js

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../api/axiosInstance";
import useAuthStore from "../store/authStore";
import toast from "react-hot-toast";

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { setAuth, user, accessToken, refreshToken } = useAuthStore();

  return useMutation({
    mutationFn: async (payload) => {
      const response = await axiosInstance.patch("/auth/profile", payload);
      return response.data.data;
    },
    onSuccess: (updatedUser) => {
      // Update global auth store with new user data
      setAuth({ user: updatedUser, accessToken, refreshToken });
      
      // Invalidate queries that might rely on user data
      queryClient.invalidateQueries();
      toast.success("Profile updated successfully!");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to update profile");
    },
  });
};
