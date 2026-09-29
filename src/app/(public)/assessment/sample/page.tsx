import Button from "@/components/ui/Button";

export const metadata = {
  title: "A Sample Family Map",
  description:
    "See exactly what a Family Map looks like — a real example, with names changed, showing how the Seed Assessment becomes a hand-written map of who your family actually is.",
  alternates: { canonical: "https://seedbearerfamily.com/assessment/sample" },
};

const FAMILY = [
  {
    name: "Dan",
    role: "Guardian · Father",
    body: "Truth-teller and protector. Says the hard thing when it needs saying, and carries real conviction about what's right.",
  },
  {
    name: "Renee",
    role: "Lantern · Mother",
    body: "Understands before she acts. Sees what others miss, and needs room to think before she's asked to decide.",
  },
  {
    name: "Maya, 14",
    role: "Beacon",
    body: "Leads without being asked to. Sees where the family — or a friend group — should go next, and moves toward it.",
  },
  {
    name: "Eli, 11",
    role: "Shepherd",
    body: "Notices who's struggling before anyone says a word. Measures a good day by whether everyone around him is okay.",
  },
  {
    name: "Sam, 8",
    role: "Builder",
    body: "Happiest with something to make or finish. Measures the day by what got done, and lights up when it's noticed.",
  },
];

const ADULT_PROFILES = [
  {
    name: "Dan",
    type: "Guardian",
    rows: [
      ["Design", "Guardians are built to see what's true and say it, even when it costs them something. Conviction is their engine — they hold a line others are tempted to soften."],
      ["Gift to the family", "Dan gives this family backbone. When something is wrong, everyone already knows he'll name it instead of letting it slide. That's safety, even when it doesn't feel comfortable in the moment."],
      ["Soil needs", "Guardians need to be told, out loud and often, “you might be right” — not because they're fragile, but because conviction without anyone pushing back can calcify into rigidity. He also needs permission to be soft without reading it as losing ground."],
      ["Watch for", "Under stress, Dan's directness can arrive as a verdict instead of an invitation — especially to a child who hears tone before content. Watch for whether the correction is landing as “I see you and I care” or just “you're wrong.”"],
    ],
  },
  {
    name: "Renee",
    type: "Lantern",
    rows: [
      ["Design", "Lanterns are built to understand before they move. They see three steps ahead, notice what will go wrong on the way, and would rather be right than be fast."],
      ["Gift to the family", "Renee is the reason this family doesn't repeat the same mistake twice. She sees the pattern underneath the argument, not just the argument itself, and that insight — offered at the right moment — changes outcomes."],
      ["Soil needs", "Renee needs time before she's asked to decide, and she needs that time to be respected rather than read as stalling. A standing, low-stakes moment each week to think out loud — with no pressure to land anywhere — keeps her insight flowing instead of stuck."],
      ["Watch for", "Understanding can become its own hiding place. Watch for whether Renee is still gathering information on something the family actually needs her to decide."],
    ],
  },
];

const TEEN_PROFILE = {
  name: "Maya, 14",
  type: "Beacon",
  rows: [
    ["Design", "Beacons see where things should go before anyone else does, and they move toward it — in a friend group, a classroom, or a family conversation. Leadership isn't a role Maya applies for. It's just how she's built."],
    ["Gift", "Maya brings momentum. When something needs to actually happen — not just get talked about — she's often the one who makes the first move."],
    ["Soil needs", "Real responsibility, not busywork. Beacons wilt when they're told to lead “someday” — they need a lane that's actually theirs now."],
  ],
  note: "This card is yours. You don't have to share it with anyone until you want to.",
};

