import React from "react";
import { Squish, type SquishConfig } from "./Squish";

const CONFIGS: Record<string, SquishConfig> = {
  "cloud-dough": { character: "bunny", blob: "#EADBC4", blobLight: "#FBF5EC", trayColor: "#E8D5BC" },
  "oobleck": { character: "penguin", blob: "#7FC4E0", blobLight: "#BFE4F2" },
  "taste-safe-jelly": { character: "monkey", blob: "#F08BAE", blobLight: "#FBC9D8", bits: ["#E24B4A", "#FF6D3B", "#6650A8"] },
};

export const squishScene = (slug: keyof typeof CONFIGS): React.FC => {
  const Scene: React.FC = () => <Squish config={CONFIGS[slug]} />;
  Scene.displayName = `Squish_${slug}`;
  return Scene;
};
export const SQUISH_SLUGS = Object.keys(CONFIGS);
