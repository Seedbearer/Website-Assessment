// Content and routing logic for the Family Triage Assessment ("Door 1") — see
// Seedbearer_Triage_Assessment.docx for the source spec. Q1 is the sole routing question; Q2-Q6
// add depth/urgency flags but don't change which category a submission lands in.

export type TriageCategory =
  | "Disconnection"
  | "Conflict"
  | "Behaviour"
  | "Identity Crisis"
  | "Parenting Disagreement"
  | "Overwhelm"
  | "Transition";

export const Q1_OPTIONS: { value: string; label: string; category: TriageCategory }[] = [
  { value: "a", label: "We’ve lost connection — my child has pulled away and I don’t know how to reach them", category: "Disconnection" },
  { value: "b", label: "There is ongoing conflict — arguments, defiance, power struggles that feel constant", category: "Conflict" },
  { value: "c", label: "My child is doing something specific I don’t know how to handle", category: "Behaviour" },
  { value: "d", label: "My child is struggling with who they are — identity, belonging, or their sense of worth", category: "Identity Crisis" },
  { value: "e", label: "My partner and I are not on the same page with our parenting", category: "Parenting Disagreement" },
  { value: "f", label: "Everything feels overwhelming — I don’t know where to start", category: "Overwhelm" },
  { value: "g", label: "Something has changed that has destabilised our family — a transition or loss", category: "Transition" },
];

export const Q2_OPTIONS = [
  { value: "a", label: "This is new — it started recently (last few weeks)" },
  { value: "b", label: "A few months — it’s been building for a while" },
  { value: "c", label: "A long time — this has been our reality for over a year" },
  { value: "d", label: "It’s always been this way, as far as I can remember" },
];

export const Q3_OPTIONS = [
  { value: "a", label: "A specific child (under 12)" },
  { value: "b", label: "A teenager (13–18)" },
  { value: "c", label: "My relationship with my partner / co-parent" },
  { value: "d", label: "The whole family — everyone is feeling it" },
  { value: "e", label: "Honestly, me more than anyone else" },
];

export const Q4_OPTIONS = [
  { value: "a", label: "I raise my voice or react in ways I later regret" },
  { value: "b", label: "I shut down or withdraw to protect everyone from my reaction" },
  { value: "c", label: "I try to manage and control the situation more tightly" },
  { value: "d", label: "I give in to keep the peace even when I know I shouldn’t" },
  { value: "e", label: "I keep going through the motions but I’m running on empty" },
  { value: "f", label: "I genuinely don’t know — I feel paralysed" },
];

export const Q5_OPTIONS = [
  { value: "a", label: "My child and I would actually talk again — real conversation, not just logistics" },
  { value: "b", label: "There would be less conflict and more peace in our home" },
  { value: "c", label: "I would know what to do when things escalate" },
  { value: "d", label: "My child would feel more secure in who they are" },
  { value: "e", label: "My partner and I would be working together instead of against each other" },
  { value: "f", label: "I would feel less alone in this" },
  { value: "g", label: "I would have a clear next step instead of just more confusion" },
];

export const Q6_OPTIONS = [
  { value: "a", label: "I’m okay — stretched but managing" },
  { value: "b", label: "I’m tired — I’ve been carrying this for a long time" },
  { value: "c", label: "I’m struggling — this is taking more than I have" },
  { value: "d", label: "I’m not okay — I need support too, not just my family" },
];

const NOT_OKAY = "d";

export function categoryForQ1(q1: string): TriageCategory {
  return Q1_OPTIONS.find((o) => o.value === q1)?.category ?? "Overwhelm";
}

export function isPriority(q6: string): boolean {
  return q6 === NOT_OKAY;
}

export function needsClinicalReferral(category: TriageCategory, q6: string): boolean {
  return (category === "Behaviour" || category === "Transition") && q6 === NOT_OKAY;
}

export type MatchedResponse = {
  category: TriageCategory;
  emoji: string;
  presentingLine: string;
  whatToKnow: string;
  nextSteps: { label: string; url?: string; description?: string }[];
  takeThisFurther: string;
  safetyNote?: string;
};

