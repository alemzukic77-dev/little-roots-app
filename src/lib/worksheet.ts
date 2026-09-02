import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

import type { ColorItem } from "@/data/colors";
import type { Letter } from "@/data/letters";
import type { NumberItem } from "@/data/numbers";
import type { ShapeItem } from "@/data/shapes";

/** Render HTML to a PDF and hand it to the OS share/print sheet (AirPrint or save to Files). */
async function openPrint(html: string, dialogTitle: string): Promise<void> {
  try {
    const { uri } = await Print.printToFileAsync({ html });
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri, { UTI: "com.adobe.pdf", mimeType: "application/pdf", dialogTitle });
      return;
    }
  } catch {
    // fall through to the native print dialog
  }
  await Print.printAsync({ html });
}

/**
 * Build a printable tracing worksheet (uppercase + lowercase) for a letter. The
 * child traces on paper — keeping the app screen-free for them.
 */
export async function printLetterWorksheet(l: Letter): Promise<void> {
  await openPrint(worksheetHtml(l), `The Letter ${l.letter} — worksheet`);
}

// ---------- Numbers ----------

export async function printNumberWorksheet(x: NumberItem): Promise<void> {
  await openPrint(numberHtml(x), `The Number ${x.n} — worksheet`);
}

function numberHtml(x: NumberItem): string {
  const dots = Array.from({ length: x.n }, () => `<span class="dot"></span>`).join("");
  return pageHtml(
    `The Number ${x.n}`,
    `Trace it, then count ${x.n} — say each number out loud`,
    `${x.emoji} &nbsp;${x.n} is ${x.word.toLowerCase()}`,
    `
    <p class="caption">Trace the number — ${x.n}</p>
    ${traceRow(String(x.n), 6)}
    ${traceRow(String(x.n), 6)}
    <p class="caption">Count and colour ${x.n} circle${x.n === 1 ? "" : "s"}</p>
    <div class="dots">${dots}</div>`,
  );
}

// ---------- Shapes ----------

const SHAPE_STAR = "50,5 63,38 98,38 70,59 82,92 50,72 18,92 30,59 2,38 37,38";
const SHAPE_HEART =
  "M50,84 C20,62 8,42 8,28 C8,15 18,10 28,10 C38,10 46,18 50,26 C54,18 62,10 72,10 C82,10 92,15 92,28 C92,42 80,62 50,84 Z";

function shapeSvg(id: string, stroke: string, size: number): string {
  const a = `fill="none" stroke="${stroke}" stroke-width="4" stroke-linejoin="round"`;
  let inner = "";
  if (id === "circle") inner = `<circle cx="50" cy="50" r="44" ${a}/>`;
  else if (id === "square") inner = `<rect x="8" y="8" width="84" height="84" rx="8" ${a}/>`;
  else if (id === "rectangle") inner = `<rect x="6" y="26" width="88" height="48" rx="8" ${a}/>`;
  else if (id === "oval") inner = `<ellipse cx="50" cy="50" rx="45" ry="30" ${a}/>`;
  else if (id === "triangle") inner = `<polygon points="50,10 90,86 10,86" ${a}/>`;
  else if (id === "diamond") inner = `<polygon points="50,6 92,50 50,94 8,50" ${a}/>`;
  else if (id === "star") inner = `<polygon points="${SHAPE_STAR}" ${a}/>`;
  else if (id === "heart") inner = `<path d="${SHAPE_HEART}" ${a}/>`;
  return `<svg width="${size}" height="${size}" viewBox="0 0 100 100">${inner}</svg>`;
}

export async function printShapeWorksheet(s: ShapeItem): Promise<void> {
  await openPrint(shapeHtml(s), `The ${s.name} — worksheet`);
}

function shapeHtml(s: ShapeItem): string {
  const row = (n: number, faint: string, bold: string) =>
    `<div class="shaperow">${Array.from({ length: n }, (_, i) =>
      shapeSvg(s.id, i === 0 ? bold : faint, 120),
    ).join("")}</div>`;
  return pageHtml(
    `The ${s.name}`,
    `Trace each ${s.name.toLowerCase()} — go slowly around the edge`,
    `${s.name} shape`,
    `<p class="caption">Trace the ${s.name.toLowerCase()}</p>
     ${row(4, "#C7C2CC", "#9A94A0")}
     ${row(4, "#C7C2CC", "#9A94A0")}`,
  );
}

// ---------- Colours ----------

export async function printColorWorksheet(c: ColorItem): Promise<void> {
  await openPrint(colorHtml(c), `The colour ${c.name} — hunt`);
}

function colorHtml(c: ColorItem): string {
  const border = c.hex.toUpperCase() === "#FFFFFF" ? "#D8D0C8" : c.hex;
  const items = c.examples
    .map(
      (e) => `<li><span class="box"></span>${e[0].toUpperCase()}${e.slice(1)}</li>`,
    )
    .join("");
  return pageHtml(
    `The colour ${c.name}`,
    `Go on a ${c.name.toLowerCase()} hunt — tick each thing you find`,
    `<span class="swatch" style="background:${c.hex};border-color:${border}"></span> ${c.name}`,
    `<p class="caption">Find these ${c.name.toLowerCase()} things and tick the box</p>
     <ul class="hunt">${items}</ul>
     <p class="caption">Now draw one more ${c.name.toLowerCase()} thing you found</p>
     <div class="drawbox"></div>`,
  );
}

