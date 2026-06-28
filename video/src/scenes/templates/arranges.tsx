import React from "react";
import { Arrange, type ArrangeConfig } from "./Arrange";

const EMBER = "#FF6D3B", BLUE = "#3D5A9E", GREEN = "#3E7A4E", PURPLE = "#6650A8", PINK = "#D4537E", YELLOW = "#F2A93C";
const MULTI = [EMBER, BLUE, GREEN, PURPLE];

const CONFIGS: Record<string, ArrangeConfig> = {
  // Fine Motor — construction / placement
  "button-snake": { character: "cat", item: "button", base: "board", colors: MULTI, baseColor: "#C9B79A" },
  "coin-slot": { character: "fox", item: "coin", base: "slotbox", colors: [YELLOW, "#E8A94E", "#D9943C", YELLOW], baseColor: "#B98A5E" },
  "nuts-and-bolts": { character: "monkey", item: "button", base: "board", colors: ["#8A8F99", "#A9AEB8", "#6F747E", "#8A8F99"], baseColor: "#C9B79A" },
  "lacing-cards": { character: "bunny", item: "bead", base: "board", colors: MULTI, baseColor: "#E8C98F" },
  "pipe-cleaner-colander": { character: "penguin", item: "toothpick", base: "block", colors: MULTI, baseColor: "#C8CDD4" },
  "nesting-cups": { character: "hedgehog", item: "plate", base: "board", colors: MULTI, baseColor: "#C9B79A" },
  "clip-cards": { character: "lion", item: "peg", base: "board", colors: MULTI, baseColor: COLORSwhite() },
  "toothpick-cheese": { character: "monkey", item: "toothpick", base: "block", colors: ["#F2C879", "#E8B85E"], baseColor: "#F7D87A" },
  "puzzle-knobs": { character: "fox", item: "puzzle", base: "frame", colors: MULTI },
  "clothes-pin-clip": { character: "cat", item: "peg", base: "board", colors: MULTI, baseColor: "#C9B79A" },
  "velcro-strips": { character: "elephant", item: "shape", base: "board", colors: MULTI, baseColor: "#C9B79A" },
  "buckle-board": { character: "bunny", item: "shape", base: "board", colors: ["#5F5E5A", "#888780", "#5F5E5A", "#888780"], baseColor: "#C9B79A" },
  "zipper-board": { character: "penguin", item: "shape", base: "board", colors: [BLUE, BLUE, BLUE, BLUE], baseColor: "#C9B79A" },
  "ribbon-pull": { character: "hedgehog", item: "shape", base: "slotbox", colors: [PINK, PURPLE, EMBER, BLUE], baseColor: "#D9C0A0" },

  // Practical Life — tabletop / sorting
  "table-setting": { character: "elephant", item: "plate", base: "mat", colors: ["#FFFFFF", "#F0F0F0", "#FFFFFF", "#F0F0F0"], baseColor: "#E8D5BC" },
  "napkin-folding": { character: "cat", item: "shape", base: "mat", colors: ["#F4C9D8", "#CFE3F7", "#D7F0DC", "#F6E7BC"], baseColor: "#E8D5BC" },
  "flower-arranging": { character: "hedgehog", item: "flower", base: "vase", colors: [PINK, YELLOW, EMBER, PURPLE], baseColor: "#9CCFE8" },
  "peeling-mandarin": { character: "monkey", item: "segment", base: "mat", colors: [EMBER, "#FF8B3B", EMBER, "#FF8B3B"], baseColor: "#E8D5BC" },
  "spreading-butter": { character: "fox", item: "shape", base: "mat", colors: ["#F4D98A", "#F0CE6E", "#F4D98A", "#F0CE6E"], baseColor: "#E8D5BC" },
  "washing-veggies": { character: "bunny", item: "bead", base: "mat", colors: ["#E24B4A", GREEN, "#E24B4A", GREEN], baseColor: "#9CCFE8" },
  "dressing-doll": { character: "lion", item: "sock", base: "board", colors: [PINK, BLUE, YELLOW, GREEN], baseColor: "#C9B79A" },
  "matching-socks": { character: "cat", item: "sock", base: "board", colors: [EMBER, EMBER, BLUE, BLUE], baseColor: "#C9B79A" },
  "laundry-sorting": { character: "penguin", item: "shape", base: "board", colors: [EMBER, BLUE, GREEN, YELLOW], baseColor: "#C9B79A" },
  "opening-jars": { character: "hedgehog", item: "shape", base: "mat", colors: MULTI, baseColor: "#E8D5BC" },
  "carrying-tray": { character: "elephant", item: "plate", base: "mat", colors: ["#FFFFFF", "#F0F0F0", "#FFFFFF", "#F0F0F0"], baseColor: "#E8D5BC" },

  // Creativity — decorate an object
  "box-house": { character: "monkey", item: "shape", base: "object", objectShape: "box", baseColor: "#C2925E", colors: [YELLOW, BLUE, "#E24B4A", GREEN] },
  "plate-faces": { character: "lion", item: "bead", base: "object", objectShape: "plate", baseColor: "#FBF1DE", colors: ["#1C1A20", "#E24B4A", "#1C1A20", "#F8C5B0"] },
  "egg-carton-bugs": { character: "fox", item: "bead", base: "object", objectShape: "carton", baseColor: "#C2925E", colors: [EMBER, GREEN, PURPLE, BLUE] },
};

function COLORSwhite() { return "#E8DCC8"; }

export const arrangeScene = (slug: keyof typeof CONFIGS): React.FC => {
  const Scene: React.FC = () => <Arrange config={CONFIGS[slug]} />;
  Scene.displayName = `Arrange_${slug}`;
  return Scene;
};
export const ARRANGE_SLUGS = Object.keys(CONFIGS);