export const MATCHED_RESPONSES: Record<TriageCategory, MatchedResponse> = {
  Disconnection: {
    category: "Disconnection",
    emoji: "🧵",
    presentingLine: "“We’ve lost each other and I don’t know how to get back.”",
    whatToKnow:
      "What you’re feeling is one of the most common and most painful experiences in family life — and it doesn’t mean you’ve failed. Disconnection happens gradually, usually through a series of small moments where the child learned it wasn’t safe to bring the real thing. The relationship is not broken. It is waiting. And connection, once genuinely rebuilt, goes deeper than it was before.",
    nextSteps: [
      { label: "The Honour Framework", url: "/honour-framework", description: "Start here — read the section on keeping conversations open and the five-step process. This is your most practical immediate tool for beginning to reconnect." },
      { label: "Why Your Family Needs More Fun", url: "/blog/why-your-family-needs-more-fun", description: "Connection is rebuilt in ordinary moments, not big conversations — this reframe often changes everything." },
    ],
    takeThisFurther:
      "Once you’ve had a chance to work through the Honour Framework, the natural next step is understanding the deeper pattern — why the disconnection happened and what both you and your child are designed to need. The Seed Assessment opens that conversation. Or book a free 30-minute discovery call and we’ll talk through your specific situation together.",
  },
  Conflict: {
    category: "Conflict",
    emoji: "⚡",
    presentingLine: "“Everything is volatile. I’m exhausted and I don’t know what to do.”",
    whatToKnow:
      "Ongoing conflict in a family is rarely about the thing it appears to be about. Beneath the arguments and defiance is almost always an unmet need — in your child, and often in you too. That doesn’t mean the behaviour is acceptable. It means the behaviour is communicating something that hasn’t found words yet. The Honour Framework gives you a practical, step-by-step process for responding to conflict from a place of strength rather than fear — and you can start using it tonight.",
    nextSteps: [
      { label: "The Honour Framework", url: "/honour-framework", description: "The Five Steps and the Accountability Conversation are built exactly for what you’re describing. Pay particular attention to Step 2 (separating the person from the behaviour), the Three Questions, and the “When It’s Hard” section." },
      { label: "Self-Compassionate Parenting", url: "/blog/self-compassionate-parenting", description: "The section on accountability with warmth is directly relevant." },
    ],
    takeThisFurther:
      "The Honour Framework gives you the immediate tools. When you’re ready to go deeper — to understand why your family keeps landing in the same conflict patterns and what both you and your child are actually designed for — the Seed Assessment is the next step. Or if the conflict feels too acute for a resource, book a free 30-minute discovery call and let’s talk directly.",
  },
  Behaviour: {
    category: "Behaviour",
    emoji: "🚨",
    presentingLine: "“Something specific is happening and I don’t have the tools for it.”",
    whatToKnow:
      "When a child’s behaviour is specific and concerning — lying, withdrawal, self-harm risk, substances, school refusal — the most important thing to know is this: the behaviour is a signal, not the problem. Something underneath it is asking for help in the only language currently available. That doesn’t mean the behaviour has no consequences. It means the consequences need to be held alongside genuine curiosity about what’s going on underneath.",
    nextSteps: [
      { label: "The Honour Framework", url: "/honour-framework", description: "Particularly the scenarios section, which covers lying and repeated patterns." },
      { label: "Book a discovery call", url: "/coaching", description: "Some presenting behaviours need a direct conversation before a resource. If what’s happening involves risk to your child’s safety, a call is the right first step." },
    ],
    takeThisFurther:
      "Book a free 30-minute discovery call — what’s happening in your family deserves a real conversation, not a template response.",
    safetyNote:
      "If what is happening involves risk to your child’s safety — self-harm, substances, dangerous behaviour — please reach out to a licensed mental health professional alongside any coaching support. Seedbearer provides coaching, education, and discipleship, not clinical mental health treatment.",
  },
  "Identity Crisis": {
    category: "Identity Crisis",
    emoji: "🌱",
    presentingLine: "“My child is struggling with who they are — and I don’t know how to help.”",
    whatToKnow:
      "A child who doesn’t know who they are is a child whose seed hasn’t had the right soil yet. The struggle with belonging, comparison, and worth that you’re seeing in your child is one of the most common — and most important — challenges in adolescence. Your child’s identity crisis is usually, underneath it, an invitation for them to discover the design that was always in them. The most powerful thing you can do is help them find it — and the most powerful place to start is with your own.",
    nextSteps: [
      { label: "You Were Not an Accident", url: "/blog/identity-values-personality-gifts", description: "The identity framework that underpins everything we do." },
      { label: "Take the Seed Assessment with your teenager", url: "/assessment", description: "Both of you taking it and comparing results opens conversations that are almost impossible to have any other way." },
    ],
    takeThisFurther:
      "The Seed Assessment is specifically designed for this. It identifies the unique design — the seed type — of your teenager and gives them language for who they were made to be. Take it yourself first, then invite your teenager to take it. A discovery call can guide you through the results together.",
  },
  "Parenting Disagreement": {
    category: "Parenting Disagreement",
    emoji: "👥",
    presentingLine: "“We’re parenting against each other and it’s costing the children.”",
    whatToKnow:
      "When parents are not on the same page, children learn to navigate the gap between them — and that navigation is exhausting, destabilising, and teaches them that relationships don’t hold when things are hard. The disagreement itself is rarely about the specific issue on the surface. It is almost always about different wounds, different fears, and different experiences of how family is supposed to work. The most effective place to start is not a parenting strategy. It is an honest conversation between the two of you about what you each carry.",
    nextSteps: [
      { label: "The Honour Framework", url: "/honour-framework", description: "The accountability conversation framework is directly applicable to the conversation you need to have with your partner." },
      { label: "Self-Compassionate Parenting", url: "/blog/self-compassionate-parenting", description: "The section on healthy boundaries." },
      { label: "Book a couples or co-parenting discovery call", url: "/coaching", description: "This situation benefits most from a direct conversation." },
    ],
    takeThisFurther:
      "A discovery call gives you and your partner a facilitated starting point — a neutral, warm space to begin getting on the same page. Book a free 30-minute call for both of you together.",
  },
  Overwhelm: {
    category: "Overwhelm",
    emoji: "🌋",
    presentingLine: "“Everything feels broken. I don’t know where to start and I have nothing left.”",
    whatToKnow:
      "The most important thing we want to say to you right now is this: the fact that you are here, filling out this form, looking for a way forward — that is not nothing. That is the beginning. You don’t need to fix everything. You need one next step — not the whole solution, just the smallest possible movement in the right direction. We will help you find that.",
    nextSteps: [
      { label: "Self-Compassionate Parenting", url: "/blog/self-compassionate-parenting", description: "Start with the section “When it’s hard.”" },
      { label: "Book a discovery call", url: "/coaching", description: "When everything feels overwhelming, a conversation is more useful than a resource. Let’s talk about where to start." },
    ],
    takeThisFurther:
      "You don’t have to figure this out alone. Book a free 30-minute discovery call — no agenda, no pressure, just a real conversation about where you are and what the next step looks like.",
    safetyNote:
      "If your overwhelm is accompanied by feelings of hopelessness, inability to function, or thoughts of harming yourself or others, please reach out to a mental health professional or crisis service first. You deserve real support.",
  },
  Transition: {
    category: "Transition",
    emoji: "🌊",
    presentingLine: "“Something has changed that has destabilised everything. We’re not okay.”",
    whatToKnow:
      "Transitions — divorce, blended families, loss, a major move, a significant life change — shake the foundations of family identity. Who are we now? What holds us together? These are not small questions, and they don’t have quick answers. What matters most in a season of transition is not having the answers — it is maintaining connection through the uncertainty. Families who stay connected through transitions, even imperfectly, come out the other side knowing each other in a way they couldn’t have before.",
    nextSteps: [
      { label: "Why Your Family Needs More Fun", url: "/blog/why-your-family-needs-more-fun", description: "Connection in ordinary moments is the anchor during disruptive seasons." },
      { label: "The Honour Framework", url: "/honour-framework", description: "The repair conversation is particularly relevant in seasons of transition." },
      { label: "Book a discovery call", url: "/coaching", description: "Transition seasons often need direct support rather than a resource." },
    ],
    takeThisFurther:
      "A discovery call is the right starting point for a transition season — not because we have all the answers, but because naming what’s happening with someone who understands family systems is itself stabilising. Book a free 30-minute call.",
    safetyNote:
      "If the transition involves bereavement, significant mental health impact, or family breakdown requiring legal or clinical support, please ensure those needs are being met alongside any coaching work.",
  },
};
