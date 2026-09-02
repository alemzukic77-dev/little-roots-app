import AsyncStorage from "@react-native-async-storage/async-storage";

// Local, account-free daily streak — counts consecutive days the app is opened.
// Kept on-device (works for guests too); no server needed.

const KEY = "LR_STREAK_V1";

function dayStr(d: Date): string {
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

function isYesterday(prev: string, today: Date): boolean {
  const y = new Date(today);
  y.setDate(y.getDate() - 1);
  return prev === dayStr(y);
}

/** Record today's visit and return the current streak count. */
export async function recordVisit(): Promise<number> {
  const now = new Date();
  const today = dayStr(now);
  let last: string | null = null;
  let count = 0;
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as { last: string; count: number };
      last = parsed.last;
      count = parsed.count ?? 0;
    }
  } catch {
    // ignore corrupt cache
  }

  if (last === today) {
    // already counted today
  } else if (last && isYesterday(last, now)) {
    count += 1;
  } else {
    count = 1;
  }

  try {
    await AsyncStorage.setItem(KEY, JSON.stringify({ last: today, count }));
  } catch {
    // best-effort
  }
  return count;
}
