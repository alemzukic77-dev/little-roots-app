import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

// Which child profile is currently "active" — its age auto-tunes the age filter.
// Persisted locally so the choice survives app restarts.

const KEY = "LR_ACTIVE_CHILD_V1";

type ChildState = {
  activeId: string | null;
  setActive: (id: string | null) => void;
  hydrate: () => Promise<void>;
};

export const useChildStore = create<ChildState>((set) => ({
  activeId: null,
  setActive: (activeId) => {
    set({ activeId });
    void AsyncStorage.setItem(KEY, activeId ?? "");
  },
  hydrate: async () => {
    try {
      const v = await AsyncStorage.getItem(KEY);
      if (v) set({ activeId: v });
    } catch {
      // ignore
    }
  },
}));
