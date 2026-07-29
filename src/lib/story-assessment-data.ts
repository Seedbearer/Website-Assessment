import type { SeedType } from "./assessment-data";

export type WoundValue = "stubborn" | "a pushover" | "too loud" | "naive" | "indecisive" | "difficult" | "unmotivated";
export type StandVirtue = "Courage" | "Clarity";
export type ReachVirtue = "Joy" | "Faithfulness";
export type GardenVirtue = "Wonder" | "Wisdom";
export type WalkVirtue = "Adventure" | "Beauty";

// Wound word (Winter) — maps directly to a Seed Type, per the wound-pattern language each type
// is already documented with (Seedbearer_Scoring_Algorithm.docx).
export const WOUND_TO_TYPE: Record<WoundValue, SeedType> = {
  stubborn: "Builder",
  "a pushover": "Shepherd",
  "too loud": "Beacon",
  naive: "Weaver",
  indecisive: "Lantern",
  difficult: "Guardian",
  unmotivated: "Maker",
};

export const WOUND_OPTIONS: WoundValue[] = [
  "stubborn",
  "a pushover",
  "too loud",
  "naive",
  "indecisive",
  "difficult",
  "unmotivated",
];

// Instinct (Spring) — the primary Seed Type signal. One instinctive action per type.
export const INSTINCT_OPTIONS: { type: SeedType; text: string }[] = [
  { type: "Builder", text: "build something that will hold" },
  { type: "Shepherd", text: "tend to whoever is hurting" },
  { type: "Beacon", text: "take the lead and set a direction" },
  { type: "Weaver", text: "call the others together" },
  { type: "Lantern", text: "study it until I understand it" },
  { type: "Guardian", text: "stand watch, keep it safe" },
  { type: "Maker", text: "make something out of what is here" },
];

export const STAND_VIRTUE_OPTIONS: { value: StandVirtue; label: string }[] = [
  { value: "Courage", label: "I stand, even shaking" },
  { value: "Clarity", label: "The fog has to lift first" },
];

export const REACH_VIRTUE_OPTIONS: { value: ReachVirtue; label: string }[] = [
  { value: "Joy", label: "The strength is already in me, so I give it away" },
  { value: "Faithfulness", label: "I don't leave, whatever it costs" },
];

export const GARDEN_VIRTUE_OPTIONS: { value: GardenVirtue; label: string }[] = [
  { value: "Wonder", label: "I have to see it up close" },
  { value: "Wisdom", label: "I want to understand why it grows there and not here" },
];

export const WALK_VIRTUE_OPTIONS: { value: WalkVirtue; label: string }[] = [
  { value: "Adventure", label: "I want to know what's over there" },
  { value: "Beauty", label: "Something that lovely is worth walking toward" },
];

export type VirtueInfo = { name: string; description: string };

export const VIRTUE_INFO: Record<StandVirtue | ReachVirtue | GardenVirtue | WalkVirtue, VirtueInfo> = {
  Courage: { name: "Courage", description: "You stand, even shaking." },
  Clarity: { name: "Clarity", description: "You need the fog to lift before you move." },
  Joy: { name: "Joy", description: "The strength is already in you, so you give it away." },
  Faithfulness: { name: "Faithfulness", description: "You don't leave, whatever it costs." },
  Wonder: { name: "Wonder", description: "You have to see it up close." },
  Wisdom: { name: "Wisdom", description: "You want to understand why it grows there and not here." },
  Adventure: { name: "Adventure", description: "You want to know what's over there." },
  Beauty: { name: "Beauty", description: "Something that lovely is worth walking toward." },
};

// Narrative copy for each scene — kept verbatim from the approved prototype. The softened line in
// Thaw ("something stirs...") deliberately avoids a direct scripture citation — don't revert it.
export const STORY_SCENES = {
  winterWall: {
    body: "You wake at the bottom of a well. The walls are close, covered in old words — carved deep in some places, scratched thin and half-legible in others, layered over each other the way things get written when they're written more than once. Some of it you don't recognize. Some of it you know by heart, because you're the one who put it there, one bad year at a time.",
    prompt: "Which one is carved deepest?",
    otherWordsPrompt: "Are there other words scratched into this wall — ones only you would recognize?",
  },
  winterStand: {
    woundCostPrompt: "When has that cost you the most?",
    body: "Something moves through the dark before your mind catches up — something stirs, and you begin to get a sense of the light. Your legs remember, faintly, how to hold you.",
    prompt: "What gets you to your feet?",
  },
  thaw: {
    body: "Standing now, you're not alone down here. Someone else is still on the ground beside you. The walls stop shouting so loud once you're upright — there's room to notice who else is in the dark with you.\n\nYou reach down.",
    prompt: "What moves you to reach for them?",
  },
  springInstinct: {
    body: "You climb out. The ground stretches bare and cracked in every direction. Before you even see anything worth doing, your hands already know what they want to do.",
    prompt: "Without thinking, what do your hands want to do?",
  },
  springGarden: {
    body: "Then you see it — off toward the tree line, one square of ground that shouldn't be able to hold anything living, and does. Vines heavy enough to bend the trellis they climb. Leaves broad as a hand, unbothered by the cracked dirt just past their border. Rows too straight and too green to have grown there on their own — someone has been tending this a long time.\n\nA woman is on her knees in the middle of it, hands in the soil, singing while she works — not performing the song, just working and singing as though they're the same motion for her. Fruit hangs low enough to reach without stretching. The air smells like something ready, not something rotting.\n\nYou don't recognize the tune. You recognize what it's doing to you — something in you that had quietly given up on flourishing being possible is starting to remember otherwise.",
    prompt: "What draws your attention toward it?",
  },
  summer: {
    body: "You start walking. The bare ground doesn't change right away — but you do. The song gets louder, or maybe you're just listening better.\n\nThe garden is still a long way off.",
    prompt: "What keeps you walking?",
  },
  close: {
    body: "Four seasons. Four choices. This is the shape of what carried you out of the well.",
    whoAreYou: "Who do you think you are?",
    closingPrompt: "What do you want to carry out of this story, into your family?",
  },
};
