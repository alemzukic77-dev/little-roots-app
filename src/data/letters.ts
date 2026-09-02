// Alphabet content for the "Letters" section — parent-facing Montessori ideas
// for teaching each letter (no screen time for the child). Static & bundled:
// 26 entries that never change, so no Firestore round-trip and it works offline.

export type LetterIdea = {
  title: string;
  body: string;
};

export type Letter = {
  /** Uppercase character, also the route param and grid label. */
  letter: string;
  /** Anchor word the letter "belongs to" (matches the emoji). */
  word: string;
  /** Emoji shown instead of a hosted image. */
  emoji: string;
  /** How the sound is spoken aloud, Montessori-style (the SOUND, not the name). */
  sound: string;
  /** Everyday objects that start with this letter — for an object basket. */
  objects: string[];
};

// Note on X: toddlers meet /ks/ most naturally at the END of words (fox, box),
// so X is anchored to "Fox" like most Montessori materials do.
export const LETTERS: Letter[] = [
  { letter: "A", word: "Ant", emoji: "🐜", sound: "æ", objects: ["Apple", "Ant", "Avocado", "Airplane"] },
  { letter: "B", word: "Ball", emoji: "⚽", sound: "buh", objects: ["Ball", "Banana", "Bear", "Book"] },
  { letter: "C", word: "Cat", emoji: "🐱", sound: "kuh", objects: ["Cat", "Car", "Cup", "Cookie"] },
  { letter: "D", word: "Dog", emoji: "🐶", sound: "duh", objects: ["Dog", "Duck", "Door", "Drum"] },
  { letter: "E", word: "Egg", emoji: "🥚", sound: "eh", objects: ["Egg", "Elephant", "Ear", "Elbow"] },
  { letter: "F", word: "Fish", emoji: "🐟", sound: "fff", objects: ["Fish", "Flower", "Fork", "Frog"] },
  { letter: "G", word: "Grapes", emoji: "🍇", sound: "guh", objects: ["Grapes", "Goat", "Gift", "Grass"] },
  { letter: "H", word: "Hat", emoji: "🎩", sound: "huh", objects: ["Hat", "House", "Hand", "Horse"] },
  { letter: "I", word: "Ice cream", emoji: "🍦", sound: "ih", objects: ["Igloo", "Insect", "Ice", "Ink"] },
  { letter: "J", word: "Juice", emoji: "🧃", sound: "juh", objects: ["Juice", "Jam", "Jug", "Jacket"] },
  { letter: "K", word: "Kite", emoji: "🪁", sound: "kuh", objects: ["Kite", "Key", "Kangaroo", "King"] },
  { letter: "L", word: "Leaf", emoji: "🍃", sound: "lll", objects: ["Leaf", "Lemon", "Lion", "Lamp"] },
  { letter: "M", word: "Moon", emoji: "🌙", sound: "mmm", objects: ["Moon", "Milk", "Mouse", "Mango"] },
  { letter: "N", word: "Nest", emoji: "🪺", sound: "nnn", objects: ["Nest", "Nose", "Nut", "Net"] },
  { letter: "O", word: "Orange", emoji: "🍊", sound: "oh", objects: ["Orange", "Octopus", "Owl", "Onion"] },
  { letter: "P", word: "Pig", emoji: "🐷", sound: "puh", objects: ["Pig", "Pear", "Pen", "Pot"] },
  { letter: "Q", word: "Queen", emoji: "👑", sound: "kwuh", objects: ["Queen", "Quilt", "Question", "Quack"] },
  { letter: "R", word: "Rabbit", emoji: "🐰", sound: "rrr", objects: ["Rabbit", "Rain", "Ring", "Rock"] },
  { letter: "S", word: "Sun", emoji: "☀️", sound: "sss", objects: ["Sun", "Sock", "Snake", "Star"] },
  { letter: "T", word: "Tree", emoji: "🌳", sound: "tuh", objects: ["Tree", "Turtle", "Table", "Tomato"] },
  { letter: "U", word: "Umbrella", emoji: "☂️", sound: "uh", objects: ["Umbrella", "Up", "Under", "Uncle"] },
  { letter: "V", word: "Van", emoji: "🚐", sound: "vvv", objects: ["Van", "Violin", "Vase", "Vet"] },
  { letter: "W", word: "Whale", emoji: "🐳", sound: "wuh", objects: ["Whale", "Water", "Window", "Worm"] },
  { letter: "X", word: "Fox", emoji: "🦊", sound: "ks", objects: ["Fox", "Box", "Six", "Ox"] },
  { letter: "Y", word: "Yarn", emoji: "🧶", sound: "yuh", objects: ["Yarn", "Yo-yo", "Yogurt", "Yawn"] },
  { letter: "Z", word: "Zebra", emoji: "🦓", sound: "zzz", objects: ["Zebra", "Zip", "Zoo", "Zero"] },
];

export function getLetter(char: string): Letter | undefined {
  const upper = char?.toUpperCase();
  return LETTERS.find((l) => l.letter === upper);
}

/**
 * The Montessori teaching sequence, tailored per letter. These are ideas FOR THE
 * PARENT — the child plays with real objects, sand, and dough, not a screen.
 */
export function teachingIdeas(l: Letter): LetterIdea[] {
  const lower = l.letter.toLowerCase();
  return [
    {
      title: "Say the sound, not the name",
      body: `Always introduce the letter by its sound — “/${l.sound}/” — rather than “${l.letter}”. Point to it and say the sound a few times: “/${l.sound}/… ${l.word}.” Sounds are what children need to start blending words later.`,
    },
    {
      title: "Trace and say it together",
      body: `Trace the letter ${l.letter} with two fingers, top to bottom, saying “/${l.sound}/” as you go. Let your child copy your finger movement. Print the worksheet below to trace on paper together.`,
    },
    {
      title: `“I spy” sound game`,
      body: `Play anywhere: “I spy something that starts with /${l.sound}/…” and look around for ${l.word.toLowerCase()} or ${l.objects[1]?.toLowerCase() ?? "something nearby"}. Listening for the first sound is the real foundation of reading.`,
    },
    {
      title: "Write it in a tray",
      body: `Sprinkle a thin layer of flour, salt, or fine sand in a baking tray. Show your child how to draw ${l.letter} with one finger, then smooth it away and try again. The texture makes the shape memorable — no pencil grip needed yet.`,
    },
    {
      title: "Build the letter",
      body: `Form ${l.letter} together from playdough rolls, sticks, pebbles, or dry pasta. Making the shape with their hands helps toddlers feel how the letter is put together.`,
    },
    {
      title: "Make an object basket",
      body: `Gather a few real things that start with /${l.sound}/ — ${l.objects.slice(0, 3).join(", ")} — in a small basket. Take each one out, name it, and stretch the first sound: “${l.objects[0]}… /${l.sound}/.” Add “${lower}” to it and they connect sound, object, and letter.`,
    },
  ];
}
