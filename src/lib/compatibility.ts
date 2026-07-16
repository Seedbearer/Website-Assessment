import type { SeedType } from "./assessment-data";

export type CompatibilityLevel = "complement" | "tension" | "neutral";

type Pair = { a: SeedType; b: SeedType; level: CompatibilityLevel; text: string };

// Seven pairings with bespoke copy, per Seedbearer_Scoring_Algorithm.docx. The remaining pairs
// (14 of the 21 possible two-type combinations) fall back to a generic template — see
// Section 07 of the spec: the coach's own family notes carry the specific nuance for those.
const PAIRS: Pair[] = [
  { a: "Builder", b: "Guardian", level: "complement", text: "Vision and protection — Builder brings the plan, Guardian brings the will to defend it." },
  { a: "Shepherd", b: "Weaver", level: "complement", text: "Individual care and community belonging — Shepherd tends the one, Weaver tends the room." },
  { a: "Lantern", b: "Maker", level: "complement", text: "Understanding and expression — Lantern illuminates, Maker gives it form." },
  { a: "Beacon", b: "Builder", level: "complement", text: "Direction and execution — Beacon names where to go, Builder makes it real." },
  { a: "Beacon", b: "Shepherd", level: "tension", text: "Pace and relational depth need awareness here — Beacon moves fast, Shepherd needs time to stay present." },
  { a: "Builder", b: "Weaver", level: "tension", text: "Focus versus connection — Builder can disappear into the work, Weaver needs the room." },
  { a: "Guardian", b: "Lantern", level: "tension", text: "Action versus analysis — Guardian wants to move, Lantern wants to understand first." },
];

function findPair(a: SeedType, b: SeedType): Pair | undefined {
  return PAIRS.find((p) => (p.a === a && p.b === b) || (p.a === b && p.b === a));
}

export function getCompatibility(a: SeedType, b: SeedType): { level: CompatibilityLevel; text: string } {
  if (a === b) {
    return { level: "neutral", text: `Two ${a}s share the same instincts — worth noticing where that reinforces the family and where it leaves a gap nobody else is covering.` };
  }
  const pair = findPair(a, b);
  if (pair) return { level: pair.level, text: pair.text };
  return {
    level: "neutral",
    text: `${a} and ${b} bring different rhythms to a family — noticing where they align and where they diverge is part of the work.`,
  };
}
