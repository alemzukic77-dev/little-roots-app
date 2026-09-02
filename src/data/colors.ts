// Colours for the Learn hub — parent-facing Montessori "colour hunt" ideas.
import type { LearnIdea } from "./numbers";

export type ColorItem = {
  id: string;
  name: string;
  hex: string;
  /** everyday things that are this colour */
  examples: string[];
};

export const COLORS_DATA: ColorItem[] = [
  { id: "red", name: "Red", hex: "#E24B4A", examples: ["an apple", "a fire truck", "a strawberry", "a tomato"] },
  { id: "orange", name: "Orange", hex: "#F2892C", examples: ["an orange", "a carrot", "a pumpkin", "a basketball"] },
  { id: "yellow", name: "Yellow", hex: "#F5C518", examples: ["the sun", "a banana", "a lemon", "a rubber duck"] },
  { id: "green", name: "Green", hex: "#4CA85E", examples: ["grass", "a leaf", "a frog", "peas"] },
  { id: "blue", name: "Blue", hex: "#3D8AD8", examples: ["the sky", "water", "blueberries", "jeans"] },
  { id: "purple", name: "Purple", hex: "#8A6DD1", examples: ["grapes", "an eggplant", "a plum", "a flower"] },
  { id: "pink", name: "Pink", hex: "#E87BA6", examples: ["a flamingo", "bubblegum", "a piglet", "blossom"] },
  { id: "brown", name: "Brown", hex: "#9C6B4A", examples: ["a bear", "chocolate", "a tree trunk", "a teddy"] },
  { id: "black", name: "Black", hex: "#2B2B2B", examples: ["the night", "tyres", "an ant", "a crow"] },
  { id: "white", name: "White", hex: "#FFFFFF", examples: ["snow", "milk", "clouds", "cotton"] },
];

export function getColor(id: string): ColorItem | undefined {
  return COLORS_DATA.find((c) => c.id === id?.toLowerCase());
}

export function colorIdeas(c: ColorItem): LearnIdea[] {
  const lower = c.name.toLowerCase();
  return [
    {
      title: "Go on a colour hunt",
      body: `Pick a room and find everything ${lower} together — ${c.examples[0]}, ${c.examples[1]}. Say the colour each time you find it. Colour lives in real objects, not on a screen.`,
    },
    {
      title: "Sort a basket",
      body: `Tip out a bin of toys and sort the ${lower} ones into their own pile. Sorting by one property at a time is exactly how Montessori introduces colour.`,
    },
    {
      title: `Play “I spy something ${lower}”`,
      body: `On a walk or at the table: “I spy something ${lower}…” and let your child point. It sharpens attention and makes the colour word stick.`,
    },
    {
      title: "Find it in food",
      body: `At snack time, name the ${lower} foods — ${c.examples[2]}, ${c.examples[3]}. Linking a colour to taste and touch makes it far more memorable than naming a paint chip.`,
    },
  ];
}
