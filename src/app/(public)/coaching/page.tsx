export const metadata = {
  title: "Work With Me — Seedbearer Family",
  description:
    "A six-month program for one parent and one teenager, walking the same road at the same time.",
};

export default function CoachingPage() {
  return (
    <>
      {/* Section 1 — Page header */}
      <section className="bg-linen px-4 py-20 md:px-8">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <h1 className="font-lora text-3xl text-soil md:text-5xl">Work With Me</h1>
          <p className="mt-4 max-w-xl text-xl italic text-bark">
            A six-month program for one parent and one teenager, walking the same road at the
            same time.
          </p>
        </div>
      </section>

      {/* Section 2 — Every seed needs its own soil */}
      <section className="bg-off-white px-4 py-16 md:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-lora text-2xl text-soil md:text-3xl">
            Every seed needs its own soil — and then it needs the whole garden.
          </h2>
          <div className="mt-6 space-y-4 text-left text-lg leading-relaxed text-dark-gray">
            <p>
              Most coaching helps a parent, or helps a teenager. This is different. For the first
              five weeks, you and your teen each work with me one-on-one — biweekly sessions,
              separate space, separate pace. You&rsquo;re not managing each other&rsquo;s growth.
              You&rsquo;re each doing your own.
            </p>
            <p>
              Starting in week six, we bring you together. Joint sessions, still biweekly, where
              what you&rsquo;ve each been working on individually starts becoming something you
              carry as a family. That&rsquo;s the order on purpose — you can&rsquo;t build real
              connection on identity you haven&rsquo;t found yet.
            </p>
            <p>
              Alongside all of it: twelve classes, delivered online, walking through the same
              ground this whole site stands on — identity, connection, becoming.
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
              "Twelve online classes over six months",
              "Biweekly one-on-one coaching for you",
              "Biweekly one-on-one coaching for your teen",
              "Joint parent-teen sessions from week six onward",
              "A real person — me — in every session",
              "No cohort of strangers, no automated content drip",
            ].map((item) => (
              <div key={item} className="rounded-lg border border-mid-gray bg-off-white p-4 text-lg text-dark-gray">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4 — Investment + Founding Cohort */}
      <section className="bg-soil px-4 py-20 md:px-8">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <h2 className="font-lora text-2xl text-linen md:text-3xl">Investment</h2>
          <p className="mt-4 text-lg text-straw">$3,900 for the full six-month program.</p>

          <div className="mt-10 w-full max-w-2xl rounded-lg border border-bark bg-linen p-8 text-left">
            <h3 className="text-center font-lora text-xl text-soil md:text-2xl">
              Founding Cohort — Now Enrolling
            </h3>
            <p className="mt-4 text-lg leading-relaxed text-dark-gray">
              I&rsquo;m opening this first round to a small group of families — five to eight — at
              50% off: <strong>$1,950</strong>. In exchange, classes are delivered live, by me,
              rather than pre-recorded, and I&rsquo;d ask for your honest feedback as we go. This
              round shapes what the program becomes.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-dark-gray">
              Founding Cohort begins September 1, 2026. Spots are capped and will close once
              they&rsquo;re filled.
            </p>

            <div className="mt-8 flex justify-center">
              <a
                href="mailto:james@seedbearerfamily.com?subject=Founding%20Cohort%20Application"
                className="inline-block rounded bg-deep-green px-8 py-4 text-lg font-medium text-linen transition hover:opacity-90"
              >
                Apply for the Founding Cohort →
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
