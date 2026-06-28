import { initializeApp } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import { onDocumentWritten } from "firebase-functions/v2/firestore";
import { onCall, HttpsError } from "firebase-functions/v2/https";

initializeApp();
const db = getFirestore();

// Keeps activities/{slug} rating aggregates server-authoritative.
export const onRatingWritten = onDocumentWritten("ratings/{ratingId}", async (event) => {
  const before = event.data.before.exists ? event.data.before.data() : null;
  const after = event.data.after.exists ? event.data.after.data() : null;

  const slug = (after ?? before).slug;
  let dSum = 0;
  let dCount = 0;
  if (!before && after) {
    dSum = after.stars;
    dCount = 1;
  } else if (before && after) {
    dSum = after.stars - before.stars;
  } else if (before && !after) {
    dSum = -before.stars;
    dCount = -1;
  }
  if (dSum === 0 && dCount === 0) return;

  const ref = db.collection("activities").doc(slug);
  await db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists) return;
    const count = (snap.data().ratingCount ?? 0) + dCount;
    const sum = (snap.data().ratingSum ?? 0) + dSum;
    tx.update(ref, {
      ratingCount: count,
      ratingSum: sum,
      avgRating: count > 0 ? Math.round((sum / count) * 10) / 10 : 0,
    });
  });
});

export const onSaveWritten = onDocumentWritten("users/{uid}/saves/{slug}", async (event) => {
  const created = !event.data.before.exists && event.data.after.exists;
  const deleted = event.data.before.exists && !event.data.after.exists;
  if (!created && !deleted) return;

  await db
    .collection("activities")
    .doc(event.params.slug)
    .update({ saveCount: FieldValue.increment(created ? 1 : -1) })
    .catch(() => {}); // activity may have been removed from the catalog
});

// Account deletion (App Store guideline 5.1.1(v)) — removes all user data, then the auth user.
export const deleteAccount = onCall(async (request) => {
  const uid = request.auth?.uid;
  if (!uid) throw new HttpsError("unauthenticated", "Sign in required.");

  const userRef = db.collection("users").doc(uid);

  // Delete ratings (their triggers will decrement aggregates)
  const ratings = await db.collection("ratings").where("uid", "==", uid).get();
  for (const doc of ratings.docs) await doc.ref.delete();

  // Delete saves subcollection + profile
  await db.recursiveDelete(userRef);

  await getAuth().deleteUser(uid);
  return { ok: true };
});
