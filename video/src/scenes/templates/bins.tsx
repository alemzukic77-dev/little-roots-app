import React from "react";
import { BinPlay, type BinPlayConfig } from "./BinPlay";

// T1 bin-play configs — one per sensory-bin activity
const CONFIGS: Record<string, BinPlayConfig> = {
  "rainbow-rice-bin": {
    character: "bunny",
    fill: "#F3E3F1",
    fillLight: "#FBF2FA",
    itemColors: ["#FF6D3B", "#FFB938", "#3E7A4E", "#3D5A9E", "#6650A8", "#D4537E"],
    itemShape: "dot",
  },
  "oat-bin": {
    character: "monkey",
    fill: "#EFD9B8",
    fillLight: "#F8ECD8",
    itemColors: ["#E8C98F", "#DDB97A", "#F2DCB0"],
    itemShape: "flake",
  },
  "dry-pasta-bin": {
    character: "fox",
    fill: "#F4DFA8",
    fillLight: "#FAEDCB",
    itemColors: ["#F2C879", "#E8A94E", "#F7D894"],
    itemShape: "penne",
  },
  "paper-rip-bin": {
    character: "lion",
    fill: "#F6F1EA",
    fillLight: "#FFFFFF",
    itemColors: ["#FFFFFF", "#F1E8DC", "#FAF4EC"],
    itemShape: "strip",
  },
  "wet-dry-rice": {
    character: "penguin",
    fill: "#E2F2F7",
    fillLight: "#F0F9FC",
    itemColors: ["#FFFFFF", "#C9E6F2", "#F4EFE8"],
    itemShape: "dot",
    binEdge: "#2E7490",
  },
  "tapioca-pearl-bin": {
    character: "cat",
    fill: "#F2EBF8",
    fillLight: "#FAF6FE",
    itemColors: ["#E3D7F2", "#D5C5EC", "#EFE7F9"],
    itemShape: "pearl",
  },
  "frozen-fruit-bowl": {
    character: "bunny",
    fill: "#E8C7D6",
    fillLight: "#F6E3EC",
    itemColors: ["#E24B4A", "#6650A8", "#D4537E", "#3D5A9E"],
    itemShape: "dot",
  },
  "cooked-spaghetti": {
    character: "monkey",
    fill: "#F4E2C2",
    fillLight: "#FBF1DE",
    itemColors: ["#F2D79A", "#E8C87E", "#F7E2B0"],
    itemShape: "strip",
  },
  "whipped-cream-tray": {
    character: "penguin",
    fill: "#FFFFFF",
    fillLight: "#EAF2F6",
    itemColors: ["#FFFFFF", "#F0F6FA", "#FFFFFF"],
    itemShape: "flake",
    binColor: "#CFE0E8",
    binEdge: "#9FB8C4",
  },
};

export const binScene = (slug: keyof typeof CONFIGS): React.FC => {
  const Scene: React.FC = () => <BinPlay config={CONFIGS[slug]} />;
  Scene.displayName = `Bin_${slug}`;
  return Scene;
};

export const BIN_SLUGS = Object.keys(CONFIGS);
