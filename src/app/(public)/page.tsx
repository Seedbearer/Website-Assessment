import Link from "next/link";
import Button from "@/components/ui/Button";

export default function HomePage() {
  return (
    <>
      {/* Section 1 — Hero */}
      <section className="bg-linen px-4 py-20 md:px-8">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <p className="text-sm font-semibold uppercase tracking-[3px] text-bark">
            Family Coaching
          </p>
          <h1 className="mt-4 font-lora text-3xl font-normal text-soil md:text-5xl">
            Who do you think you are?
          </h1>
          <p className="mt-4 max-w-xl text-xl italic text-bark">
            Helping families uncover who they were always meant to be — one seed at a time.
          </p>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-dark-gray">
            We believe every person carries a seed — a unique expression of the image of God —
            simply waiting for the right soil and conditions to grow. Seedbearer Family walks
            alongside parents and teenagers as they discover who they were created to be.
          </p>

          <div className="mt-10 grid w-full gap-4 sm:grid-cols-2">
            <DoorCard
              heading="Something&rsquo;s wrong right now"
              body="A hard moment, a conflict, a child who&rsquo;s pulled away. Six questions, then a matched resource sent straight to your inbox."
              href="/triage"
              cta="Get help now"
            />
            <DoorCard
              heading="I want to understand who we are"
              body="Take the Seed Assessment — ten minutes to discover the design placed in you and your family before birth."
              href="/assessment"
              cta="Take the Seed Assessment"
            />
          </div>

          <a
            href="https://www.youtube.com/@SeedBearerFamily"
            className="mt-6 text-sm text-bark hover:text-soil transition"
          >
            Watch the latest video on YouTube →
          </a>
        </div>
      </section>

      {/* Section 2 — What We Believe */}
      <section className="bg-off-white px-4 py-16 md:px-8">
        <div className="mx-auto grid max-w-4xl gap-10 md:grid-cols-3">
          {[
            {
              heading: "Identity",
              body: "Every person carries a unique seed — a specific design placed in them before birth. Our work begins with helping you discover what yours is.",
            },
            {
              heading: "Connection",
              body: "Identity grows in relationship. The most powerful soil a child can grow in is a family that knows who it is — and is becoming that, together.",
            },
            {
              heading: "Becoming",
              body: "Change is possible. It takes time, honesty, and the right conditions. We walk alongside families through every season — Winter through Summer.",
            },
          ].map((col) => (
            <div key={col.heading} className="text-center">
              <h2 className="font-lora text-2xl text-soil md:text-3xl">{col.heading}</h2>
              <p className="mt-3 text-lg leading-relaxed text-dark-gray">{col.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Section 3 — Start Here */}
      <section className="bg-soil px-4 py-20 md:px-8">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <h2 className="font-lora text-2xl text-linen md:text-3xl">Where would you like to start?</h2>
          <p className="mt-4 max-w-lg text-lg leading-relaxed text-straw">
            However you got here, there&rsquo;s a place to begin. No sales pitch. A real response from
            a real person within 48 hours.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button href="/triage" variant="inverted">
              Something&rsquo;s wrong right now →
            </Button>
            <Button href="/assessment" variant="inverted">
              Start the Free Seed Assessment →
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

function DoorCard({ heading, body, href, cta }: { heading: string; body: string; href: string; cta: string }) {
  return (
    <div className="flex flex-col rounded-lg border border-mid-gray bg-off-white p-6 text-left">
      <h3 className="font-lora text-xl text-soil">{heading}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-dark-gray">{body}</p>
      <Link
        href={href}
        className="mt-4 inline-block rounded bg-deep-green px-5 py-2.5 text-center text-sm font-medium text-linen transition hover:opacity-90"
      >
        {cta}
      </Link>
    </div>
  );
}
