import Link from "next/link";

export const metadata = {
  title: "FAQ",
  description:
    "Answers to common questions about the Seed Assessment, the coaching program, and how to get help from Seedbearer Family.",
  alternates: { canonical: "https://seedbearerfamily.com/faq" },
};

type QA = { q: string; a: React.ReactNode };
type Group = { name: string; items: QA[] };

const GROUPS: Group[] = [
  {
    name: "Getting Started",
    items: [
      {
        q: "What is Seedbearer Family?",
        a: (
          <>
            Seedbearer Family is Christian family coaching built around one idea: every person
            carries a unique seed — a specific design placed in them by God before birth — and the
            work of parenting and growing up is discovering what that is and creating the
            conditions for it to grow. I offer a free Seed Assessment, a twelve-week coaching
            program, and free resources like the Conversation Framework for parents and
            teenagers.
          </>
        ),
      },
      {
        q: "Do I need to be a Christian to do this?",
        a: (
          <>
            The framework is explicitly Christian — it draws on Scripture, theologians like Myles
            Munroe and Leif Hetland, and 25 years of ministry and pastoral work. You don&rsquo;t
            need a particular background to start with the free Seed Assessment or the
            Conversation Framework; they&rsquo;re written to be useful wherever you&rsquo;re
            starting from. But the coaching program especially will be most at home for families
            who want that faith grounding named explicitly, not softened.
          </>
        ),
      },
      {
        q: "What if I'm not in a crisis — is this still for me?",
        a: (
          <>
            Yes. Most families who come to Seedbearer aren&rsquo;t in crisis. If something is hard
            right now, start with{" "}
            <Link href="/triage" className="text-deep-green underline hover:text-soil">
              Get Help Now
            </Link>
            . If things are generally okay and you want to understand yourself and your family
            more deeply, start with the{" "}
            <Link href="/assessment" className="text-deep-green underline hover:text-soil">
              Seed Assessment
            </Link>
            .
          </>
        ),
      },
      {
        q: "Is this therapy or clinical treatment?",
        a: (
          <>
            No. Seedbearer offers coaching and educational content — it&rsquo;s not a substitute
            for medical, psychological, or clinical care. If you or a family member is in crisis,
            please contact a licensed professional or emergency services. Some families need
            deeper clinical support alongside this work, and I&rsquo;ll always point you toward
            the right kind of help for where you actually are.
          </>
        ),
      },
    ],
  },
  {
    name: "The Seed Assessment",
    items: [
      {
        q: "What exactly is the Seed Assessment?",
        a: (
          <>
            A free, ten-minute reflection — twelve questions, some multiple choice, some written —
            built to help you begin to see yourself and your family the way you were always meant
            to be seen. It&rsquo;s not a personality test or a quiz that puts you in a box.
          </>
        ),
      },
      {
        q: "Is it really free, and what happens after I submit it?",
        a: (
          <>
            Yes — no payment, no credit card. I read every submission personally and respond
            within 48 hours with a real, individual reply, not a template or an automated results
            page.
          </>
        ),
      },
      {
        q: "Will you sell my information or spam me?",
        a: (
          <>
            No. What you share stays between us. No selling your data, no spam, and you can
            unsubscribe any time.
          </>
        ),
      },
    ],
  },
  {
    name: "Coaching Program",
    items: [
      {
        q: "What does the twelve-week coaching program actually involve?",
        a: (
          <>
            Two things: twelve online classes you work through at your own pace, and a private
            coaching session with your family or parent group. The classes carry the teaching —
            moving through four seasons, Winter, Thaw, Spring, and Summer, from naming what&rsquo;s
            real, through receiving what you didn&rsquo;t get the first time around, to
            discovering your design, to living it as an actual system. The coaching sessions are
            where it becomes yours — worked through with your own family or parent group, not a
            shared class.
          </>
        ),
      },
      {
        q: "Is this for the whole family, or just parents?",
        a: (
          <>
            This round is parent-focused. A version that includes teenagers is coming in the next
            cohort, and Founding Pilot families get priority access when it opens.
          </>
        ),
      },
      {
        q: "What does it cost?",
        a: (
          <>
            $2,800 for the full twelve-week program. The current Founding Pilot round is 50% off
            at $1,400 for a small group of five to eight parents, in exchange for honest feedback
            that shapes what the program becomes next — including the family version that
            follows.
          </>
        ),
      },
      {
        q: "When does it start?",
        a: (
          <>
            Fall 2026 — exact dates still to be confirmed. Applying doesn&rsquo;t commit you to
            anything; I read every application personally and follow up myself, same as the Seed
            Assessment.
          </>
        ),
      },
    ],
  },
  {
    name: "Getting Help Right Now",
    items: [
      {
        q: "What if something's actively wrong in my family today?",
        a: (
          <>
            Use{" "}
            <Link href="/triage" className="text-deep-green underline hover:text-soil">
              Get Help Now
            </Link>{" "}
            — six short questions, about three minutes, and I&rsquo;ll send a matched resource
            straight to your inbox along with a personal response within 48 hours.
          </>
        ),
      },
      {
        q: "Where can I learn practical tools for hard conversations?",
        a: (
          <>
            The{" "}
            <Link href="/conversation-framework" className="text-deep-green underline hover:text-soil">
              Conversation Framework
            </Link>{" "}
            is a free resource with a five-step process for discipline, boundaries, and
            accountability conversations — from a place of strength rather than fear.
          </>
        ),
      },
    ],
  },
];

// Strip JSX down to plain text for the FAQPage schema's answer field — schema.org wants a text
// (or limited HTML) string, not React nodes. Kept in sync with GROUPS by construction below.
function toPlainText(node: React.ReactNode): string {
  if (typeof node === "string") return node;
  if (Array.isArray(node)) return node.map(toPlainText).join("");
  if (node && typeof node === "object" && "props" in node) {
    return toPlainText((node as { props: { children: React.ReactNode } }).props.children);
  }
  return "";
}

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: GROUPS.flatMap((group) =>
    group.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: toPlainText(item.a) },
    }))
  ),
};

export default function FAQPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Section 1 — Page header */}
      <section className="bg-linen px-4 py-16 md:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="font-lora text-3xl text-soil md:text-5xl">Frequently Asked Questions</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-dark-gray">
            Answers to the questions I hear most. If yours isn&rsquo;t here, reach out through the{" "}
            <Link href="/assessment" className="text-deep-green underline hover:text-soil">
              Seed Assessment
            </Link>{" "}
            and I&rsquo;ll answer it personally.
          </p>
        </div>
      </section>

      {GROUPS.map((group, i) => (
        <section
          key={group.name}
          className={`px-4 py-14 md:px-8 ${i % 2 === 0 ? "bg-off-white" : "bg-linen"}`}
        >
          <div className="mx-auto max-w-3xl">
            <h2 className="font-lora text-2xl text-soil">{group.name}</h2>
            <div className="mt-6 space-y-4">
              {group.items.map((item) => (
                <div key={item.q} className="rounded-lg border border-mid-gray bg-linen p-6">
                  <h3 className="font-lora text-lg text-soil">{item.q}</h3>
                  <p className="mt-2 text-[0.95rem] leading-relaxed text-dark-gray">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
