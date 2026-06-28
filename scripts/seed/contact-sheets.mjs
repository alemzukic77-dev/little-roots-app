import { execSync } from "node:child_process";
import { readFileSync, existsSync, mkdirSync } from "node:fs";
import sharp from "sharp";

const OUT = "/Users/alemzukic/little-roots-app/video/out";
const TMP = "/tmp/sheets";
mkdirSync(TMP, { recursive: true });
const acts = JSON.parse(readFileSync("/tmp/all-activities.json", "utf8"));

const pascal = (s) => s.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join("");
const fileFor = (slug) => {
  const a = `${OUT}/${slug}.mp4`, b = `${OUT}/${pascal(slug)}.mp4`;
  return existsSync(a) ? a : existsSync(b) ? b : null;
};

const CELL = 300, COLS = 5, PAD = 10, LABEL = 34;
const cats = [...new Set(acts.map((a) => a.cat))];

for (const cat of cats) {
  const items = acts.filter((a) => a.cat === cat).sort((x, y) => x.slug.localeCompare(y.slug));
  const rows = Math.ceil(items.length / COLS);
  const W = COLS * (CELL + PAD) + PAD;
  const H = rows * (CELL + LABEL + PAD) + PAD + 50;
  const composites = [];

  // header
  const header = Buffer.from(`<svg width="${W}" height="50"><text x="${PAD}" y="36" font-family="Helvetica" font-size="32" font-weight="700" fill="#1C1A20">${cat} — ${items.length}</text></svg>`);
  composites.push({ input: header, top: 4, left: 0 });

  for (let i = 0; i < items.length; i++) {
    const { slug, title } = items[i];
    const f = fileFor(slug);
    const col = i % COLS, row = Math.floor(i / COLS);
    const x = PAD + col * (CELL + PAD);
    const y = 50 + PAD + row * (CELL + LABEL + PAD);
    let thumb;
    if (f) {
      const p = `${TMP}/${slug}.png`;
      try {
        execSync(`ffmpeg -y -loglevel error -ss 2.5 -i "${f}" -vframes 1 -vf scale=${CELL}:${CELL} "${p}"`);
        thumb = await sharp(p).toBuffer();
      } catch { thumb = null; }
    }
    if (!thumb) thumb = await sharp({ create: { width: CELL, height: CELL, channels: 3, background: "#EEE" } }).png().toBuffer();
    composites.push({ input: thumb, top: y, left: x });
    const lbl = Buffer.from(`<svg width="${CELL}" height="${LABEL}"><text x="${CELL / 2}" y="22" text-anchor="middle" font-family="Helvetica" font-size="19" fill="#1C1A20">${title.replace(/&/g, "&amp;").slice(0, 26)}</text></svg>`);
    composites.push({ input: lbl, top: y + CELL + 2, left: x });
  }

  const file = `/Users/alemzukic/Desktop/little-roots-${cat.toLowerCase().replace(/ /g, "-")}.png`;
  await sharp({ create: { width: W, height: H, channels: 3, background: "#FDF4EE" } }).composite(composites).png().toFile(file);
  console.log("✓", file);
}
console.log("DONE");
process.exit(0);
