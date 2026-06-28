import React from "react";
import { Talk, type TalkConfig } from "./Talk";

const EMBER = "#FF6D3B", BLUE = "#3D5A9E", GREEN = "#3E7A4E", PURPLE = "#6650A8", PINK = "#D4537E", YELLOW = "#F2A93C";
const MULTI = [EMBER, BLUE, GREEN, PURPLE];

const CONFIGS: Record<string, TalkConfig> = {
  "animal-sounds-x": { character: "giraffe" as any, glyphs: ["paw", "paw", "paw", "paw"], colors: MULTI }, // (already a hero, kept for reference)
  "body-parts": { character: "bunny", glyphs: ["hand", "happy", "hand", "happy"], colors: MULTI },
  "song-actions": { character: "monkey", glyphs: ["note", "star", "note", "heart"], colors: MULTI },
  "naming-basket": { character: "fox", glyphs: ["cube", "apple", "paw", "book"], colors: MULTI },
  "story-stones": { character: "hedgehog", glyphs: ["paw", "star", "cloud", "heart"], colors: MULTI },
  "nursery-rhyme-time": { character: "cat", glyphs: ["note", "star", "note", "sun"], colors: MULTI },
  "simple-commands": { character: "elephant", glyphs: ["cube", "hand", "apple", "happy"], colors: MULTI },
  "sound-bag": { character: "penguin", glyphs: ["note", "cube", "note", "paw"], colors: MULTI },
  "animal-stories": { character: "lion", glyphs: ["paw", "paw", "heart", "star"], colors: MULTI },
  "echo-game": { character: "monkey", glyphs: ["note", "note", "note", "note"], colors: MULTI },
  "finger-rhyme": { character: "bunny", glyphs: ["hand", "note", "hand", "star"], colors: MULTI },
  "book-flip-name": { character: "fox", glyphs: ["book", "apple", "paw", "cube"], colors: MULTI },
  "food-naming": { character: "monkey", glyphs: ["apple", "apple", "apple", "apple"], colors: [EMBER, GREEN, YELLOW, PINK] },
  "emotion-faces": { character: "cat", glyphs: ["happy", "sad", "happy", "heart"], colors: MULTI },
  "peekaboo-objects": { character: "hedgehog", glyphs: ["cube", "happy", "paw", "happy"], colors: MULTI },
  "weather-words": { character: "elephant", glyphs: ["sun", "cloud", "rain", "sun"], colors: [YELLOW, "#B7C4D6", BLUE, YELLOW] },
  "picture-card-sort": { character: "penguin", glyphs: ["paw", "apple", "cube", "book"], colors: MULTI },
  "sequencing-cards": { character: "lion", glyphs: ["sun", "cube", "happy", "star"], colors: MULTI },
  "mirror-talk": { character: "bunny", glyphs: ["happy", "heart", "happy", "star"], colors: MULTI },
  "picture-book-naming": { character: "fox", glyphs: ["book", "paw", "apple", "sun"], colors: MULTI },
  "family-photos": { character: "elephant", glyphs: ["photo", "heart", "photo", "happy"], colors: MULTI },
};

export const talkScene = (slug: keyof typeof CONFIGS): React.FC => {
  const Scene: React.FC = () => <Talk config={CONFIGS[slug]} />;
  Scene.displayName = `Talk_${slug}`;
  return Scene;
};
export const TALK_SLUGS = Object.keys(CONFIGS).filter((s) => s !== "animal-sounds-x");
