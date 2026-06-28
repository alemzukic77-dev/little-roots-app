import React from "react";
import { Move, type MoveConfig } from "./Move";

const EMBER = "#FF6D3B", BLUE = "#3D5A9E", GREEN = "#3E7A4E", PURPLE = "#6650A8", PINK = "#D4537E", YELLOW = "#F2A93C";
const MULTI = [EMBER, BLUE, GREEN, PURPLE];

const CONFIGS: Record<string, MoveConfig> = {
  "animal-walk-parade": { character: "bunny", prop: "parade", colors: [EMBER, GREEN, PURPLE] },
  "ball-roll-catch": { character: "monkey", prop: "ball", colors: [EMBER, YELLOW] },
  "balloon-keep-up": { character: "cat", prop: "balloon", colors: [PINK] },
  "couch-cushion-mountain": { character: "lion", prop: "cushions", colors: [BLUE, PINK, YELLOW] },
  "dance-freeze": { character: "fox", prop: "ribbon", colors: [PURPLE] },
  "obstacle-course": { character: "penguin", prop: "stones", colors: MULTI },
  "ribbon-twirl": { character: "hedgehog", prop: "ribbon", colors: [PINK] },
  "stepping-stones": { character: "elephant", prop: "stones", colors: [GREEN, BLUE, GREEN, BLUE] },
  "tunnel-crawl": { character: "bunny", prop: "tunnel", colors: [BLUE] },
  "bubble-wrap-stomp": { character: "penguin", prop: "bubblewrap", colors: ["#9CCFE8"] },
  "silk-draping": { character: "cat", prop: "silk", colors: [PINK, PURPLE] },
};

export const moveScene = (slug: keyof typeof CONFIGS): React.FC => {
  const Scene: React.FC = () => <Move config={CONFIGS[slug]} />;
  Scene.displayName = `Move_${slug}`;
  return Scene;
};
export const MOVE_SLUGS = Object.keys(CONFIGS);
