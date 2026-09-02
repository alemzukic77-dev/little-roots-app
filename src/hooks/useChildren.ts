import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "@react-native-firebase/firestore";
import { useCallback, useEffect, useState } from "react";

import { useAuth } from "@/lib/auth";
import { db } from "@/lib/firebase";
import { useChildStore } from "@/stores/child";

export type Child = { id: string; name: string; ageMonths: number };

/** Live list of the parent's child profiles + add/remove. No-ops for guests. */
export function useChildren() {
  const { user } = useAuth();
  const [children, setChildren] = useState<Child[]>([]);
  const setActive = useChildStore((s) => s.setActive);
  const activeId = useChildStore((s) => s.activeId);

  useEffect(() => {
    if (!user) {
      setChildren([]);
      return;
    }
    const q = query(collection(db, "users", user.uid, "children"), orderBy("createdAt"));
    return onSnapshot(q, (snap) => {
      setChildren(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Child, "id">) })));
    });
  }, [user]);

  const addChild = useCallback(
    async (name: string, ageMonths: number) => {
      if (!user) return;
      const ref = await addDoc(collection(db, "users", user.uid, "children"), {
        name: name.trim().slice(0, 30),
        ageMonths,
        createdAt: serverTimestamp(),
      });
      setActive(ref.id);
    },
    [user, setActive],
  );

  const removeChild = useCallback(
    async (id: string) => {
      if (!user) return;
      await deleteDoc(doc(db, "users", user.uid, "children", id));
      if (activeId === id) setActive(null);
    },
    [user, activeId, setActive],
  );

  return { children, addChild, removeChild, activeId, setActive };
}
