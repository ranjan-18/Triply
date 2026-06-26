// src/store/authStore.js

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/**
 * Zustand auth store with sessionStorage persistence.
 * This ensures that opening the app in a new tab requires signing in again,
 * as sessionStorage is isolated per tab.
 */
const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,

      /**
       * Set auth state after login / register / token refresh.
       * @param {{ user: Object, accessToken: string, refreshToken?: string }} payload
       */
      setAuth: (payload) =>
        set({
          user: payload.user,
          accessToken: payload.accessToken,
          refreshToken: payload.refreshToken ?? null,
        }),

      /**
       * Update only the access token (used during silent token refresh).
       * @param {string} accessToken
       */
      setAccessToken: (accessToken) => set({ accessToken }),

      /**
       * Clear auth state on logout.
       */
      clearAuth: () =>
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
        }),
    }),
    {
      name: "triply-auth", // sessionStorage key
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    }
  )
);

export default useAuthStore;