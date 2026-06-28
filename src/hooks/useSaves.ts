import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from "@react-native-firebase/firestore";
import { useCallback, useEffect, useState } from "react";

import { useAuth } from "@/lib/auth";
import { db } from "@/lib/firebase";

/** Live set of the signed-in user's saved activity slugs + toggle. */
export function useSaves() {
  const { user } = useAuth();
  const [slugs, setSlugs] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!user) {
      setSlugs(new Set());
      return;
    }
    return onSnapshot(collection(db, "users", user.uid, "saves"), (snap) => {
      setSlugs(new Set(snap.docs.map((d) => d.id)));
    });
  }, [user]);

  const toggleSave = useCallback(
    async (slug: string) => {
      if (!user) return;
      const ref = doc(db, "users", user.uid, "saves", slug);
      if (slugs.has(slug)) {
        await deleteDoc(ref);
      } else {
        await setDoc(ref, { slug, createdAt: serverTimestamp() });
      }
    },
    [user, slugs],
  );

  return { savedSlugs: slugs, toggleSave };
}