// ---------- shared shell ----------

function pageHtml(h1: string, say: string, anchor: string, body: string): string {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8" /><style>
  @page { margin: 40px; }
  * { box-sizing: border-box; }
  body { font-family: -apple-system, "Helvetica Neue", Arial, sans-serif; color: #1C1A20; margin: 0; }
  .name { font-size: 18px; color: #8E8A93; margin-bottom: 8px; }
  .name span { display: inline-block; width: 260px; border-bottom: 2px solid #D8D0C8; }
  h1 { font-size: 44px; text-align: center; color: #FF6D3B; margin: 6px 0 2px; }
  .say { text-align: center; font-size: 19px; color: #4A4750; margin: 0 0 4px; }
  .anchor { text-align: center; font-size: 22px; margin: 0 0 18px; }
  .anchor .emoji { font-size: 40px; vertical-align: middle; }
  .swatch { display: inline-block; width: 34px; height: 34px; border-radius: 8px; border: 3px solid; vertical-align: middle; }
  hr { border: none; border-top: 2px dashed #E4DBD2; margin: 18px 0; }
  .caption { font-size: 15px; color: #8E8A93; margin: 14px 0 6px; }
  .row { display: flex; justify-content: space-between; border-bottom: 2px solid #C9DCE8; padding: 4px 2px 8px; margin-bottom: 18px; }
  .trace { font-size: 88px; line-height: 1; font-weight: 700; color: transparent; -webkit-text-stroke: 2px #C7C2CC; }
  .trace:first-child { -webkit-text-stroke: 2px #9A94A0; }
  .dots { display: flex; gap: 22px; padding: 8px 2px; }
  .dot { width: 66px; height: 66px; border-radius: 50%; border: 3px solid #C7C2CC; }
  .shaperow { display: flex; justify-content: space-between; padding: 6px 2px 14px; margin-bottom: 12px; }
  .hunt { list-style: none; padding: 0; font-size: 22px; line-height: 2.1; }
  .hunt .box { display: inline-block; width: 26px; height: 26px; border: 3px solid #C7C2CC; border-radius: 6px; margin-right: 14px; vertical-align: -4px; }
  .drawbox { border: 2px dashed #C7C2CC; border-radius: 12px; height: 220px; }
  .foot { text-align: center; font-size: 12px; color: #B7B2BB; margin-top: 24px; }
</style></head><body>
  <div class="name">Name: <span>&nbsp;</span></div>
  <h1>${h1}</h1>
  <p class="say">${say}</p>
  <p class="anchor">${anchor}</p>
  <hr />
  ${body}
  <div class="foot">Little Roots · print, play, learn together</div>
</body></html>`;
}

function traceRow(char: string, count: number): string {
  return `<div class="row">${Array.from({ length: count }, () => `<span class="trace">${char}</span>`).join("")}</div>`;
}

function worksheetHtml(l: Letter): string {
  const lower = l.letter.toLowerCase();
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>
  @page { margin: 40px; }
  * { box-sizing: border-box; }
  body {
    font-family: -apple-system, "Helvetica Neue", Arial, sans-serif;
    color: #1C1A20;
    margin: 0;
  }
  .name { font-size: 18px; color: #8E8A93; margin-bottom: 8px; }
  .name span { display: inline-block; width: 260px; border-bottom: 2px solid #D8D0C8; }
  h1 { font-size: 46px; text-align: center; color: #FF6D3B; margin: 6px 0 2px; }
  .say { text-align: center; font-size: 20px; color: #4A4750; margin: 0 0 4px; }
  .anchor { text-align: center; font-size: 22px; margin: 0 0 18px; }
  .anchor .emoji { font-size: 40px; vertical-align: middle; }
  hr { border: none; border-top: 2px dashed #E4DBD2; margin: 18px 0; }
  .caption { font-size: 15px; color: #8E8A93; margin: 2px 0 6px; }
  .row {
    display: flex;
    justify-content: space-between;
    border-bottom: 2px solid #C9DCE8;
    padding: 4px 2px 8px;
    margin-bottom: 18px;
  }
  .trace {
    font-size: 88px;
    line-height: 1;
    font-weight: 700;
    color: transparent;
    -webkit-text-stroke: 2px #C7C2CC;
  }
  .trace:first-child { -webkit-text-stroke: 2px #9A94A0; }
  .foot { text-align: center; font-size: 12px; color: #B7B2BB; margin-top: 24px; }
</style>
</head>
<body>
  <div class="name">Name: <span>&nbsp;</span></div>
  <h1>The Letter ${l.letter} ${lower}</h1>
  <p class="say">Trace it and say the sound — “/${l.sound}/”</p>
  <p class="anchor"><span class="emoji">${l.emoji}</span> &nbsp;${l.letter} is for ${l.word}</p>
  <hr />

  <p class="caption">Trace the big letter — ${l.letter}</p>
  ${traceRow(l.letter, 6)}
  ${traceRow(l.letter, 6)}

  <p class="caption">Now the small letter — ${lower}</p>
  ${traceRow(lower, 6)}
  ${traceRow(lower, 6)}

  <div class="foot">Little Roots · print, trace on paper, play</div>
</body>
</html>`;
}
