import Button from "@/components/ui/Button";

export const metadata = {
  title: "The Free Seed Assessment — Seedbearer Family",
  description:
    "A free 10-minute reflection that helps you begin to see your unique design — and your child's. I read every submission personally and respond within 48 hours.",
};

export default function AssessmentLandingPage() {
  return (
    <>
      {/* Section 1 — Page header */}
      <section className="bg-linen px-4 py-20 md:px-8">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <p className="text-xs font-semibold uppercase tracking-[3px] text-bark">
            Free · 10 minutes · Personal response within 48 hours
          </p>
          <h1 className="mt-4 font-lora text-3xl font-normal text-soil md:text-5xl">
            The Seed Assessment
          </h1>
          <p className="mt-4 max-w-xl text-xl italic text-bark">
            What was placed in you before you were born has been waiting for the right conditions
            to grow.
          </p>
        </div>
      </section>

      {/* Section 2 — What this is */}
      <section className="bg-off-white px-4 py-16 md:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-lora text-2xl text-soil md:text-3xl">
            What the Seed Assessment is — and what it isn&rsquo;t
          </h2>
          <div className="mt-6 space-y-4 text-lg leading-relaxed text-dark-gray">
            <p>
              This is not a personality test. It&rsquo;s not a quiz designed to put you in a box.
              It&rsquo;s a ten-minute reflection built to help you begin to see yourself and your
              family the way you were always meant to be seen.
            </p>
            <p>
              You&rsquo;ll answer twelve questions. Some are multiple choice. Some ask you to write
              a few sentences. The written answers are the most important ones — they&rsquo;re
              where the real seed tends to show up.
            </p>
            <p>
              I read every submission personally before I respond. That means what arrives in your
              inbox isn&rsquo;t a template. It&rsquo;s a real response, written after I&rsquo;ve sat
              with what you shared. You&rsquo;ll hear from me within 48 hours.
            </p>
          </div>
        </div>
      </section>

      {/* Section 3 — Three reassurances */}
      <section className="bg-linen px-4 py-16 md:px-8">
        <div className="mx-auto grid max-w-4xl gap-10 md:grid-cols-3">
          {[
            {
              heading: "Free",
              body: "No payment required. No credit card. The assessment is a gift, not a lead magnet.",
            },
            {
              heading: "Personal",
              body: "Every submission is read by a real person. No automated emails. No generic results page.",
            },
            {
              heading: "Private",
              body: "What you share stays between us. No selling your data. No spam. You can unsubscribe any time.",
            },
          ].map((col) => (
            <div key={col.heading} className="rounded-lg border border-mid-gray bg-off-white p-6 text-center">
              <h3 className="font-lora text-xl text-soil">{col.heading}</h3>
              <p className="mt-2 text-lg leading-relaxed text-dark-gray">{col.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Section 4 — Call to action */}
      <section className="bg-soil px-4 py-20 md:px-8">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <h2 className="font-lora text-2xl text-linen md:text-3xl">
            Ready to find out what seed you&rsquo;re carrying?
          </h2>
          <p className="mt-4 max-w-lg text-lg leading-relaxed text-straw">
            Ten minutes. Twelve questions. A personal response within 48 hours. No payment
            required.
          </p>
          <div className="mt-8">
            <Button href="/assessment/quiz" variant="inverted">
              Start the Seed Assessment — It&rsquo;s Free
            </Button>
          </div>
          <p className="mt-4 text-xs text-straw">
            No spam. No sales pitch. Just an honest reflection — and a real response from a real
            person.
          </p>
          <a href="/assessment/family" className="mt-6 text-sm text-straw underline hover:text-linen transition">
            Taking this as a family? Start a Family Assessment →
          </a>
        </div>
      </section>
    </>
  );
}