const CHILD_PROFILES = [
  {
    name: "Eli, 11",
    type: "Shepherd",
    forLine: "For Dan and Renee — about Eli",
    rows: [
      ["What he's working out", "What an 11-year-old Shepherd is usually working through is whether his own needs are allowed to matter as much as everyone else's. Eli tracks the emotional temperature of every room he's in — often before the adults do."],
      ["What he most needs from you", "Ask Eli directly, sometimes, “how are you — not how's everyone else.” Watch for whether he's absorbing tension that isn't his to carry."],
      ["Watch for", "If Eli goes quiet after a conflict between other family members, it may not be that he's fine — it may be that he's monitoring everyone else's okayness instead of naming his own."],
    ],
  },
  {
    name: "Sam, 8",
    type: "Builder",
    forLine: "For Dan and Renee — about Sam",
    rows: [
      ["What he's working out", "What an 8-year-old Builder is usually working through is whether he's valued for what he makes, or for who he is. Sam measures his own worth by output earlier than most kids his age."],
      ["What he most needs from you", "Notice Sam when he hasn't made anything — praise rest and presence, not only finished projects, so his sense of worth doesn't attach only to productivity this young."],
      ["Watch for", "Watch for whether Sam is quietly comparing his pace to his older siblings' and concluding he's behind, rather than simply younger."],
    ],
  },
];

const PAIRS = [
  {
    title: "Dan & Renee — Guardian + Lantern",
    tag: "Productive tension · Parents",
    whatToName: "Action and analysis. Dan wants to act on what's true; Renee wants to fully understand it first. Together they make the best decisions in the house — just not the fastest ones.",
    whatHelps: "Before the truth, a question: Dan asks what Renee sees before saying what he sees. Renee gives Dan a time by which she'll have thought it through, so understanding doesn't quietly become indefinite delay.",
  },
  {
    title: "Dan & Maya — Guardian + Beacon",
    tag: "Watch carefully · Parent–child",
    whatToName: "Two strong-willed people who both believe they're right. Powerful when they're aligned and pointed at the same thing. Combustible when they're not — neither one backs down easily.",
    whatHelps: "Respect first, always — Maya will fight harder against what feels unjust than against what's merely inconvenient. Give her a real, named lane of her own, so the friction isn't over who's in charge of everything.",
  },
  {
    title: "Maya & Eli — Beacon + Shepherd",
    tag: "Productive tension · Siblings",
    whatToName: "Maya moves fast and leads; Eli needs to know everyone's okay before anyone moves. The tension between them is real, and it's valuable once it's named as a difference in design, not a flaw in either one.",
    whatHelps: "Maya asks “is everyone okay?” before charging ahead. Eli says plainly what he needs instead of quietly absorbing the pace.",
  },
];

const CONVERSATION_STEPS = [
  { title: "Before you sit down", body: "Read your own card first, then your children's. Decide which one or two pairings you'll bring tonight, and leave the “watch carefully” ones for another time." },
  { title: "Opening", body: "Lead with delight, not diagnosis: “We're excited about who each of you are created to be.” Own your own mistakes first — it lowers everyone's guard before anyone's asked to be seen." },
  { title: "Going around", body: "One question each: “What in your card felt true? Was there anything that didn't?” The second half matters — it tells everyone the card isn't the authority. They are." },
  { title: "Permission", body: "Say it out loud, to the whole room: “You don't have to share tonight. It's yours.”" },
  { title: "If it gets hard", body: "Someone going quiet isn't a sign it's going wrong. Let them leave the table if they need to. Come back in a week, one-to-one, without the document." },
  { title: "Closing", body: "“I think our family is beginning to find out — together.” The goal was never to finish tonight. It was to start." },
];

function ProfileTable({ rows }: { rows: string[][] }) {
  return (
    <div className="mt-4 divide-y divide-mid-gray border-t border-mid-gray">
      {rows.map(([label, text]) => (
        <div key={label} className="grid gap-1 py-4 sm:grid-cols-[180px_1fr] sm:gap-6">
          <p className="font-lora text-sm italic text-bark">{label}</p>
          <p className="text-sm leading-relaxed text-dark-gray">{text}</p>
        </div>
      ))}
    </div>
  );
}

