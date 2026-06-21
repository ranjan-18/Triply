import { create } from "zustand";

const useAuthStore = create((set) => ({
  user: null,

  accessToken: null,

  setAuth: (payload) =>
    set({
      user: payload.user,
      accessToken: payload.accessToken,
    }),

  clearAuth: () =>
    set({
      user: null,
      accessToken: null,
    }),
}));

export default useAuthStore;