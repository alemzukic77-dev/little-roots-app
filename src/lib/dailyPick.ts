import type { Activity } from "@/types/activity";

// A stable "activity of the day": the same pick for everyone on a given calendar
// day, rotating through the catalog. No storage needed — derived from the date.

function dayNumber(): number {
  const d = new Date();
  return Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86_400_000);
}

/** Deterministic daily pick from the (title-sorted) catalog. */
export function todaysPick(activities: Activity[] | undefined): Activity | null {
  if (!activities || activities.length === 0) return null;
  return activities[dayNumber() % activities.length];
}
