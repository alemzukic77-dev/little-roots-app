import { Share } from "react-native";

import type { Activity } from "@/types/activity";

// No public web catalog yet, so we share the activity as a plain text tip
// rather than linking to a page that doesn't exist.
export async function shareActivity(activity: Activity) {
  const message = `Try "${activity.title}" with your little one — a ${activity.duration}-min ${activity.category.toLowerCase()} activity from Little Roots 🌱`;
  await Share.share({ message }).catch(() => {}); // user dismissed the sheet — nothing to handle
}
