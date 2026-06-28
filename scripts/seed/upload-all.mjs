// Batch-upload every out/<slug>.mp4 that has no videoUrl yet, in one process.
// Usage: node upload-all.mjs  (reads slugs from the video out/ dir matching activities)
import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { readFileSync, existsSync } from "node:fs";
import { randomUUID } from "node:crypto";

const PROJECT = "little-roots-montessori-200ce";
const BUCKET = "little-roots-montessori-200ce.firebasestorage.app";
const OUT = "/Users/alemzukic/little-roots-app/video/out";

initializeApp({ credential: applicationDefault(), projectId: PROJECT, storageBucket: BUCKET });
const db = getFirestore();
const bucket = getStorage().bucket();

const snap = await db.collection("activities").get();
const targets = snap.docs.filter((d) => !d.data().videoUrl).map((d) => d.id);
console.log(`${targets.length} activities without video`);

let ok = 0, skip = 0;
for (const slug of targets) {
  const path = `${OUT}/${slug}.mp4`;
  if (!existsSync(path)) { console.log("  (no file)", slug); skip++; continue; }
  const dest = `activities/videos/${slug}.mp4`;
  const token = randomUUID();
  await bucket.file(dest).save(readFileSync(path), {
    contentType: "video/mp4",
    metadata: { cacheControl: "public,max-age=31536000,immutable", metadata: { firebaseStorageDownloadTokens: token } },
  });
  const url = `https://firebasestorage.googleapis.com/v0/b/${BUCKET}/o/${encodeURIComponent(dest)}?alt=media&token=${token}`;
  await db.collection("activities").doc(slug).update({ videoUrl: url, updatedAt: FieldValue.serverTimestamp() });
  ok++;
  if (ok % 10 === 0) console.log(`  ${ok} uploaded…`);
}
console.log(`DONE — uploaded ${ok}, skipped ${skip}`);
process.exit(0);