export default function SampleFamilyMapPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-soil px-4 py-20 text-center md:px-8">
        <div className="mx-auto max-w-3xl">
          <span className="inline-block rounded-full border border-straw px-4 py-1 text-xs font-semibold uppercase tracking-widest text-straw">
            Sample · Illustrative example, not a real family
          </span>
          <h1 className="mt-6 font-lora text-3xl font-normal text-linen md:text-5xl">A Sample Family Map</h1>
          <p className="mx-auto mt-5 max-w-xl text-lg italic text-straw">
            This is what a real family receives — with real names, replaced here with a composite
            family so you can see exactly how it works before you order your own.
          </p>
        </div>
      </section>

      {/* Family at a glance */}
      <section className="bg-off-white px-4 py-16 md:px-8">
        <div className="mx-auto max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-bark">Family at a glance</p>
          <h2 className="mt-2 font-lora text-2xl text-soil md:text-3xl">The Family, Mapped</h2>
          <p className="mt-3 max-w-2xl text-dark-gray">
            Every Family Map starts here — one page that shows how the whole family is built,
            before going deeper into any one person or pairing.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {FAMILY.map((m) => (
              <div key={m.name} className="rounded-r-lg border-l-4 border-straw bg-linen p-5">
                <p className="font-lora text-lg text-soil">{m.name}</p>
                <p className="text-xs font-semibold uppercase tracking-wide text-straw">{m.role}</p>
                <p className="mt-2 text-sm leading-relaxed text-dark-gray">{m.body}</p>
              </div>
            ))}
          </div>
          <blockquote className="mt-8 rounded-r-lg border-l-4 border-straw bg-linen p-6">
            <p className="font-lora italic leading-relaxed text-soil">
              &ldquo;This is not a diagnosis. It is a mirror. Use it as a starting language for
              understanding each other — not a final word on who anyone is.&rdquo;
            </p>
          </blockquote>
        </div>
      </section>

      {/* Adult profiles */}
      <section className="bg-linen px-4 py-16 md:px-8">
        <div className="mx-auto max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-bark">Full profile pages</p>
          <h2 className="mt-2 font-lora text-2xl text-soil md:text-3xl">One Page, Every Person</h2>
          <p className="mt-3 max-w-2xl text-dark-gray">Each adult and each child gets their own page, written around them specifically.</p>
          <div className="mt-8 space-y-6">
            {ADULT_PROFILES.map((p) => (
              <div key={p.name} className="rounded-lg border border-mid-gray bg-off-white p-6">
                <p className="font-lora text-xl text-soil">{p.name}</p>
                <p className="text-xs font-semibold uppercase tracking-wide text-straw">{p.type}</p>
                <ProfileTable rows={p.rows} />
              </div>
            ))}

            <div className="rounded-lg border border-mid-gray bg-off-white p-6">
              <p className="font-lora text-xl text-soil">{TEEN_PROFILE.name}</p>
              <p className="text-xs font-semibold uppercase tracking-wide text-straw">{TEEN_PROFILE.type}</p>
              <ProfileTable rows={TEEN_PROFILE.rows} />
              <p className="mt-4 text-sm italic text-bark">{TEEN_PROFILE.note}</p>
            </div>

            {CHILD_PROFILES.map((p) => (
              <div key={p.name} className="rounded-lg border border-mid-gray bg-off-white p-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-bark">{p.forLine}</p>
                <p className="mt-1 font-lora text-xl text-soil">{p.name}</p>
                <p className="text-xs font-semibold uppercase tracking-wide text-straw">{p.type}</p>
                <ProfileTable rows={p.rows} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pair dynamics */}
      <section className="bg-off-white px-4 py-16 md:px-8">
        <div className="mx-auto max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-bark">Pair dynamics</p>
          <h2 className="mt-2 font-lora text-2xl text-soil md:text-3xl">How Each Relationship Works</h2>
          <p className="mt-3 max-w-2xl text-dark-gray">
            A real Family Map includes the pairings that matter most for your family right now —
            usually one or two to start with, not all of them at once. Here are a few, to show the
            range.
          </p>
          <div className="mt-8 space-y-5">
            {PAIRS.map((pair) => (
              <div key={pair.title} className="rounded-lg bg-soil p-6 md:p-8">
                <p className="font-lora text-xl text-linen">{pair.title}</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-straw">{pair.tag}</p>
                <div className="mt-4 space-y-3">
                  <div>
                    <p className="font-lora text-sm italic text-straw">What to name</p>
                    <p className="mt-1 text-sm leading-relaxed text-linen">{pair.whatToName}</p>
                  </div>
                  <div>
                    <p className="font-lora text-sm italic text-straw">What helps</p>
                    <p className="mt-1 text-sm leading-relaxed text-linen">{pair.whatHelps}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* This family's season */}
      <section className="bg-linen px-4 py-16 md:px-8">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-bark">This family&rsquo;s season</p>
          <h2 className="mt-2 font-lora text-2xl text-soil md:text-3xl">Where They Are Right Now</h2>
          <p className="mt-3 text-dark-gray">
            Every Family Map names the season the family is actually in — not the one they wish
            they were in — and points to the one thing worth focusing on before anything else.
          </p>
          <blockquote className="mt-6 rounded-lg border-l-4 border-deep-green bg-off-white p-6">
            <p className="leading-relaxed text-dark-gray">
              This is a family with real strength — a father who tells the truth, a mother who
              sees what&rsquo;s coming, an oldest who leads, a middle child who cares deeply, and a
              youngest who&rsquo;s still learning that he&rsquo;s valued apart from what he
              produces. Right now, the growing edge is smaller than it looks: Eli needs to be
              asked directly how <em>he&rsquo;s</em> doing, not just how everyone else is doing
              around him.
            </p>
          </blockquote>
          <div className="mt-6 rounded-lg border border-straw bg-off-white p-6">
            <p className="text-xs font-bold uppercase tracking-wide text-bark">The single most important thing</p>
            <p className="mt-3 font-lora italic leading-relaxed text-soil">
              This week, ask Eli one question that&rsquo;s only about him — and wait for the whole
              answer before moving on.
            </p>
          </div>
        </div>
      </section>

      {/* Conversation guide */}
      <section className="bg-off-white px-4 py-16 md:px-8">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-bark">Included with every map</p>
          <h2 className="mt-2 font-lora text-2xl text-soil md:text-3xl">The Family Conversation Guide</h2>
          <p className="mt-3 text-dark-gray">
            A one-page guide that turns the map into an actual conversation at your table — not
            just something everyone reads alone.
          </p>
          <ol className="mt-6 space-y-4">
            {CONVERSATION_STEPS.map((step, i) => (
              <li key={step.title} className="flex gap-4">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-soil font-lora text-sm text-straw">
                  {i + 1}
                </span>
                <p className="text-sm leading-relaxed text-dark-gray">
                  <strong className="text-soil">{step.title}</strong> — {step.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-soil px-4 py-20 text-center md:px-8">
        <div className="mx-auto max-w-2xl">
          <h2 className="font-lora text-2xl font-normal text-linen md:text-3xl">
            Want this for your own family?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-lg leading-relaxed text-straw">
            Start with the free, 10-minute Seed Assessment — every family member takes their own.
            From there, a Family Map like this one is written by hand for your family, specifically:{" "}
            <strong className="text-linen">$49</strong>.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button href="/assessment/quiz" variant="inverted">
              Start the Seed Assessment — It&rsquo;s Free
            </Button>
            <a
              href="mailto:james@seedbearerfamily.com?subject=Family%20Map%20Order"
              className="inline-block rounded border border-straw px-8 py-4 text-lg font-medium text-linen transition hover:bg-linen hover:text-soil"
            >
              Order Your Family Map — $49
            </a>
          </div>
          <p className="mx-auto mt-6 max-w-md text-sm italic text-straw opacity-90">
            &ldquo;Who do you think you are?&rdquo; — that&rsquo;s where every conversation in
            this family starts.
          </p>
        </div>
      </section>
    </>
  );
}
