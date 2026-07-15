import Button from "@/components/ui/Button";

export const metadata = {
  title: "'My Story' — Seedbearer Family",
  description:
    "How a vision in 1999 led to 25 years of work with youth and families — and what Seedbearer Family Coaching is building toward.",
};

export default function AboutPage() {
  return (
    <>
      {/* Section 1 — Page header */}
      <section className="bg-linen px-4 py-16 md:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="font-lora text-3xl text-soil md:text-5xl">My Story</h1>
          <p className="mt-4 text-lg text-dark-gray">
            How a vision in 1999 led to 25 years of work with families — and what it built toward.
          </p>
        </div>
      </section>

      {/* Section 2 — The story */}
      <section className="bg-off-white px-4 py-20 md:px-8">
        <div className="mx-auto grid max-w-4xl gap-10 md:grid-cols-5 md:items-center">
          <div className="md:col-span-2">
            {/* TODO: replace with the client's actual photo */}
            <div className="aspect-square w-full rounded-lg border border-mid-gray bg-linen" />
          </div>
          <div className="space-y-5 text-lg leading-relaxed text-dark-gray md:col-span-3">
            <p>
              In 1999, I asked God a simple question: what do you want me to do with my life? What I
              saw next set the course for the next 25 years — a vision of families walking into a
              place of darkness and walking out free, holding hands, with light around them.
            </p>
            <p>
              Since then I&rsquo;ve worked in youth ministry, aged-out foster care, and residential
              treatment for at-risk teenagers. I&rsquo;ve built businesses, trained people across
              North America, navigated church building projects and pastoral transitions. I&rsquo;ve
              been through seasons of debt, failure, and starting over.
            </p>
            <p>
              I&rsquo;m also a husband, and a father of three remarkable kids who are homeschooled and
              growing into some of the most interesting people I know. Every one of them a different
              seed. Learning that has been the most humbling education of my life.
            </p>
            <p>
              Seedbearer is what 25 years of that calling has built toward. Not a business. A home —
              the one I saw in 1999. A place where families walk in carrying weight and walk out
              knowing who they are.
            </p>
          </div>
        </div>
      </section>

      {/* Section 3 — Pull quote */}
      <section className="bg-linen px-4 py-16 md:px-8">
        <div className="mx-auto max-w-2xl border-l-4 border-straw pl-6">
          <p className="text-xl italic text-bark">
            &quot;The seed of everything is in itself. The potential of a thing is always in the
            thing itself.&quot;
          </p>
          <p className="mt-2 text-sm text-dark-gray">— Dr Myles Munroe</p>
        </div>
      </section>

      {/* Section 4 — The framework */}
      <section className="bg-off-white px-4 py-16 md:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-lora text-2xl text-soil md:text-3xl">What We Draw On</h2>
          <p className="mt-4 text-lg leading-relaxed text-dark-gray">
            Seedbearer is built on the best thinking I&rsquo;ve found across 25 years. Theologians
            like Myles Munroe and Leif Hetland. Developmental psychologists like Gordon Neufeld and
            Gabor Maté. Neuroscientists like Dr Caroline Leaf. Thinkers on identity and
            responsibility like Erwin McManus and Jordan Peterson. All of it pointing toward one
            thing: you were made on purpose, your child was made on purpose, and the world is
            better when you both discover what that is.
          </p>
        </div>
      </section>

      {/* Section 5 — Closing CTA */}
      <section className="bg-linen px-4 py-16 md:px-8">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <h2 className="font-lora text-2xl text-soil md:text-3xl">
            Want to know what seed you&rsquo;re carrying?
          </h2>
          <p className="mt-4 max-w-lg text-lg text-dark-gray">
            The Seed Assessment is the place to start. Free, ten minutes, and I read every
            submission personally.
          </p>
          <div className="mt-6">
            <Button href="/assessment">Take the Free Seed Assessment →</Button>
          </div>
        </div>
      </section>
    </>
  );
}
