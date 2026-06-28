import { collection, getDocs, orderBy, query } from "@react-native-firebase/firestore";
import { useQuery } from "@tanstack/react-query";

import { db } from "@/lib/firebase";
import type { Activity, Category } from "@/types/activity";

// The whole catalog is ~134 docs — fetch once, cache for a week,
// and do all filtering/search client-side.
export function useActivities() {
  return useQuery({
    queryKey: ["activities"],
    queryFn: async (): Promise<Activity[]> => {
      const snap = await getDocs(query(collection(db, "activities"), orderBy("title")));
      return snap.docs.map((d) => d.data() as Activity);
    },
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async (): Promise<Category[]> => {
      const snap = await getDocs(query(collection(db, "categories"), orderBy("order")));
      return snap.docs.map((d) => d.data() as Category);
    },
  });
}
