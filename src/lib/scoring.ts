import type { SeedType } from "./assessment-data";
import { WOUND_TO_TYPE, type WoundValue } from "./story-assessment-data";

export type StoryAnswers = {
  wound: WoundValue;
  otherWords: string;
  woundCost: string;
  instinctType: SeedType;
  closingText: string;
  q9Internal: string;
};

export type ScoringResult = {
  seedType: SeedType;
  confidence: number;
  flagForReview: boolean;
  priorityResponse: boolean;
  urgentText: boolean;
};

// Two forced-choice signals in the story flow: the wound-word (Winter) and the instinct choice
// (Spring), each mapping directly to one of the seven types. The instinct choice is the primary
// Seed Type signal (it's presented in-narrative as exactly that); the wound-word is the refiner —
// if they agree, high confidence; if they disagree, the instinct still wins but it's flagged for
// the coach to read the wound-cost/other-words text before responding.
const TEXT_KEYWORDS: Record<SeedType, string[]> = {
  Builder: ["build", "launch", "system", "structure", "solution", "organisation", "organization", "facility"],
  Shepherd: ["heal", "healing", "restor", "family", "care for", "stay with", "overlooked"],
  Beacon: ["lead", "movement", "cause", "direction", "vision", "change the direction"],
  Weaver: ["community", "gathering", "belong", "network", "known"],
  Lantern: ["understand", "clarity", "teach", "illuminat", "see themselves", "see the world"],
  Guardian: ["protect", "fight for", "defend", "right a wrong", "cause"],
  Maker: ["beautiful", "beauty", "express", "art", "write", "novel", "meaningful", "body of work"],
};

function matchesText(text: string, type: SeedType): boolean {
  return TEXT_KEYWORDS[type].some((kw) => text.toLowerCase().includes(kw));
}

// Same clinical-safety keyword trigger as the old Q12 check, now applied to the story's own
// open-text reflections (wound-cost and closing text) — per the spec, this is the most important
// automation in the system and must not quietly disappear in the redesign.
const URGENT_KEYWORDS = [
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

function checkUrgent(...texts: string[]): boolean {
  return texts.some((text) => URGENT_KEYWORDS.some((kw) => text.toLowerCase().includes(kw)));
}

export function calculateSeedType(answers: StoryAnswers): ScoringResult {
  const woundType = WOUND_TO_TYPE[answers.wound];
  const instinctType = answers.instinctType;

  const seedType = instinctType;
  const woundConfirms = woundType === instinctType;

  const textMatches = matchesText(answers.otherWords, seedType) || matchesText(answers.closingText, seedType);
  const flagForReview = !woundConfirms;

  const confidence = [woundConfirms, textMatches].filter(Boolean).length / 2;

  const priorityResponse = answers.q9Internal === "numb" || answers.q9Internal === "heavy";
  const urgentText = checkUrgent(answers.woundCost, answers.closingText);

  return { seedType, confidence, flagForReview, priorityResponse, urgentText };
}
