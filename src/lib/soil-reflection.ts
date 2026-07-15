// Short reflections responding to Q9 (internal soil) and Q11 (season), combined on the results page.
// Per Seedbearer_Seed_Assessment_Phase1.docx Section 04: name what they're carrying without dwelling
// in it, then turn toward what the soil needs.

const Q9_REFLECTION: Record<string, string> = {
  solid: "You sound relatively grounded right now — which is real, and worth naming before anything else.",
  tired: "You sound like you're running on less than you should be right now.",
  dry: "It sounds like you've been giving out for a while without much coming back in.",
  uncertain: "It sounds like something in you doesn't quite know who you are right now — and that's worth sitting with, not rushing past.",
  heavy: "It sounds like you're carrying something you haven't been able to put down yet.",
  numb: "It sounds like you've been on autopilot long enough that you're not entirely sure what you feel — and that deserves care, not a pep talk.",
};

const Q11_REFLECTION: Record<string, string> = {
  winter: "If this season feels like Winter — stuck, buried, not growing the way it should — that's not a verdict on you. Winter is still part of the cycle.",
  thaw: "If something in this season is just beginning to soften or shift, even slowly, that's real movement, not nothing.",
  spring: "If new growth is starting to break ground in this season, that's worth noticing — even before the fruit is visible.",
  summer: "If there's real momentum in this season, that's worth celebrating — and worth protecting.",
};

export function soilReflection(q9: string, q11: string): string {
  const q9Text = Q9_REFLECTION[q9] ?? "";
  const q11Text = Q11_REFLECTION[q11] ?? "";
  return [q9Text, q11Text].filter(Boolean).join(" ");
}
