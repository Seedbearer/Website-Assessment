import type { SeedType } from "./assessment-data";

export type SeedTypeContent = {
  practice: string;
  reflection: string;
};

// Placeholder content — real copy to be written by the coach. This defines the page structure
// (one practice + one reflection prompt per seed type) that /dashboard/content/[seedType] renders;
// swap the strings below for real material whenever it's ready, no routing/code changes needed.
export const SEED_TYPE_CONTENT: Record<SeedType, SeedTypeContent> = {
  Builder: {
    practice: "This week, name one thing you're building — even a small one — and tell someone about it before it's finished.",
    reflection: "Where in your life right now are you being asked to build without the resources you'd choose? What would it look like to build anyway?",
  },
  Shepherd: {
    practice: "Notice one moment this week where you cared for someone without being asked. Write down what it cost you.",
    reflection: "Who has stayed for you the way you stay for others? If the answer is no one — what would it take to let someone try?",
  },
  Beacon: {
    practice: "Before you lead something this week, ask one person what they actually need from you first.",
    reflection: "What's the difference between the vision you're carrying and the certainty you're performing?",
  },
  Weaver: {
    practice: "This week, let someone else make the introduction, plan the gathering, or hold the room — and notice how it feels.",
    reflection: "Do you belong to the community you've built, or do you just build it for everyone else?",
  },
  Lantern: {
    practice: "Find one person this week and ask them a real question — one you don't already know the answer to.",
    reflection: "When was the last time someone's insight changed how you saw yourself? What made you receptive to it?",
  },
  Guardian: {
    practice: "This week, name one thing you're protecting and say out loud why it matters, to someone who needs to hear it.",
    reflection: "Is there a fight you're still carrying that's already over? What would it mean to put it down?",
  },
  Maker: {
    practice: "Make something this week purely because you want to — not because it's useful or will be seen.",
    reflection: "What have you made that you've never shown anyone? What's kept it hidden?",
  },
};
