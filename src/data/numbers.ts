// Numbers 1–10 for the Learn hub — parent-facing Montessori counting ideas.
// Static & bundled, same approach as the letters section.

export type LearnIdea = { title: string; body: string };

export type NumberItem = {
  /** The digit, also the route param. */
  n: number;
  /** Spelled-out word. */
  word: string;
  /** Emoji repeated n times gives a countable set. */
  emoji: string;
  /** Everyday things to count together. */
  objects: string[];
};

export const NUMBERS: NumberItem[] = [
  { n: 1, word: "One", emoji: "🍎", objects: ["nose", "moon", "belly button", "your child"] },
  { n: 2, word: "Two", emoji: "👀", objects: ["eyes", "hands", "shoes", "ears"] },
  { n: 3, word: "Three", emoji: "🐻", objects: ["blocks", "buttons", "crayons", "grapes"] },
  { n: 4, word: "Four", emoji: "🚗", objects: ["chair legs", "car wheels", "corners of a book", "paws on a dog"] },
  { n: 5, word: "Five", emoji: "🖐️", objects: ["fingers on a hand", "toes on a foot", "petals", "stars"] },
  { n: 6, word: "Six", emoji: "🥚", objects: ["eggs in a carton", "spots on a dice", "crayons", "buttons"] },
  { n: 7, word: "Seven", emoji: "🌈", objects: ["days in a week", "rainbow colours", "blocks", "stickers"] },
  { n: 8, word: "Eight", emoji: "🕷️", objects: ["spider legs", "crayons", "grapes", "beads"] },
  { n: 9, word: "Nine", emoji: "🎈", objects: ["balloons", "blocks", "buttons", "stickers"] },
  { n: 10, word: "Ten", emoji: "🔟", objects: ["fingers", "toes", "blocks", "cheerios"] },
];

export function getNumber(raw: string): NumberItem | undefined {
  const n = Number(raw);
  return NUMBERS.find((x) => x.n === n);
}

export function numberIdeas(x: NumberItem): LearnIdea[] {
  const set = x.emoji.repeat(x.n);
  return [
    {
      title: "Count real things, together",
      body: `Numbers mean more when they're attached to real objects. Line up ${x.n} everyday things — ${x.objects[0]}, ${x.objects[1]} — and touch each one as you count out loud: “1… 2… ${x.n === 2 ? "" : "… "}${x.n}.”`,
    },
    {
      title: "One touch, one number",
      body: `The big Montessori idea is one-to-one correspondence: exactly one number word per object. Move each item to a new pile as you count it, so nothing gets counted twice. ${set}`,
    },
    {
      title: "Show it on fingers",
      body: `Hold up ${x.n} finger${x.n === 1 ? "" : "s"} and count them slowly. Ask your child to make the same number. Fingers are a number line your child always has with them.`,
    },
    {
      title: "Trace the number",
      body: `Draw ${x.n} in a tray of flour or sand, saying the name as you go, then smooth it away and try again. Print the worksheet below to trace it on paper too.`,
    },
    {
      title: "Spot it in the day",
      body: `Point out ${x.word.toLowerCase()} wherever it hides — ${x.objects[2]}, ${x.objects[3]}. Turning a walk or snack into a gentle counting game builds number sense without any pressure.`,
    },
  ];
}
