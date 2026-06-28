import { doc, getDoc, onSnapshot } from "@react-native-firebase/firestore";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { useActivities } from "@/hooks/useActivities";
import { db } from "@/lib/firebase";
import type { Activity } from "@/types/activity";

/**
 * One activity by slug. The live catalog query is the source of truth
 * (a separate per-slug cache went stale after doc updates); the direct
 * doc fetch only covers cold deep-link opens before the catalog arrives.
 */
export function useActivity(slug: string) {
  const { data: catalog } = useActivities();
  const fromCatalog = catalog?.find((a) => a.slug === slug);

  const single = useQuery({
    queryKey: ["activity", slug],
    enabled: !fromCatalog,
    queryFn: async (): Promise<Activity> => {
      const snap = await getDoc(doc(db, "activities", slug));
      if (!snap.exists()) throw new Error("Activity not found");
      return snap.data() as Activity;
    },
  });

  return fromCatalog
    ? { data: fromCatalog, isPending: false }
    : { data: single.data, isPending: single.isPending };
}

/** Live aggregate rating for the detail screen (updates as others rate). */
export function useLiveAggregates(slug: string) {
  const [agg, setAgg] = useState<{ avgRating: number; ratingCount: number } | null>(null);

  useEffect(() => {
    return onSnapshot(doc(db, "activities", slug), (snap) => {
      if (snap.exists()) {
        const d = snap.data()!;
        setAgg({ avgRating: d.avgRating ?? 0, ratingCount: d.ratingCount ?? 0 });
      }
    });
  }, [slug]);

  return agg;
}
