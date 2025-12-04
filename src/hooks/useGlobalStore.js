import { create } from "zustand";

export const useGlobalStore = create((set, get) => ({
  toast: null,

  setToast: (ref) => set({ toast: ref }),
}));
