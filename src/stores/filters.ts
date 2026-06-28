import { create } from "zustand";

import type { Activity, CategoryId, Mess } from "@/types/activity";

export type DeckFilter = "all" | "popular" | CategoryId;

type FiltersState = {
  deckFilter: DeckFilter;
  search: string;
  ageMax: number | null; // show activities suitable for a child of this age (months)
  durationBucket: "short" | "medium" | "long" | null;
  mess: Mess | null;
  setDeckFilter: (f: DeckFilter) => void;
  setSearch: (s: string) => void;
  setAgeMax: (a: number | null) => void;
  setDurationBucket: (d: "short" | "medium" | "long" | null) => void;
  setMess: (m: Mess | null) => void;
  resetBrowse: () => void;
};

export const useFilters = create<FiltersState>((set) => ({
  deckFilter: "all",
  search: "",
  ageMax: null,
  durationBucket: null,
  mess: null,
  setDeckFilter: (deckFilter) => set({ deckFilter }),
  setSearch: (search) => set({ search }),
  setAgeMax: (ageMax) => set({ ageMax }),
  setDurationBucket: (durationBucket) => set({ durationBucket }),
  setMess: (mess) => set({ mess }),
  resetBrowse: () => set({ search: "", ageMax: null, durationBucket: null, mess: null }),
}));

export function applyDeckFilter(activities: Activity[], filter: DeckFilter): Activity[] {
  if (filter === "all") return activities;
  if (filter === "popular") {
    return [...activities]
      .sort((a, b) => b.saveCount + b.ratingSum - (a.saveCount + a.ratingSum))
      .slice(0, 20);
  }
  return activities.filter((a) => a.categoryId === filter);
}

export function matchesBrowseFilters(
  a: Activity,
  f: Pick<FiltersState, "search" | "ageMax" | "durationBucket" | "mess">,
): boolean {
  if (f.ageMax != null && a.ageMin > f.ageMax) return false;
  if (f.mess != null && a.mess !== f.mess) return false;
  if (f.durationBucket != null) {
    const ok =
      f.durationBucket === "short"
        ? a.duration < 10
        : f.durationBucket === "medium"
          ? a.duration >= 10 && a.duration <= 15
          : a.duration > 15;
    if (!ok) return false;
  }
  if (f.search.trim()) {
    const q = f.search.trim().toLowerCase();
    const haystack = `${a.title} ${a.summary} ${a.materials.join(" ")}`.toLowerCase();
    if (!haystack.includes(q)) return false;
  }
  return true;
}
