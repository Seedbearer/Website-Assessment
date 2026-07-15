export type SeedType =
  | "Builder"
  | "Shepherd"
  | "Beacon"
  | "Weaver"
  | "Lantern"
  | "Guardian"
  | "Maker";

export type Choice = { value: string; label: string };

export type OpenQuestion = {
  id: "q1" | "q6" | "q12";
  kind: "open";
  number: number;
  title: string;
  prompt: string;
  helper?: string;
};

export type ChoiceQuestion = {
  id: "q2" | "q3" | "q4" | "q5" | "q7" | "q8" | "q9" | "q10" | "q11";
  kind: "single" | "multi";
  number: number;
  title: string;
  prompt: string;
  options: Choice[];
  maxSelect?: number;
  helper?: string;
};

export type Question = OpenQuestion | ChoiceQuestion;

// Twelve questions, in order — exact wording from Seedbearer_Seed_Assessment_Phase1.docx.
export const QUESTIONS: Question[] = [
  {
    id: "q1",
    kind: "open",
    number: 1,
    title: "The Invitation",
    prompt:
      "When do you feel most fully yourself — like you're doing exactly what you were made to do? It doesn't have to be something impressive. It might be something you do when nobody's watching.",
    helper: "Open text — 3–5 sentences. No word count pressure.",
  },
  {
    id: "q2",
    kind: "single",
    number: 2,
    title: "How You Give",
    prompt:
      "When you're at your best — contributing something real to the people around you — what does that tend to look like?",
    helper: "Choose the one that feels most true. If two feel equally true, choose the one that costs you more energy when you can't do it.",
    options: [
      { value: "lead", label: "I lead — I take charge, set direction, and help people move forward" },
      { value: "build", label: "I build — I create things, systems, or solutions that didn't exist before" },
      { value: "care", label: "I care — I notice what people need and find ways to meet it" },
      { value: "teach", label: "I teach — I help people understand things, grow, or see differently" },
      { value: "connect", label: "I connect — I bring people together and make them feel they belong" },
      { value: "protect", label: "I protect — I stand up for people, speak truth, or defend what matters" },
      { value: "create", label: "I create — I make beauty, meaning, or expression through art, words, or ideas" },
    ],
  },
  {
    id: "q3",
    kind: "multi",
    number: 3,
    title: "How You Receive Energy",
    prompt: "What genuinely refuels you — not what you think should, but what actually does?",
    helper: "Choose up to two.",
    maxSelect: 2,
    options: [
      { value: "deep_conversation", label: "Deep, honest conversation with one person" },
      { value: "solving_problems", label: "Solving a problem no one else has figured out" },
      { value: "around_people", label: "Being around people — the energy in a room" },
      { value: "creating", label: "Creating something with my hands, words, or ideas" },
      { value: "time_alone", label: "Time alone to think and process" },
      { value: "learning", label: "Learning something that changes how I see the world" },
      { value: "movement_nature", label: "Physical movement or being in nature" },
      { value: "helped_someone", label: "Knowing I've genuinely helped someone" },
    ],
  },
  {
    id: "q4",
    kind: "single",
    number: 4,
    title: "What the World Misread",
    prompt:
      "What quality in you has most often been misunderstood, criticised, or used against you — but you sense it's actually part of how you were made?",
    helper: "Choose the one that lands most honestly.",
    options: [
      { value: "too_sensitive", label: "I feel things too deeply — called too sensitive or too intense" },
      { value: "overthinking", label: "I think too much — called overthinking or indecisive" },
      { value: "too_quiet", label: "I need too much quiet — called antisocial or cold" },
      { value: "too_much_space", label: "I take up too much space — called too much, too loud, too big" },
      { value: "push_too_hard", label: "I push too hard — called stubborn, intense, or difficult" },
      { value: "care_too_much", label: "I care too much about people — called naive or a pushover" },
      { value: "see_differently", label: "I see things differently — called too idealistic or not realistic" },
      { value: "move_slowly", label: "I move too slowly — called unmotivated or lazy" },
    ],
  },
  {
    id: "q5",
    kind: "single",
    number: 5,
    title: "Under Pressure",
    prompt: "When things get genuinely hard — not inconvenient, but hard — what do you actually do?",
    helper: "Choose the one that's most honest, not most admirable.",
    options: [
      { value: "push_harder", label: "I push harder and go quiet inside" },
      { value: "withdraw", label: "I withdraw to protect myself or others from what I might say or do" },
      { value: "caretake_others", label: "I start taking care of everyone around me instead of myself" },
      { value: "analyse", label: "I analyse — I need to understand before I can respond" },
      { value: "talk_it_out", label: "I talk it out — I can't process alone" },
      { value: "create_to_cope", label: "I create — making something helps me survive hard seasons" },
      { value: "pray_reflect", label: "I pray, reflect, or sit with it until something settles" },
    ],
  },
  {
    id: "q6",
    kind: "open",
    number: 6,
    title: "The Longing",
    prompt:
      "If you knew you couldn't fail — and nobody whose opinion you care about would judge you for it — what would you build, create, give, or become?",
    helper: "Open text — 2–4 sentences. This is the seed speaking. There are no wrong answers.",
  },
  {
    id: "q7",
    kind: "single",
    number: 7,
    title: "Relational Soil — Connection",
    prompt:
      "Right now, how much of yourself can you actually bring into your closest relationships — your partner, your kids, the people who matter most?",
    helper: "Choose the one that feels most honest today.",
    options: [
      { value: "a_lot", label: "A lot — I feel seen and safe in my closest relationships right now" },
      { value: "some", label: "Some — there's real connection but also real distance I'm not sure how to close" },
      { value: "not_much", label: "Not much — I'm showing up but holding a lot back, for reasons that feel complicated" },
      { value: "very_little", label: "Very little — I'm present physically but feel quite alone inside these relationships" },
      { value: "not_sure", label: "I'm not sure — I've been on autopilot long enough that I've lost track" },
    ],
  },
  {
    id: "q8",
    kind: "single",
    number: 8,
    title: "Relational Soil — What the Soil Needs",
    prompt: "If your closest relationships could have one thing they don't currently have enough of — what would it be?",
    helper: "Choose the one that resonates most.",
    options: [
      { value: "honesty", label: "Honesty — more of what's really going on being said out loud" },
      { value: "safety", label: "Safety — the ability to be imperfect without it costing too much" },
      { value: "time", label: "Time — real, unhurried presence with each other" },
      { value: "understanding", label: "Understanding — feeling genuinely known rather than managed or tolerated" },
      { value: "repair", label: "Repair — something that broke needs to be honestly addressed" },
      { value: "joy", label: "Joy — we're functional but we've lost lightness somewhere" },
    ],
  },
  {
    id: "q9",
    kind: "single",
    number: 9,
    title: "Internal Soil — Your Inner Ground",
    prompt: "When you get quiet enough to notice — what's the quality of the ground you're standing on inside yourself right now?",
    helper: "Choose the description that fits most honestly.",
    options: [
      { value: "solid", label: "Solid — I know who I am and I'm relatively grounded in it right now" },
      { value: "tired", label: "Tired — I'm okay but running on less than I should be" },
      { value: "dry", label: "Dry — I've been giving out for a while without much coming back in" },
      { value: "uncertain", label: "Uncertain — something in me doesn't quite know who I am right now" },
      { value: "heavy", label: "Heavy — I'm carrying something I haven't been able to put down" },
      { value: "numb", label: "Numb — I've been on autopilot long enough that I'm not sure what I feel" },
    ],
  },
  {
    id: "q10",
    kind: "multi",
    number: 10,
    title: "Internal Soil — What You Most Need",
    prompt: "Not what you think you should need — what do you actually find yourself longing for right now?",
    helper: "Choose up to two.",
    maxSelect: 2,
    options: [
      { value: "seen", label: "To be seen — to have someone understand what it's actually like to be me right now" },
      { value: "rest", label: "To rest — genuinely, without guilt" },
      { value: "belong", label: "To belong somewhere that doesn't require me to perform" },
      { value: "make_sense", label: "To make sense of something that's been confusing or painful for a long time" },
      { value: "challenge", label: "To be challenged — I'm understimulated and drifting" },
      { value: "hope", label: "To feel hopeful again — about myself, my family, or the future" },
      { value: "truth", label: "To be told the truth by someone who knows me and isn't managing me" },
    ],
  },
  {
    id: "q11",
    kind: "single",
    number: 11,
    title: "The Season",
    prompt: "If you had to name the season your life — or your family — is in right now, which feels closest?",
    helper: "Choose one.",
    options: [
      { value: "winter", label: "Winter — things feel stuck, buried, or not growing the way they should" },
      { value: "thaw", label: "Thaw — something is beginning to soften or shift, but slowly" },
      { value: "spring", label: "Spring — things are starting to break ground — new growth is visible" },
      { value: "summer", label: "Summer — things are growing, fruit is visible, there's real momentum" },
    ],
  },
  {
    id: "q12",
    kind: "open",
    number: 12,
    title: "The Ask",
    prompt: "What brought you here today? You can be as specific or as general as you like. There's no wrong answer.",
    helper: "Open text — no word limit.",
  },
];

