// Gentle, non-diagnostic developmental milestones by age band, for reassurance
// and ideas — NOT medical advice. Every child grows at their own pace.

export type MilestoneGroup = { domain: string; items: string[] };

export type MilestoneBand = {
  id: string;
  label: string;
  minMonths: number;
  maxMonths: number;
  groups: MilestoneGroup[];
};

export const MILESTONE_BANDS: MilestoneBand[] = [
  {
    id: "12-18",
    label: "12–18 months",
    minMonths: 12,
    maxMonths: 17,
    groups: [
      { domain: "Moving", items: ["Walks on their own", "Begins to climb onto low furniture", "Scribbles with a crayon"] },
      { domain: "Talking", items: ["Says a few single words", "Points to show you something", "Shakes head for “no”"] },
      { domain: "Thinking", items: ["Follows a simple 1-step request", "Explores objects in different ways (shakes, drops)"] },
      { domain: "Everyday", items: ["Drinks from an open cup with help", "Tries to use a spoon"] },
    ],
  },
  {
    id: "18-24",
    label: "18–24 months",
    minMonths: 18,
    maxMonths: 23,
    groups: [
      { domain: "Moving", items: ["Runs a little", "Walks up steps holding on", "Kicks a ball"] },
      { domain: "Talking", items: ["Uses two-word phrases (“more milk”)", "Points to things in a book when named"] },
      { domain: "Thinking", items: ["Copies chores like sweeping", "Builds a tower of 3–4 blocks"] },
      { domain: "Everyday", items: ["Plays alongside other children", "Takes off simple clothing"] },
    ],
  },
  {
    id: "24-30",
    label: "2 – 2½ years",
    minMonths: 24,
    maxMonths: 29,
    groups: [
      { domain: "Moving", items: ["Jumps with both feet", "Climbs well", "Turns book pages one at a time"] },
      { domain: "Talking", items: ["Uses 2–3 word sentences", "Names familiar things and people"] },
      { domain: "Thinking", items: ["Sorts shapes and colours", "Follows two-step instructions"] },
      { domain: "Everyday", items: ["Uses a spoon well", "Shows independence (“me do it”)"] },
    ],
  },
  {
    id: "30-36",
    label: "2½ – 3 years",
    minMonths: 30,
    maxMonths: 36,
    groups: [
      { domain: "Moving", items: ["Pedals a tricycle", "Runs and stops with control", "Draws a circle after a demo"] },
      { domain: "Talking", items: ["Speaks in short sentences", "Is understood by others much of the time"] },
      { domain: "Thinking", items: ["Does simple puzzles", "Understands “mine” and “yours”"] },
      { domain: "Everyday", items: ["Takes turns in games", "Dresses with a little help"] },
    ],
  },
];

export function bandForAge(months: number | null | undefined): string | null {
  if (months == null) return null;
  const b = MILESTONE_BANDS.find((x) => months >= x.minMonths && months <= x.maxMonths);
  return b?.id ?? (months < 12 ? "12-18" : "30-36");
}
