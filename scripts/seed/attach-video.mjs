// Attaches a rendered animation loop to an activity:
// uploads the mp4 to Storage and sets `videoUrl` on the activity doc.
// Idempotent — re-running replaces the file and URL.
//
// Usage: node attach-video.mjs <slug> <path-to-mp4>

import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { readFileSync } from "node:fs";
import { randomUUID } from "node:crypto";

const PROJECT_ID = "little-roots-montessori-200ce";
const BUCKET = "little-roots-montessori-200ce.firebasestorage.app";

const [slug, mp4Path] = process.argv.slice(2);
if (!slug || !mp4Path) {
  console.error("Usage: node attach-video.mjs <slug> <path-to-mp4>");
  process.exit(1);
}

initializeApp({ credential: applicationDefault(), projectId: PROJECT_ID, storageBucket: BUCKET });
const db = getFirestore();
const bucket = getStorage().bucket();

const docRef = db.collection("activities").doc(slug);
const snap = await docRef.get();
if (!snap.exists) {
  console.error(`Activity "${slug}" not found in Firestore.`);
  process.exit(1);
}

const dest = `activities/videos/${slug}.mp4`;
const token = randomUUID();
await bucket.file(dest).save(readFileSync(mp4Path), {
  contentType: "video/mp4",
  metadata: {
    cacheControl: "public, max-age=31536000, immutable",
    metadata: { firebaseStorageDownloadTokens: token },
  },
});
const videoUrl = `https://firebasestorage.googleapis.com/v0/b/${BUCKET}/o/${encodeURIComponent(dest)}?alt=media&token=${token}`;

await docRef.update({ videoUrl, updatedAt: FieldValue.serverTimestamp() });
console.log(`✓ ${slug} → ${videoUrl}`);
