import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { SEED_TYPE_INFO, type SeedType } from "@/lib/assessment-data";
import { soilReflection } from "@/lib/soil-reflection";

export const dynamic = "force-dynamic";

export default async function PersonalDashboardPage() {
  const supabaseSession = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabaseSession.auth.getUser();

  if (!user?.email) return null;

  const supabase = getSupabaseAdmin();

  const { data: submission } = await supabase
    .from("submissions")
    .select("id, first_name, family_code, seed_type_algorithm, seed_type_coach, q9_internal, q11_season")
    .eq("email", user.email)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!submission) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center md:px-8">
        <h1 className="font-lora text-3xl text-soil">No results found</h1>
        <p className="mt-4 text-lg text-dark-gray">
          We couldn&rsquo;t find an assessment submission for {user.email}.
        </p>
        <Link href="/assessment" className="mt-6 inline-block text-deep-green underline">
          Take the Seed Assessment →
        </Link>
      </div>
    );
  }

  const { data: personalValues } = await supabase
    .from("personal_values")
    .select("value_order, value_name, value_definition")
    .eq("submission_id", submission.id)
    .order("value_order");

  const seedType = (submission.seed_type_coach || submission.seed_type_algorithm) as SeedType;
  const info = SEED_TYPE_INFO[seedType];
  const reflection = soilReflection(submission.q9_internal ?? "", submission.q11_season ?? "");
  const definedValues = (personalValues ?? []).filter((v) => v.value_name?.trim());

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 md:px-8">
      <div className="text-center">
        <p className="text-sm uppercase tracking-widest text-bark">{submission.first_name}, your seed is</p>
        <h1 className="mt-2 font-lora text-4xl text-soil">The {seedType}</h1>
        <p className="mt-2 text-xl italic text-bark">&ldquo;{info.tagline}&rdquo;</p>
        <p className="mt-6 text-left text-lg leading-relaxed text-dark-gray">{info.description}</p>

        {reflection && (
          <div className="mt-8 rounded-lg border border-mid-gray bg-off-white p-6 text-left">
            <p className="text-lg leading-relaxed text-dark-gray">{reflection}</p>
          </div>
        )}
      </div>

      <div className="mt-10">
        <Link
          href={`/dashboard/content/${seedType.toLowerCase()}`}
          className="block rounded-lg bg-deep-green p-6 text-center text-linen transition hover:opacity-90"
        >
          <p className="font-lora text-xl">Explore what it means to be a {seedType}</p>
          <p className="mt-1 text-sm text-new-growth">A practice and a reflection for your seed type →</p>
        </Link>
      </div>

      {definedValues.length > 0 && (
        <div className="mt-10 rounded-lg border border-mid-gray bg-off-white p-6">
          <h2 className="font-lora text-lg text-soil">Your values</h2>
          <ul className="mt-3 space-y-3">
            {definedValues.map((v) => (
              <li key={v.value_order}>
                <p className="font-medium text-soil">{v.value_name}</p>
                {v.value_definition && <p className="text-sm text-dark-gray">{v.value_definition}</p>}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-bark">Edited by your coach — reach out if anything needs updating.</p>
        </div>
      )}

      {submission.family_code && (
        <Link
          href="/dashboard/family"
          className="mt-10 block rounded-lg border border-mid-gray bg-off-white p-6 text-center hover:border-bark"
        >
          <p className="font-lora text-lg text-soil">See your family&rsquo;s picture →</p>
        </Link>
      )}
    </div>
  );
}
