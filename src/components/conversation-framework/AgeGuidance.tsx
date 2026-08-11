"use client";

import { useState } from "react";

type AgeKey = "early" | "middle" | "teen";

const TABS: { key: AgeKey; label: string; heading: string; items: string[] }[] = [
  {
    key: "early",
    label: "Ages 3–6",
    heading: "Early Childhood · Ages 3–6",
    items: [
      "Connection first is even more critical at this age. Young children cannot process correction when they feel unsafe.",
      "Simplify the three questions: “What happened? Was that a good choice? What can we do differently?”",
      "Consequences must be immediate and short. A 4-year-old cannot connect a consequence on Friday to behaviour on Tuesday.",
      "Restoration should be physical — a hug, proximity, a moment of warmth. Children this age need to feel belonging restored in their body, not just hear it.",
      "You go first is most powerful here. “I got cross and I shouldn’t have spoken to you like that. I’m sorry.” This is profoundly formative.",
    ],
  },
  {
    key: "middle",
    label: "Ages 7–12",
    heading: "Middle Childhood · Ages 7–12",
    items: [
      "Children this age have a genuine capacity for moral reasoning. The three questions will produce real reflection if you give them space.",
      "Consequences can be time-delayed by up to a day — but connect the consequence clearly to the behaviour.",
      "Begin introducing the language of values: “In our family we believe in honesty. What happened today didn’t line up with that.”",
      "Avoid public correction. Children this age are acutely aware of shame and audience. Address behaviour privately wherever possible.",
      "The accountability conversation becomes usable from around age 9 — simplified but structured: what was agreed, what happened, what we do next.",
    ],
  },
  {
    key: "teen",
    label: "Ages 13–18",
    heading: "Adolescence · Ages 13–18",
    items: [
      "Connection first is most important and most counterintuitive here. Give them time and space to regulate before the conversation.",
      "“I want to talk about what happened. Let’s do that in an hour when we’re both calmer.”",
      "Natural consequences are your most powerful tool. Your job is to stay alongside them as they learn, not shield them from learning.",
      "The full accountability conversation is appropriate from around 14–15. Let them have real ownership of the solution.",
      "You go first is the most powerful thing you can do at this age. A parent who genuinely owns a mistake in front of a teenager reaches them at a depth instructions never can.",
    ],
  },
];

export default function AgeGuidance() {
  const [active, setActive] = useState<AgeKey>("early");
  const tab = TABS.find((t) => t.key === active)!;

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setActive(t.key)}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
              active === t.key
                ? "border-soil bg-soil text-linen"
                : "border-mid-gray bg-transparent text-bark hover:border-soil hover:bg-soil hover:text-linen"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <h3 className="font-lora text-lg font-semibold text-soil">{tab.heading}</h3>
      <ul className="mt-4">
        {tab.items.map((item, i) => (
          <li
            key={i}
            className="relative border-b border-mid-gray py-3 pl-6 text-[0.95rem] leading-relaxed text-dark-gray last:border-none"
          >
            <span className="absolute left-0 top-[1.15rem] h-1.5 w-1.5 rounded-full bg-straw" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
