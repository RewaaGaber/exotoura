import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export const useAuthStore = create(
  devtools(
    persist(
      (set, get) => ({
        token: null,
        refreshToken: null,
        persistLogin: true,

        setToken: (accessToken) => set({ token: accessToken }),
        setRefreshToken: (refreshToken) => set({ refreshToken }),
        setPersist: (persistLogin) => set({ persistLogin }),
      }),
      {
        name: "auth-storage",
        partialize: (state) => ({
          persistLogin: state.persistLogin,
          ...(state.persistLogin ? { refreshToken: state.refreshToken } : {}),
        }),
      }
    )
  )
);
