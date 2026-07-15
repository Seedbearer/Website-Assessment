import Button from "@/components/ui/Button";

export default function HomePage() {
  return (
    <>
      {/* Section 1 — Hero */}
      <section className="bg-linen px-4 py-20 md:px-8">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <p className="text-sm font-semibold uppercase tracking-[3px] text-bark">
            Christian Family Coaching
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
          <div className="mt-8">
            <Button href="/assessment">Take the Free Seed Assessment</Button>
          </div>
          <a
            href="https://www.youtube.com/@SeedBearerFamily"
            className="mt-4 text-sm text-bark hover:text-soil transition"
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
            The Seed Assessment is the beginning of the conversation. Ten minutes. No sales pitch. A
            real response from a real person within 48 hours.
          </p>
          <div className="mt-8">
            <Button href="/assessment" variant="inverted">
              Start the Free Seed Assessment
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
