import React from "react";
import { Transfer, type TransferConfig } from "./Transfer";

// T2 transfer configs — one per move-items activity
const CONFIGS: Record<string, TransferConfig> = {
  "tongs-transfer": {
    character: "cat",
    tool: "tongs",
    item: { kind: "ball", colors: ["#FFF9F2", "#F6EFE6"], r: 26 },
  },
  "playdough-pinching": {
    character: "monkey",
    tool: "none",
    item: { kind: "ball", colors: ["#FF8B61", "#FF6D3B"], r: 17 },
    sourceBall: "#FF6D3B",
  },
  "rice-scoop": {
    character: "hedgehog",
    tool: "spoon",
    item: { kind: "cluster", colors: ["#F4EBDB", "#EFE2C8"], r: 22 },
    accent: "#D9C0A0",
  },
  "sponge-squeeze": {
    character: "penguin",
    tool: "sponge",
    item: { kind: "drop", colors: ["#9CCFE8", "#C9E6F2"], r: 18 },
    accent: "#2E7490",
  },
  "cotton-ball-spoon": {
    character: "bunny",
    tool: "spoon",
    item: { kind: "ball", colors: ["#FFFFFF", "#F6EFE6"], r: 24 },
  },
  "ice-tray-transfer": {
    character: "fox",
    tool: "none",
    item: { kind: "bead", colors: ["#FF6D3B", "#3D5A9E", "#3E7A4E", "#6650A8"], r: 16 },
    targetTray: true,
  },
};

export const transferScene = (slug: keyof typeof CONFIGS): React.FC => {
  const Scene: React.FC = () => <Transfer config={CONFIGS[slug]} />;
  Scene.displayName = `Transfer_${slug}`;
  return Scene;
};
