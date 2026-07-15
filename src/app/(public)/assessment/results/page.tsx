"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import { SEED_TYPE_INFO, type SeedType } from "@/lib/assessment-data";
import { soilReflection } from "@/lib/soil-reflection";

type StoredResult = {
  firstName: string;
  seedType: SeedType;
  q9Internal: string;
  q11Season: string;
};

export default function AssessmentResultsPage() {
  const [result, setResult] = useState<StoredResult | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("seedbearer_result");
    if (raw) setResult(JSON.parse(raw));
    setLoaded(true);
  }, []);

  if (!loaded) return null;

  if (!result) {
    return (
      <section className="bg-linen px-4 py-24 md:px-8">
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <h1 className="font-lora text-3xl text-soil">We couldn&rsquo;t find your results</h1>
          <p className="mt-4 text-lg text-dark-gray">
            This page only shows results right after you complete the assessment.
          </p>
          <div className="mt-8">
            <Button href="/assessment">Take the Assessment</Button>
          </div>
        </div>
      </section>
    );
  }

  const info = SEED_TYPE_INFO[result.seedType];
  const reflection = soilReflection(result.q9Internal, result.q11Season);

  return (
    <section className="bg-linen px-4 py-20 md:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm uppercase tracking-widest text-bark">
          {result.firstName ? `${result.firstName}, your seed is` : "Your seed is"}
        </p>
        <h1 className="mt-2 font-lora text-4xl text-soil md:text-5xl">The {result.seedType}</h1>
        <p className="mt-3 text-xl italic text-bark">&ldquo;{info.tagline}&rdquo;</p>

        <p className="mt-8 text-left text-lg leading-relaxed text-dark-gray">{info.description}</p>

        {reflection && (
          <div className="mt-8 rounded-lg border border-mid-gray bg-off-white p-6 text-left">
            <p className="text-lg leading-relaxed text-dark-gray">{reflection}</p>
          </div>
        )}

        <div className="mt-10 rounded-lg bg-soil p-6 text-linen">
          <p className="text-lg">
            I have also received your written answers and will respond personally within 48 hours.
          </p>
        </div>

        <div className="mt-10 flex flex-col items-center gap-4">
          <Button href="/coaching">Book a discovery call</Button>
          {/* TODO: link to the seed-type-specific video once YouTube IDs are assigned (see Seedbearer_Seed_Assessment_Phase1.docx Section 04) */}
          <a
            href="https://www.youtube.com/@SeedBearerFamily"
            className="text-sm text-bark hover:text-soil transition"
          >
            Watch this video next →
          </a>
        </div>
      </div>
    </section>
  );
}
