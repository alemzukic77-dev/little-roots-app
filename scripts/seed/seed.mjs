// Seed script: migrates activities.json + images into Firebase (Firestore + Storage).
// Idempotent — re-running overwrites docs/files keyed by slug.
// Auth: Application Default Credentials (gcloud auth application-default login).
//
// Usage: node seed.mjs [--dry-run]

import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const PROJECT_ID = "little-roots-montessori-200ce";
const BUCKET = "little-roots-montessori-200ce.firebasestorage.app";
const DRY_RUN = process.argv.includes("--dry-run");

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const activities = JSON.parse(readFileSync(path.join(__dirname, "activities.json"), "utf8"));

initializeApp({
  credential: applicationDefault(),
  projectId: PROJECT_ID,
  storageBucket: BUCKET,
});

const db = getFirestore();
const bucket = getStorage().bucket();

const categoryIds = {
  "Fine Motor": "fine-motor",
  "Sensory": "sensory",
  "Creativity": "creativity",
  "Practical Life": "practical-life",
  "Language": "language",
  "Physical": "physical",
};

async function uploadImage(localPath, destPath, width, quality) {
  const buffer = await sharp(localPath)
    .rotate() // respect EXIF orientation
    .resize({ width, withoutEnlargement: true })
    .jpeg({ quality, mozjpeg: true })
    .toBuffer();
  const token = randomUUID();
  const file = bucket.file(destPath);
  await file.save(buffer, {
    contentType: "image/jpeg",
    metadata: {
      cacheControl: "public, max-age=31536000, immutable",
      metadata: { firebaseStorageDownloadTokens: token },
    },
  });
  return `https://firebasestorage.googleapis.com/v0/b/${BUCKET}/o/${encodeURIComponent(destPath)}?alt=media&token=${token}`;
}

async function main() {
  console.log(`Seeding ${activities.length} activities → ${PROJECT_ID}${DRY_RUN ? " (DRY RUN)" : ""}`);

  // 1. Category images
  const catDir = path.join(__dirname, "assets/categories");
  const catImageUrls = {};
  for (const file of readdirSync(catDir)) {
    // cat-fine-motor.jpg → fine-motor (cat-practical.jpg → practical-life)
    let id = file.replace(/^cat-/, "").replace(/\.jpg$/, "");
    if (id === "practical") id = "practical-life";
    if (DRY_RUN) { catImageUrls[id] = "dry://"; continue; }
    catImageUrls[id] = await uploadImage(path.join(catDir, file), `categories/${id}.jpg`, 1200, 80);
    console.log(`  category image: ${id}`);
  }

  // 2. Category docs (ordered, drives the filter pills + browse screen)
  const catOrder = Object.values(categoryIds);
  if (!DRY_RUN) {
    const batch = db.batch();
    for (const [name, id] of Object.entries(categoryIds)) {
      batch.set(db.collection("categories").doc(id), {
        id,
        name,
        order: catOrder.indexOf(id),
        imageUrl: catImageUrls[id] ?? null,
        activityCount: activities.filter((a) => a.category === name).length,
        updatedAt: FieldValue.serverTimestamp(),
      });
    }
    await batch.commit();
    console.log("  6 category docs written");
  }

  // 3. Activities: upload full + thumb, write doc
  let n = 0;
  for (const a of activities) {
    const imgPath = path.join(__dirname, "assets/act", `${a.slug}.jpg`);
    if (!existsSync(imgPath)) throw new Error(`Missing image for ${a.slug}`);

    let imageUrl = "dry://", thumbUrl = "dry://";
    if (!DRY_RUN) {
      [imageUrl, thumbUrl] = await Promise.all([
        uploadImage(imgPath, `activities/${a.slug}.jpg`, 1200, 80),
        uploadImage(imgPath, `activities/thumbs/${a.slug}.jpg`, 480, 70),
      ]);
      await db.collection("activities").doc(a.slug).set({
        slug: a.slug,
        title: a.title,
        category: a.category,
        categoryId: categoryIds[a.category],
        ageMin: a.ageMin,
        duration: a.duration,
        mess: a.mess,
        summary: a.summary,
        materials: a.materials,
        steps: a.steps,
        benefits: a.benefits,
        cleanup: a.cleanup,
        imageUrl,
        thumbUrl,
        isFree: a.isFree,
        ratingCount: 0,
        ratingSum: 0,
        avgRating: 0,
        saveCount: 0,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });
    }
    n++;
    if (n % 20 === 0) console.log(`  ${n}/${activities.length}…`);
  }
  console.log(`Done. ${n} activities seeded.`);
}

main().catch((e) => { console.error(e); process.exit(1); });
