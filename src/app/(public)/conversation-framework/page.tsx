import Link from "next/link";
import AgeGuidance from "@/components/conversation-framework/AgeGuidance";

export const metadata = {
  title: "The Conversation Framework",
  description:
    "A practical guide for families on discipline, boundaries, and accountability — from a place of strength rather than fear. Free resource from Seedbearer Family.",
};

type Step = {
  num: string;
  title: string;
  body: string;
  script?: string;
  note?: string;
  questions?: { q: string; note: string }[];
};

const STEPS: Step[] = [
  {
    num: "1",
    title: "Connect First",
    body: "Before you address the behaviour, establish the relationship. Get physically level with your child. Make eye contact. Regulate yourself first — a regulated parent is the most important tool in the room.",
    script: "“I’m not here to punish you. I’m here because I love you and this matters.”",
    note: "⚠ If you are too activated to connect warmly, take five minutes first. Then come back.",
  },
  {
    num: "2",
    title: "Separate the Person from the Behaviour",
    body: "Your child is not bad. Their behaviour was unacceptable. This distinction is the foundation of genuine accountability. When a child believes they are bad, they defend. When they understand the behaviour was the problem, they can own it.",
    script: "“You are not in trouble. What happened is. And we need to talk about that.”",
  },
  {
    num: "3",
    title: "Ask the Three Questions",
    body: "These are not interrogation — they are an invitation to own the story. Let your child answer. Resist filling the silence. The goal is genuine reflection, not a confession.",
    questions: [
      {
        q: "“What happened?”",
        note: "Listen fully. Don’t correct or interrupt. You’re gathering their understanding, not looking for agreement.",
      },
      {
        q: "“What do you think about that?”",
        note: "This is the most important question. A child who arrives at their own moral evaluation has done far more powerful work than one who is told what to think.",
      },
      {
        q: "“What do you want to do now?”",
        note: "Guide them toward repair or a different choice next time — but let them name it before you confirm it.",
      },
    ],
  },
  {
    num: "4",
    title: "Apply Natural Consequences with Warmth",
    body: "Consequences are not punishments. They are the natural result of choices — how the world actually works. Your job is not to shield your child from reality but to let reality teach, with your warmth alongside them as they learn.",
    script:
      "“There’s a consequence here. Not because I’m angry — because choices have outcomes. I’m going to stay right here with you through it.”",
    note: "⚠ Consequences should be logical, proportional, and related to the behaviour. Aim for consequences that restore or teach — not ones designed to make the child feel bad.",
  },
  {
    num: "5",
    title: "Restore and Move Forward",
    body: "Once the consequence is complete, the matter is closed. Do not revisit, remind, or hold it over them. When the prodigal son came home, his father ran toward him — full restoration, full dignity, full belonging. The repair is complete.",
    script: "“That’s done. We’re good. I love you. Let’s move forward.”",
  },
];

const MOVES = [
  {
    num: "1",
    title: "Start with heart",
    desc: "Before you speak, ask yourself: what do I actually want from this conversation? The answer should be something for the relationship or your child’s growth — not to vent, not to win.",
    script:
      "“Before I say anything, I want you to know I’m not here to make you feel bad. I want us to figure this out together.”",
  },
  {
    num: "2",
    title: "Name the gap",
    desc: "State specifically what was agreed or expected, and what actually happened. Stick to observable behaviour. No character attacks. No “you always.”",
    script: "“We agreed 9pm. It was 11:15 when you walked in. That’s the gap I want to talk about.”",
  },
  {
    num: "3",
    title: "Hear their story",
    desc: "Ask what happened from their perspective before drawing conclusions. There is almost always information you don’t have. Their story matters even when it doesn’t change the outcome.",
    script: "“Help me understand what happened. What was going on for you?”",
  },
  {
    num: "4",
    title: "Agree the path forward",
    desc: "Together, name what changes. Let them have ownership of the solution wherever possible. A teenager who names their own accountability is far more likely to keep it.",
    script: "“So what are we agreeing to? I want to hear you say it in your own words.”",
  },
];

const HARD_MOMENTS = [
  {
    title: "Buy yourself five minutes",
    body: "“I’m not going to respond to this right now. Give me five minutes and then let’s talk.” This is not avoidance. This is regulation. A regulated parent is the most important tool in the room.",
  },
  {
    title: "Say less than you want to",
    body: "In the heat of a hard moment, the words that feel most necessary are usually the ones that cause the most damage. The conversation you have when you’re regulated tomorrow will do more good than the one you have right now.",
  },
  {
    title: "Repair is always available",
    body: "If you responded from fear rather than honour — if you raised your voice or said something you regret — repair is available. Go back. Own it. “I didn’t handle that well. I’m sorry. Can we try again?” That moment of repair is not a sign of weakness. It is the most powerful parenting move available to you.",
  },
];

