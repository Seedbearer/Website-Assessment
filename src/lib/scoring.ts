import type { SeedType } from "./assessment-data";

export type AssessmentAnswers = {
  q1Open: string;
  q2Answer: string;
  q3Answers: string[];
  q4Answer: string;
  q5Answer: string;
  q6Open: string;
  q7Relational: string;
  q8RelationalNeed: string;
  q9Internal: string;
  q10Longing: string[];
  q11Season: string;
  q12Open: string;
};

export type ScoringResult = {
  seedType: SeedType;
  confidence: number;
  flagForReview: boolean;
  priorityResponse: boolean;
  urgentQ12: boolean;
};

// Section 02 — Q2 primary anchor. Each answer maps to one seed type. Carries the highest weight (40%).
const Q2_PRIMARY_MAP: Record<string, SeedType> = {
  lead: "Beacon",
  build: "Builder",
  care: "Shepherd",
  teach: "Lantern",
  connect: "Weaver",
  protect: "Guardian",
  create: "Maker",
};

// Section 03 — Q3 refiner (energy source). Each answer lists the seed type(s) it most strongly confirms.
// Q3 is multi-select (max 2) in the app, so every selected answer is checked, not just one.
const Q3_SEED_MAP: Record<string, SeedType[]> = {
  deep_conversation: ["Shepherd", "Weaver", "Lantern"],
  solving_problems: ["Builder", "Beacon"],
  around_people: ["Weaver", "Beacon"],
  creating: ["Maker", "Builder"],
  time_alone: ["Maker", "Shepherd"],
  learning: ["Lantern", "Builder", "Beacon", "Maker"],
  movement_nature: ["Guardian"],
  helped_someone: ["Shepherd", "Weaver", "Guardian"],
};

// Section 03 — Q4 refiner (the wound). Each answer lists the seed type(s) it most strongly confirms.
const Q4_SEED_MAP: Record<string, SeedType[]> = {
  too_sensitive: ["Shepherd", "Maker"],
  overthinking: ["Lantern"],
  too_quiet: ["Maker", "Lantern"],
  too_much_space: ["Beacon", "Guardian"],
  push_too_hard: ["Builder", "Guardian"],
  care_too_much: ["Shepherd", "Weaver"],
  see_differently: ["Lantern", "Builder"],
  move_slowly: ["Maker"],
};

// Section 03 — Q5 validator (under pressure). Confirms but cannot override the primary type.
const Q5_VALIDATOR_MAP: Record<string, SeedType[]> = {
  push_harder: ["Builder", "Beacon", "Guardian"],
  withdraw: ["Shepherd"],
  caretake_others: ["Shepherd", "Weaver"],
  analyse: ["Builder", "Beacon", "Lantern", "Guardian"],
  talk_it_out: ["Weaver"],
  create_to_cope: ["Maker"],
  pray_reflect: ["Lantern", "Maker"],
};

// Section 03 — Q6 validator (the longing, open text). Keyword groups per seed type, per the algorithm doc's
// Q6 confirm markers (structural/systems, healing/relational, movement/vision, community, understanding, etc).
const Q6_KEYWORDS: Record<SeedType, string[]> = {
  Builder: ["build", "launch", "system", "structure", "solution", "organisation", "organization", "facility"],
  Shepherd: ["heal", "healing", "restor", "family", "care for", "stay with", "overlooked"],
  Beacon: ["lead", "movement", "cause", "direction", "vision", "change the direction"],
  Weaver: ["community", "gathering", "belong", "network", "known"],
  Lantern: ["understand", "clarity", "teach", "illuminat", "see themselves", "see the world"],
  Guardian: ["protect", "fight for", "defend", "right a wrong", "cause"],
  Maker: ["beautiful", "beauty", "express", "art", "write", "novel", "meaningful", "body of work"],
};

function matchQ6(q6Open: string): SeedType[] {
  const text = q6Open.toLowerCase();
  const matches: SeedType[] = [];
  (Object.keys(Q6_KEYWORDS) as SeedType[]).forEach((type) => {
    if (Q6_KEYWORDS[type].some((kw) => text.includes(kw))) matches.push(type);
  });
  return matches;
}

// Q12 keyword trigger — per Seedbearer_Seed_Assessment_Phase1.docx Section 05, this is the most
// important automation in the system. High-intent language here should notify the coach immediately.
const Q12_URGENT_KEYWORDS = [
  "desperate",
  "don't know what to do",
  "dont know what to do",
  "don't know who i am",
  "dont know who i am",
  "losing my",
  "losing him",
  "losing her",
  "coaching",
  "help",
  "crisis",
  "at my wit's end",
  "at my wits end",
];

function checkQ12Urgent(q12Open: string): boolean {
  const text = q12Open.toLowerCase();
  return Q12_URGENT_KEYWORDS.some((kw) => text.includes(kw));
}

export function calculateSeedType(answers: AssessmentAnswers): ScoringResult {
  const primaryType = Q2_PRIMARY_MAP[answers.q2Answer];

  // Q3 refiner — evaluate every selected answer (up to 2), not just one.
  const q3Signals = answers.q3Answers.flatMap((a) => Q3_SEED_MAP[a] ?? []);
  const q3Confirms = q3Signals.length === 0 || q3Signals.includes(primaryType);
  const q3Alternate = q3Signals.find((t) => t !== primaryType);

  // Q4 refiner (single answer).
  const q4Signals = Q4_SEED_MAP[answers.q4Answer] ?? [];
  const q4Confirms = q4Signals.length === 0 || q4Signals.includes(primaryType);
  const q4Alternate = q4Signals.find((t) => t !== primaryType);

  // Conflict resolution (Section 04 of the algorithm doc): both refiners must independently
  // contradict the primary anchor before the primary is overridden.
  let seedType = primaryType;
  let flagForReview = false;
  if (!q3Confirms && !q4Confirms) {
    seedType = q4Alternate ?? q3Alternate ?? primaryType;
    flagForReview = true;
  }

  // Validate with Q5 (pressure) and Q6 (longing) — cannot override, but flag if neither confirms.
  const q5Confirms = (Q5_VALIDATOR_MAP[answers.q5Answer] ?? []).includes(seedType);
  const q6Matches = matchQ6(answers.q6Open);
  const q6Confirms = q6Matches.length === 0 || q6Matches.includes(seedType);
  if (!q5Confirms && !q6Confirms) flagForReview = true;

  const confidence =
    [q3Confirms, q4Confirms, q5Confirms, q6Confirms].filter(Boolean).length / 4;

  // Q1 or Q12 open text strongly contradicting the scored type is also a human-review signal
  // (Section 04: "the most important reason to read Q1, Q6, and Q12 manually for every submission").
  const priorityResponse = answers.q9Internal === "numb" || answers.q9Internal === "heavy";
  const urgentQ12 = checkQ12Urgent(answers.q12Open);

  return { seedType, confidence, flagForReview, priorityResponse, urgentQ12 };
}
