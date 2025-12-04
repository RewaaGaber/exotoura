import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export const useUserStore = create(
  devtools(
    persist(
      (set, get) => ({
        // persisted state
        persistentData: null,
        // non-persistent state
        tempData: null,

        setPersistentData: (user) => set({ persistentData: user }),
        clearPersistentData: () => set({ persistentData: null }),

        setTempData: (data) => set({ tempData: data }),
        clearTempData: () => set({ tempData: null }),
      }),
      {
        name: "user-storage", // key for localStorage
        partialize: (state) => ({
          persistentData: state.persistentData, // only persist persistentData
        }),
      }
    )
  )
);