export default function ConversationFrameworkPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-soil px-4 py-20 text-center md:px-8">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-straw">
            Free Family Resource
          </p>
          <h1 className="mt-4 font-lora text-3xl font-normal text-linen md:text-5xl">
            The Conversation Framework
          </h1>
          <p className="mx-auto mt-5 max-w-xl italic text-straw md:text-lg">
            A practical guide for discipline, boundaries, and accountability — from a place of
            strength, not fear.
          </p>
          <div className="mx-auto my-8 h-0.5 w-16 bg-straw opacity-60" />
          <p className="text-sm tracking-wide text-straw opacity-75">
            Grounded in Danny Silk · Henry Cloud · Kerry Patterson
          </p>
        </div>
      </section>

      {/* Conviction */}
      <section className="bg-off-white px-4 py-16 md:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-lora text-2xl font-normal text-soil">Before the steps — start here</h2>
          <p className="mt-4 text-bark">
            A process without conviction won&rsquo;t hold. So before we give you the steps, we want
            to name something you may not have heard clearly enough.
          </p>
          <p className="my-8 rounded-r-lg border-l-4 border-straw bg-linen p-8 text-center font-lora text-2xl italic leading-snug text-soil">
            You have the power to do this differently.
          </p>
          <p className="text-dark-gray">
            Not because you had a perfect childhood. Not because the pattern you inherited was easy
            to see or change. But because the seed of who you were meant to be was placed in you
            before any of that happened. The wound didn&rsquo;t create you. It covered you.
          </p>
          <p className="mt-4 text-dark-gray">
            Every time you respond from honour instead of fear, you are not just handling a moment.
            You are changing the soil your child grows in.
          </p>

          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            <div className="rounded-lg border border-straw bg-linen p-6">
              <h3 className="font-lora text-base font-semibold text-soil">
                Your child is not the problem.
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-bark">
                Their behaviour is a signal. Behind every hard moment is an unmet need or an
                untested boundary. You are responding to the signal, not punishing the person.
              </p>
            </div>
            <div className="rounded-lg border border-straw bg-linen p-6">
              <h3 className="font-lora text-base font-semibold text-soil">
                Connection comes before correction.
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-bark">
                Before the consequence, before the conversation — the relationship must be the
                container. Without connection, discipline produces compliance at best and damage at
                worst.
              </p>
            </div>
            <div className="rounded-lg border border-straw bg-linen p-6">
              <h3 className="font-lora text-base font-semibold text-soil">You go first.</h3>
              <p className="mt-2 text-sm leading-relaxed text-bark">
                The most powerful thing you can model is what it looks like to own a mistake and
                choose differently. You cannot ask from your child what you haven&rsquo;t first
                shown them yourself.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Five Steps */}
      <section className="bg-linen px-4 py-16 md:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-lora text-3xl font-normal text-soil">The Five Steps</h2>
          <p className="mt-2 italic text-bark">
            Use these in order. Start at Step 1 every time — no matter how well you think you know
            where it&rsquo;s going.
          </p>

          <div className="mt-10 space-y-6">
            {STEPS.map((step) => (
              <div key={step.num} className="overflow-hidden rounded-lg shadow-sm">
                <div className="flex items-baseline gap-4 bg-soil px-6 py-5">
                  <span className="font-lora text-3xl text-straw">{step.num}</span>
                  <span className="font-lora text-xl text-linen">{step.title}</span>
                </div>
                <div className="bg-off-white p-6">
                  <p className="text-[0.95rem] leading-relaxed text-dark-gray">{step.body}</p>

                  {step.script && (
                    <div className="mt-4 rounded-r-md border-l-[3px] border-deep-green bg-linen p-4">
                      <div className="text-xs font-semibold uppercase tracking-[0.12em] text-bark">
                        Say something like
                      </div>
                      <p className="mt-1 font-lora text-[0.95rem] italic leading-relaxed text-soil">
                        {step.script}
                      </p>
                    </div>
                  )}

                  {step.questions && (
                    <div className="mt-4 rounded-lg border border-straw bg-linen p-6">
                      <h3 className="font-lora text-base font-semibold text-soil">
                        The Three Questions
                      </h3>
                      <div className="mt-4 space-y-4">
                        {step.questions.map((item) => (
                          <div key={item.q}>
                            <span className="block text-[0.95rem] font-semibold text-soil">
                              {item.q}
                            </span>
                            <span className="text-sm italic text-bark">{item.note}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {step.note && <p className="mt-3 text-[0.82rem] italic text-bark">{step.note}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Accountability */}
      <section className="bg-off-white px-4 py-16 md:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-lora text-2xl font-normal text-soil">
            When You Need the Accountability Conversation
          </h2>
          <p className="mt-2 text-sm italic text-bark">
            For repeated patterns, broken commitments, or behaviour that has had a significant
            impact — use these four moves alongside the five steps.
          </p>

          <div className="mt-8 space-y-4">
            {MOVES.map((move) => (
              <div
                key={move.num}
                className="grid grid-cols-[2.5rem_1fr] items-start gap-x-4 rounded-lg border-l-4 border-soil bg-linen p-6"
              >
                <div className="font-lora text-2xl leading-tight text-straw">{move.num}</div>
                <div>
                  <div className="text-[0.95rem] font-semibold text-soil">{move.title}</div>
                  <p className="mt-1 text-sm leading-relaxed text-dark-gray">{move.desc}</p>
                  <p className="mt-3 border-l-2 border-straw pl-3 font-lora text-sm italic leading-relaxed text-bark">
                    {move.script}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Age Guidance */}
      <section className="bg-linen px-4 py-16 md:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-lora text-2xl font-normal text-soil">Age-Specific Guidance</h2>
          <div className="mt-8">
            <AgeGuidance />
          </div>
        </div>
      </section>

      {/* When It's Hard */}
      <section className="bg-off-white px-4 py-16 md:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-lora text-2xl font-normal text-soil">When It&rsquo;s Hard</h2>
          <div className="mt-8 space-y-4">
            {HARD_MOMENTS.map((item) => (
              <div key={item.title} className="rounded-lg border-l-4 border-bark bg-linen p-6">
                <h3 className="font-lora text-base font-semibold text-soil">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-dark-gray">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Grace note */}
      <section className="bg-linen px-4 py-12 md:px-8">
        <div className="mx-auto max-w-3xl rounded-lg border border-straw bg-off-white p-8 text-[0.93rem] leading-relaxed text-bark">
          <p>
            <strong className="text-soil">A note on grace.</strong> If this framework feels
            impossibly far from where you are right now — that awareness is not a verdict. It is
            the beginning.
          </p>
          <p className="mt-4">
            Some families need deeper soil work before these tools can fully take root. Trauma,
            significant attachment wounds, or generational patterns that run deep may need
            professional clinical support alongside this work. That is not failure. That is
            honesty. And Seedbearer will always point you toward the right support for where you
            actually are.
          </p>
        </div>
      </section>

      {/* Pull quote */}
      <section className="bg-linen px-4 pb-4 pt-2 md:px-8">
        <p className="mx-auto max-w-2xl text-center font-lora text-lg italic text-bark">
          &ldquo;The person is never the problem. The behaviour is always the problem. The
          relationship is always worth fighting for.&rdquo;
        </p>
      </section>

      {/* Dual CTA — two doors */}
      <section className="bg-soil px-4 py-20 text-center md:px-8">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-straw">
            Two ways to go further
          </p>
          <h2 className="mt-3 font-lora text-3xl font-normal text-linen">Where do you want to start?</h2>
          <p className="mx-auto mt-4 max-w-xl text-straw">
            There are two doors into Seedbearer Family. One meets you where you are right now. The
            other helps you discover who you were always meant to be. Both matter. You choose which
            one comes first.
          </p>

          <div className="mt-10 grid gap-5 text-left sm:grid-cols-2">
            <div className="rounded-lg border border-straw bg-linen/[0.07] p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-straw">
                Something is hard right now
              </p>
              <h3 className="mt-3 font-lora text-xl font-normal text-linen">
                Tell us what&rsquo;s happening in your family
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-straw">
                Six questions. Three minutes. A matched resource waiting on the other side — and a
                personal response within 48 hours.
              </p>
              <Link
                href="/triage"
                className="mt-6 inline-block rounded bg-deep-green px-7 py-3 text-sm font-medium text-linen transition hover:opacity-90"
              >
                Start the Family Triage →
              </Link>
            </div>

            <div className="rounded-lg border border-straw bg-linen/[0.07] p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-straw">
                I want to understand who we are
              </p>
              <h3 className="mt-3 font-lora text-xl font-normal text-linen">Discover your unique design</h3>
              <p className="mt-3 text-sm leading-relaxed text-straw">
                The Seed Assessment identifies your unique design — your values, your seed type,
                your season. Free, ten minutes, personal response.
              </p>
              <Link
                href="/assessment"
                className="mt-6 inline-block rounded border border-linen px-7 py-3 text-sm font-medium text-linen transition hover:bg-linen hover:text-soil"
              >
                Take the Seed Assessment →
              </Link>
            </div>
          </div>

          <p className="mx-auto mt-8 max-w-xl text-sm text-straw opacity-75">
            Not sure which one? If something is urgent right now, start with the Triage. If life is
            generally okay and you want to understand yourself and your child more deeply, start
            with the Seed Assessment. Either way, you&rsquo;ll hear from us personally.
          </p>
        </div>
      </section>

      {/* Coaching upgrade */}
      <section className="bg-off-white px-4 py-14 text-center md:px-8">
        <div className="mx-auto max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-bark">
            Want the full depth?
          </p>
          <p className="mt-3 font-lora text-xl font-normal text-soil">
            The Seedbearer Family Coaching Programme walks you through the full Conversation
            Framework — with scripts, role-play practice, and a coach alongside you.
          </p>
          <p className="mt-3 text-sm text-bark">
            Applying it in real situations with your real family. Not a template — a coach.
          </p>
          <Link
            href="/coaching"
            className="mt-6 inline-block rounded bg-soil px-7 py-3 text-sm font-medium text-linen transition hover:bg-bark"
          >
            Learn about coaching →
          </Link>
        </div>
      </section>
    </>
  );
}
