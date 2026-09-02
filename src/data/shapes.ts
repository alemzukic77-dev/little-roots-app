// Shapes for the Learn hub — parent-facing Montessori "shape hunt" ideas.
import type { LearnIdea } from "./numbers";

export type ShapeItem = {
  id: string;
  name: string;
  /** accent colour for the tile + hero */
  color: string;
  /** everyday things with this shape */
  examples: string[];
};

export const SHAPES: ShapeItem[] = [
  { id: "circle", name: "Circle", color: "#3D5A9E", examples: ["a clock", "a plate", "a wheel", "a ball"] },
  { id: "square", name: "Square", color: "#3E7A4E", examples: ["a window", "a cracker", "a napkin", "a tile"] },
  { id: "triangle", name: "Triangle", color: "#B04A6E", examples: ["a slice of pizza", "a roof", "a party hat", "a mountain"] },
  { id: "rectangle", name: "Rectangle", color: "#A06B1F", examples: ["a door", "a book", "a phone", "a brick"] },
  { id: "oval", name: "Oval", color: "#6650A8", examples: ["an egg", "a spoon", "a grape", "a mirror"] },
  { id: "star", name: "Star", color: "#C9922B", examples: ["the night sky", "a sticker", "a starfish", "a badge"] },
  { id: "heart", name: "Heart", color: "#D4537E", examples: ["a valentine", "a playing card", "a doodle", "a sticker"] },
  { id: "diamond", name: "Diamond", color: "#2E7490", examples: ["a kite", "a road sign", "a playing card", "a gem"] },
];

export function getShape(id: string): ShapeItem | undefined {
  return SHAPES.find((s) => s.id === id?.toLowerCase());
}

export function shapeIdeas(s: ShapeItem): LearnIdea[] {
  const lower = s.name.toLowerCase();
  return [
    {
      title: "Go on a shape hunt",
      body: `Walk around the house and spot the ${lower} everywhere — ${s.examples[0]}, ${s.examples[1]}, ${s.examples[2]}. Naming shapes in the real world matters far more than a flashcard.`,
    },
    {
      title: "Trace the outline",
      body: `Run your child's finger slowly around the edge of a real ${lower} object while you say “${lower}”. Feeling the outline builds the shape in their body, not just their eyes. Print the worksheet below to trace it on paper.`,
    },
    {
      title: "Build it",
      body: `Make a ${lower} together from playdough, sticks, or string on the floor. Talk about its parts — how many sides, or whether it's round — as you build.`,
    },
    {
      title: "Sort by shape",
      body: `Gather a few household objects and sort them into “${lower}” and “not a ${lower}”. Deciding what belongs is early geometry and early logic at the same time.`,
    },
  ];
}
