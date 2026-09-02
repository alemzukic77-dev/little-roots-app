import {
  collection,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "@react-native-firebase/firestore";
import { useCallback, useEffect, useState } from "react";

import { useAuth } from "@/lib/auth";
import { db } from "@/lib/firebase";

export type Progress = { done: boolean; note: string };

/** Live "done" state + private journal note for one activity. No-ops for guests. */
export function useProgress(slug: string) {
  const { user } = useAuth();
  const [progress, setProgress] = useState<Progress>({ done: false, note: "" });

  useEffect(() => {
    if (!user) {
      setProgress({ done: false, note: "" });
      return;
    }
    return onSnapshot(doc(db, "users", user.uid, "progress", slug), (snap) => {
      const d = snap.data();
      setProgress({ done: !!d?.done, note: (d?.note as string) ?? "" });
    });
  }, [user, slug]);

  const setDone = useCallback(
    async (done: boolean) => {
      if (!user) return;
      await setDoc(
        doc(db, "users", user.uid, "progress", slug),
        { done, doneAt: done ? serverTimestamp() : null, updatedAt: serverTimestamp() },
        { merge: true },
      );
    },
    [user, slug],
  );

  const setNote = useCallback(
    async (note: string) => {
      if (!user) return;
      await setDoc(
        doc(db, "users", user.uid, "progress", slug),
        { note: note.trim().slice(0, 500), updatedAt: serverTimestamp() },
        { merge: true },
      );
    },
    [user, slug],
  );

  return { ...progress, setDone, setNote };
}

/** Count of activities marked done (for the profile stat). No-ops for guests. */
export function useDoneCount() {
  const { user } = useAuth();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!user) {
      setCount(0);
      return;
    }
    const q = query(collection(db, "users", user.uid, "progress"), where("done", "==", true));
    return onSnapshot(q, (snap) => setCount(snap.size));
  }, [user]);

  return count;
}
