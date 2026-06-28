import {
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from "@react-native-firebase/firestore";
import { useCallback, useEffect, useState } from "react";

import { useAuth } from "@/lib/auth";
import { db } from "@/lib/firebase";

/** The signed-in user's own rating for one activity (live) + setter. */
export function useMyRating(slug: string) {
  const { user } = useAuth();
  const [myStars, setMyStars] = useState<number | null>(null);

  useEffect(() => {
    if (!user) {
      setMyStars(null);
      return;
    }
    return onSnapshot(doc(db, "ratings", `${user.uid}_${slug}`), (snap) => {
      setMyStars(snap.exists() ? (snap.data()?.stars ?? null) : null);
    });
  }, [user, slug]);

  const rate = useCallback(
    async (stars: number) => {
      if (!user) return;
      const ref = doc(db, "ratings", `${user.uid}_${slug}`);
      if (myStars === stars) {
        // tapping the same star again clears the rating
        setMyStars(null);
        await deleteDoc(ref);
      } else {
        setMyStars(stars); // optimistic
        await setDoc(ref, {
          uid: user.uid,
          slug,
          stars,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
    },
    [user, slug, myStars],
  );

  return { myStars, rate };
}
