import { useEffect, useState } from "react";

import { recordVisit } from "@/lib/streak";

/** Records today's visit once on mount and returns the current day streak. */
export function useStreak(): number {
  const [streak, setStreak] = useState(0);
  useEffect(() => {
    let alive = true;
    recordVisit().then((n) => {
      if (alive) setStreak(n);
    });
    return () => {
      alive = false;
    };
  }, []);
  return streak;
}
