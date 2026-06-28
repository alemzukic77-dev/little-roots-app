import React from "react";
import { StampPaint, type StampPaintConfig } from "./StampPaint";

const EMBER = "#FF6D3B";
const BLUE = "#3D5A9E";
const GREEN = "#3E7A4E";
const PURPLE = "#6650A8";
const PINK = "#D4537E";
const YELLOW = "#F2A93C";
const MULTI = [EMBER, BLUE, GREEN, PURPLE];
const BRIGHT = ["#FF8B61", "#FFD23F", "#4FD1C5", "#F58BB0"]; // pops on black paper
const PASTEL = ["#F7C9D8", "#CFE3F7", "#D7F0DC", "#F6E7BC"];
const EARTH = ["#A9805B", "#C2925E", "#8A6B3A"];
const GREENS = ["#3E7A4E", "#5C9A6B", "#2F6B3E"];

// T3 stamp-paint configs — one per creativity activity
const CONFIGS: Record<string, StampPaintConfig> = {
  "veggie-stamping": { character: "monkey", mark: "stamp", shape: "star", colors: [GREEN, EMBER, YELLOW, PINK] },
  "potato-prints": { character: "fox", mark: "stamp", shape: "circle", colors: MULTI },
  "tube-stamps": { character: "bunny", mark: "ring", colors: MULTI },
  "sponge-painting": { character: "penguin", mark: "blob", colors: [EMBER, BLUE, GREEN, YELLOW] },
  "fork-painting": { character: "cat", mark: "lines", colors: [BLUE, GREEN] },
  "cotton-cloud-art": { character: "bunny", mark: "cotton", colors: ["#FFFFFF", "#F4F8FC"], paper: "blue" },
  "tissue-collage": { character: "hedgehog", mark: "tissue", colors: [EMBER, BLUE, GREEN, PINK] },
  "nature-collage": { character: "fox", mark: "leaf", colors: GREENS },
  "bubble-print": { character: "penguin", mark: "ring", colors: ["#5DAEDC", "#3D5A9E", "#9CCFE8"] },
  "yarn-painting": { character: "monkey", mark: "lines", colors: MULTI },
  "chalk-on-paper": { character: "cat", mark: "lines", colors: BRIGHT, paper: "black" },
  "wet-chalk": { character: "hedgehog", mark: "blob", colors: BRIGHT, paper: "black" },
  "salt-painting": { character: "elephant", mark: "stamp", shape: "flower", colors: PASTEL },
  "yogurt-paint": { character: "lion", mark: "blob", colors: PASTEL },
  "crayon-rubbing": { character: "lion", mark: "lines", colors: EARTH, paper: "kraft" },
  // Batch 4 — remaining creativity
  "footprint-art": { character: "monkey", mark: "stamp", shape: "heart", colors: [EMBER, PINK, PURPLE, BLUE] },
  "handprint-animals": { character: "elephant", mark: "stamp", shape: "flower", colors: [GREEN, EMBER, BLUE, YELLOW] },
  "ice-cube-painting": { character: "penguin", mark: "blob", colors: ["#9CCFE8", "#5DAEDC", "#A9CDE6"] },
  "mud-painting": { character: "fox", mark: "blob", colors: EARTH },
  "nature-brushes": { character: "hedgehog", mark: "lines", colors: GREENS },
  "rolling-pin-paint": { character: "lion", mark: "blob", colors: MULTI },
  "straw-blow-art": { character: "cat", mark: "blob", colors: [EMBER, PURPLE, GREEN] },
  "tape-resist": { character: "bunny", mark: "stamp", shape: "circle", colors: MULTI },
  // Batch 4 — Fine Motor mark-makers
  "dot-stamping": { character: "fox", mark: "stamp", shape: "circle", colors: MULTI },
  "sticker-peel": { character: "cat", mark: "stamp", shape: "star", colors: [PINK, YELLOW, BLUE, GREEN] },
  "water-dropper": { character: "penguin", mark: "blob", colors: ["#5DAEDC", "#9CCFE8", "#3D5A9E"] },
  "eyedropper-ice": { character: "bunny", mark: "blob", colors: [EMBER, BLUE, GREEN, PURPLE] },
  "paper-tearing": { character: "hedgehog", mark: "tissue", colors: MULTI },
  "hole-punch": { character: "monkey", mark: "ring", colors: MULTI },
  "sticky-wall": { character: "elephant", mark: "tissue", colors: [PINK, YELLOW, GREEN, BLUE] },
  "scissor-snipping": { character: "lion", mark: "lines", colors: [EMBER, BLUE] },
};

export const stampScene = (slug: keyof typeof CONFIGS): React.FC => {
  const Scene: React.FC = () => <StampPaint config={CONFIGS[slug]} />;
  Scene.displayName = `Stamp_${slug}`;
  return Scene;
};

export const STAMP_SLUGS = Object.keys(CONFIGS);
