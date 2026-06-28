// Replace each activity's old stock photo with frame-0 of its own animation,
// so the loading "poster" IS the animation (no unrelated photo flash before video).
import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { execSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { randomUUID } from "node:crypto";
import sharp from "sharp";

const PROJECT = "little-roots-montessori-200ce";
const BUCKET = "little-roots-montessori-200ce.firebasestorage.app";
const OUT = "/Users/alemzukic/little-roots-app/video/out";
const TMP = "/tmp/posters";
mkdirSync(TMP, { recursive: true });

initializeApp({ credential: applicationDefault(), projectId: PROJECT, storageBucket: BUCKET });
const db = getFirestore();
const bucket = getStorage().bucket();

const pascal = (s) => s.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join("");
const fileFor = (slug) => {
  const a = `${OUT}/${slug}.mp4`, b = `${OUT}/${pascal(slug)}.mp4`;
  return existsSync(a) ? a : existsSync(b) ? b : null;
};

const upload = async (buf, dest) => {
  const token = randomUUID();
  await bucket.file(dest).save(buf, {
    contentType: "image/jpeg",
    metadata: { cacheControl: "public,max-age=31536000,immutable", metadata: { firebaseStorageDownloadTokens: token } },
  });
  return `https://firebasestorage.googleapis.com/v0/b/${BUCKET}/o/${encodeURIComponent(dest)}?alt=media&token=${token}`;
};

const snap = await db.collection("activities").get();
let ok = 0, skip = 0;
for (const doc of snap.docs) {
  const slug = doc.id;
  const mp4 = fileFor(slug);
  if (!mp4) { console.log("  (no video)", slug); skip++; continue; }
  const png = `${TMP}/${slug}.png`;
  execSync(`ffmpeg -y -loglevel error -i "${mp4}" -vframes 1 "${png}"`); // frame 0 = animation rest pose
  const full = await sharp(png).jpeg({ quality: 84, mozjpeg: true }).toBuffer();
  const thumb = await sharp(png).resize(480).jpeg({ quality: 74, mozjpeg: true }).toBuffer();
  const [imageUrl, thumbUrl] = await Promise.all([
    upload(full, `activities/${slug}.jpg`),
    upload(thumb, `activities/thumbs/${slug}.jpg`),
  ]);
  await db.collection("activities").doc(slug).update({ imageUrl, thumbUrl, updatedAt: FieldValue.serverTimestamp() });
  ok++;
  if (ok % 20 === 0) console.log(`  ${ok} posters replaced…`);
}
console.log(`DONE — ${ok} posters replaced, ${skip} skipped`);
process.exit(0);
