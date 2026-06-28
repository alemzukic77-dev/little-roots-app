import React from "react";
import { Touch, type TouchConfig } from "./Touch";

const EMBER = "#FF6D3B", BLUE = "#3D5A9E", GREEN = "#3E7A4E", PURPLE = "#6650A8", PINK = "#D4537E", YELLOW = "#F2A93C";
const MULTI = [EMBER, BLUE, GREEN, PURPLE];

const CONFIGS: Record<string, TouchConfig> = {
  // Sensory — touch & explore
  "crinkle-basket": { character: "cat", shape: "fabric", colors: [PINK, YELLOW, BLUE, GREEN] },
  "herb-garden-touch": { character: "hedgehog", shape: "leaf", colors: ["#3E7A4E", "#5C9A6B", "#2F6B3E", "#6FA97B"] },
  "mirror-play": { character: "bunny", shape: "mirror", colors: ["#DCE8F0", "#DCE8F0", "#DCE8F0", "#DCE8F0"] },
  "nature-basket": { character: "fox", shape: "pebble", colors: ["#A9805B", "#8A8F99", "#C2925E", "#6F747E"] },
  "sound-shakers": { character: "monkey", shape: "jar", colors: MULTI },
  "spice-smell-jars": { character: "elephant", shape: "jar", colors: ["#B98A5E", "#D9943C", "#8A6B3A", "#C2925E"] },
  "sponge-textures": { character: "penguin", shape: "blob", colors: [YELLOW, "#9CCFE8", PINK, GREEN] },
  "texture-board": { character: "lion", shape: "fabric", colors: [PINK, BLUE, YELLOW, GREEN] },
  "warm-cold-bowls": { character: "bunny", shape: "blob", colors: ["#E24B4A", "#5DAEDC", "#E24B4A", "#5DAEDC"] },
  "flashlight-shadows": { character: "cat", shape: "star", colors: [YELLOW, "#FFD23F", YELLOW, "#FFD23F"] },

  // Practical Life — chores (clean mode: items vanish as the paw passes)
  "dish-washing": { character: "penguin", shape: "blob", colors: ["#9CCFE8", "#C9E6F2", "#9CCFE8", "#C9E6F2"], mode: "clean", surface: "#D8EAF4" },
  "dusting-shelves": { character: "hedgehog", shape: "crumb", colors: ["#C9B79A", "#B4A488", "#C9B79A", "#B4A488"], mode: "clean" },
  "sweeping-rice": { character: "fox", shape: "crumb", colors: ["#F4EBDB", "#EFE2C8", "#F4EBDB", "#EFE2C8"], mode: "clean" },
  "wiping-table": { character: "monkey", shape: "crumb", colors: ["#C2925E", "#A9805B", "#C2925E", "#A9805B"], mode: "clean" },
  "polishing-pebbles": { character: "lion", shape: "pebble", colors: ["#8A8F99", "#6F747E", "#A9AEB8", "#8A8F99"] },
};

export const touchScene = (slug: keyof typeof CONFIGS): React.FC => {
  const Scene: React.FC = () => <Touch config={CONFIGS[slug]} />;
  Scene.displayName = `Touch_${slug}`;
  return Scene;
};
export const TOUCH_SLUGS = Object.keys(CONFIGS);
