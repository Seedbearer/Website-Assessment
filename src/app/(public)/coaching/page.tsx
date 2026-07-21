export const metadata = {
  title: "Work With Me — Seedbearer Family",
  description: "A twelve-week program for parents ready to become who they were always meant to be.",
};

export default function CoachingPage() {
  return (
    <>
      {/* Section 1 — Page header */}
      <section className="bg-linen px-4 py-20 md:px-8">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <h1 className="font-lora text-3xl text-soil md:text-5xl">Work With Me</h1>
          <p className="mt-4 max-w-xl text-xl italic text-bark">
            A twelve-week program for parents ready to become who they were always meant to be.
          </p>
        </div>
      </section>

      {/* Section 2 — Every seed needs the right soil */}
      <section className="bg-off-white px-4 py-16 md:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-lora text-2xl text-soil md:text-3xl">Every seed needs the right soil.</h2>
          <div className="mt-6 space-y-4 text-left text-lg leading-relaxed text-dark-gray">
            <p>
              This program is built around two things happening every week: a shared class with a
              small group of parents walking the same road, and a private coaching session just
              for you.
            </p>
            <p>
              The class is where the teaching happens — twelve sessions moving through four
              seasons: <strong>Winter</strong>, where we name what&rsquo;s real without shame;{" "}
              <strong>Thaw</strong>, where you receive what you didn&rsquo;t get to receive the
              first time around; <strong>Spring</strong>, where you discover the design underneath
              the wound — your seed type, your values, your child&rsquo;s seed; and{" "}
              <strong>Summer</strong>, where it becomes a system you actually live.
            </p>
            <p>
              The coaching session is where it becomes yours — personal, one-on-one, working
              through what the week&rsquo;s teaching actually means for your family.
            </p>
          </div>
        </div>
      </section>

      {/* Section 3 — What's included */}
      <section className="bg-linen px-4 py-16 md:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-lora text-2xl text-soil md:text-3xl">What&rsquo;s Included</h2>
          <div className="mt-6 grid gap-4 text-left md:grid-cols-2">
            {[
              "Twelve weekly online classes, in a small group of parents doing this work together",
              "Twelve weekly one-on-one coaching sessions, just you and me",
              "Twelve weeks, September 1 through November 24",
            ].map((item) => (
              <div key={item} className="rounded-lg border border-mid-gray bg-off-white p-4 text-lg text-dark-gray">
                {item}
              </div>
            ))}
          </div>
          <p className="mt-8 text-lg leading-relaxed text-dark-gray">
            This round is parent-focused. If you&rsquo;re hoping for your teenager to be coached
            alongside you, that&rsquo;s coming in the next cohort — Founding Pilot families get
            priority access when it opens.
          </p>
        </div>
      </section>

      {/* Section 4 — Investment + Founding Pilot */}
      <section className="bg-soil px-4 py-20 md:px-8">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <h2 className="font-lora text-2xl text-linen md:text-3xl">Investment</h2>
          <p className="mt-4 text-lg text-straw">$2,800 for the full twelve-week program.</p>

          <div className="mt-10 w-full max-w-2xl rounded-lg border border-bark bg-linen p-8 text-left">
            <h3 className="text-center font-lora text-xl text-soil md:text-2xl">
              Founding Pilot — Now Enrolling
            </h3>
            <p className="mt-4 text-lg leading-relaxed text-dark-gray">
              I&rsquo;m opening this first round to a small group — five to eight parents — at 50%
              off: <strong>$1,400</strong>. This is a pilot: your honest feedback shapes what this
              becomes, including the family version that follows. Classes are led live, by me.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-dark-gray">
              Founding Pilot begins September 1, 2026. Spots are capped and will close once
              they&rsquo;re filled.
            </p>

            <div className="mt-8 flex justify-center">
              <a
                href="mailto:james@seedbearerfamily.com?subject=Founding%20Pilot%20Application"
                className="inline-block rounded bg-deep-green px-8 py-4 text-lg font-medium text-linen transition hover:opacity-90"
              >
                Apply for the Founding Pilot →
              </a>
            </div>

            <p className="mt-6 text-center text-sm text-bark">
              Applying doesn&rsquo;t commit you to anything. I read every application personally
              and follow up myself — same as the Seed Assessment. If it&rsquo;s a fit, I&rsquo;ll
              send next steps, including payment.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
