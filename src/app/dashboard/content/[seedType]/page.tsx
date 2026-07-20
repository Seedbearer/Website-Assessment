import Link from "next/link";
import { notFound } from "next/navigation";
import { SEED_TYPE_INFO, type SeedType } from "@/lib/assessment-data";
import { SEED_TYPE_CONTENT } from "@/lib/seed-type-content";

const SEED_TYPES = Object.keys(SEED_TYPE_INFO) as SeedType[];

export function generateStaticParams() {
  return SEED_TYPES.map((type) => ({ seedType: type.toLowerCase() }));
}

export default function SeedTypeContentPage({ params }: { params: { seedType: string } }) {
  const seedType = SEED_TYPES.find((t) => t.toLowerCase() === params.seedType.toLowerCase());
  if (!seedType) notFound();

  const info = SEED_TYPE_INFO[seedType];
  const content = SEED_TYPE_CONTENT[seedType];

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 md:px-8">
      <Link href="/dashboard" className="text-sm text-bark hover:text-soil transition">
        ← Back to my results
      </Link>

      <h1 className="mt-4 font-lora text-3xl text-soil">The {seedType}</h1>
      <p className="mt-1 text-lg italic text-bark">&ldquo;{info.tagline}&rdquo;</p>

      <div className="mt-8 rounded-lg border border-mid-gray bg-off-white p-6">
        <h2 className="font-lora text-lg text-soil">A practice for this week</h2>
        <p className="mt-2 text-lg leading-relaxed text-dark-gray">{content.practice}</p>
      </div>

      <div className="mt-6 rounded-lg border border-mid-gray bg-off-white p-6">
        <h2 className="font-lora text-lg text-soil">Something to sit with</h2>
        <p className="mt-2 text-lg leading-relaxed text-dark-gray">{content.reflection}</p>
      </div>

      <div className="mt-10 rounded-lg bg-soil p-6 text-center text-linen">
        <p className="text-lg">Want to talk through what this means for you?</p>
        <Link
          href="/coaching"
          className="mt-4 inline-block rounded bg-linen px-6 py-3 font-medium text-soil transition hover:bg-off-white"
        >
          Book a discovery call
        </Link>
      </div>
    </div>
  );
}