export const TOTAL_QUESTIONS = 12;

export const SEED_TYPE_INFO: Record<SeedType, { tagline: string; description: string }> = {
  Builder: {
    tagline: "I make things that last",
    description:
      "You are most alive when you're creating something that didn't exist before — a system, a structure, a solution, a physical thing. You see what could be before others see it, and you have the capacity to bring it into being. You are not a dreamer — you are someone who builds the dream.",
  },
  Shepherd: {
    tagline: "I stay when others leave",
    description:
      "You are most alive when someone who has been overlooked, wounded, or left behind is seen and cared for. You don't give up on people easily. Your capacity for loyalty and empathy is extraordinary — and it has probably cost you more than people realise.",
  },
  Beacon: {
    tagline: "I show people where to go",
    description:
      "You lead. Not because you decided to — because people naturally look to you when things are uncertain. You carry clarity that others find orienting. At your best you don't just point the way — you walk it first.",
  },
  Weaver: {
    tagline: "I help people find each other",
    description:
      "You are most alive in the space between people. You read rooms, sense disconnection, and have an instinct for bringing the right people together in the right way. You make belonging happen without anyone quite noticing you did it.",
  },
  Lantern: {
    tagline: "I help people see",
    description:
      "You are most alive when understanding breaks through — when someone gets it, grows, or sees themselves or the world differently because of a conversation with you. You carry knowledge with purpose — not to impress, but to illuminate.",
  },
  Guardian: {
    tagline: "I stand between people and what would harm them",
    description:
      "You are most alive when someone who cannot defend themselves has you in their corner. You speak truth when others stay quiet. You protect what is worth protecting — people, values, the vulnerable. Your courage often looks like stubbornness until the moment it matters.",
  },
  Maker: {
    tagline: "I put something true into the world",
    description:
      "You are most alive when you are making — writing, painting, designing, building with your hands, composing, crafting. You don't just appreciate beauty — you produce it. You carry an inner world that is rich, particular, and not easily shared, and you spend your life finding ways to bring it out.",
  },
};
