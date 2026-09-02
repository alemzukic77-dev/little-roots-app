// Surgical re-upload for ONLY the scenes whose character anatomy was fixed.
// Reads /tmp/affected-slugs.txt, and for each: uploads the fresh mp4 (new token
// => new videoUrl) and a fresh frame-0 poster (imageUrl + thumbUrl). Unaffected
// activities are left untouched so clients don't re-download the whole catalog.
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
const TMP = "/tmp/posters-fixed";
const SLUGS_FILE = "/tmp/affected-slugs.txt";
mkdirSync(TMP, { recursive: true });

const slugs = readFileSync(SLUGS_FILE, "utf8").split("\n").map((s) => s.trim()).filter(Boolean);
const wanted = new Set(slugs);

initializeApp({ credential: applicationDefault(), projectId: PROJECT, storageBucket: BUCKET });
const db = getFirestore();
const bucket = getStorage().bucket();

const save = async (buf, dest, contentType) => {
  const token = randomUUID();
  await bucket.file(dest).save(buf, {
    contentType,
    metadata: { cacheControl: "public,max-age=31536000,immutable", metadata: { firebaseStorageDownloadTokens: token } },
  });
  return `https://firebasestorage.googleapis.com/v0/b/${BUCKET}/o/${encodeURIComponent(dest)}?alt=media&token=${token}`;
};

const snap = await db.collection("activities").get();
const existingIds = new Set(snap.docs.map((d) => d.id));
let ok = 0, missingFile = 0, notInDb = 0;

for (const slug of slugs) {
  if (!existingIds.has(slug)) { console.log("  (not in Firestore)", slug); notInDb++; continue; }
  const mp4 = `${OUT}/${slug}.mp4`;
  if (!existsSync(mp4)) { console.log("  (no mp4)", slug); missingFile++; continue; }

  const videoUrl = await save(readFileSync(mp4), `activities/videos/${slug}.mp4`, "video/mp4");

  const png = `${TMP}/${slug}.png`;
  execSync(`ffmpeg -y -loglevel error -i "${mp4}" -vframes 1 "${png}"`);
  const full = await sharp(png).jpeg({ quality: 84, mozjpeg: true }).toBuffer();
  const thumb = await sharp(png).resize(480).jpeg({ quality: 74, mozjpeg: true }).toBuffer();
  const [imageUrl, thumbUrl] = await Promise.all([
    save(full, `activities/${slug}.jpg`, "image/jpeg"),
    save(thumb, `activities/thumbs/${slug}.jpg`, "image/jpeg"),
  ]);

  await db.collection("activities").doc(slug).update({
    videoUrl, imageUrl, thumbUrl, updatedAt: FieldValue.serverTimestamp(),
  });
  ok++;
  if (ok % 10 === 0) console.log(`  ${ok}/${slugs.length} uploaded…`);
}

console.log(`DONE — ${ok} updated, ${missingFile} missing mp4, ${notInDb} not in Firestore (of ${slugs.length})`);
process.exit(0);
