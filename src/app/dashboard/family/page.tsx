import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { getCompatibility } from "@/lib/compatibility";
import { SEED_TYPE_INFO, type SeedType } from "@/lib/assessment-data";

export const dynamic = "force-dynamic";

const SEASON_ORDER = ["winter", "thaw", "spring", "summer"];

export default async function FamilyDashboardPage() {
  const supabaseSession = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabaseSession.auth.getUser();

  // Should never happen (layout already redirects if !user), but keeps this page self-contained.
  if (!user?.email) {
    return null;
  }

  const supabase = getSupabaseAdmin();

  // Find the current member's own submission and, via it, their family code.
  const { data: ownSubmission } = await supabase
    .from("submissions")
    .select("id, family_code")
    .eq("email", user.email)
    .not("family_code", "is", null)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!ownSubmission?.family_code) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center md:px-8">
        <h1 className="font-lora text-3xl text-soil">No family group yet</h1>
        <p className="mt-4 text-lg text-dark-gray">
          This dashboard is for family assessments. If you completed an individual assessment, or
          haven&rsquo;t joined a family yet, there&rsquo;s nothing to show here.
        </p>
        <Link href="/assessment/family" className="mt-6 inline-block text-deep-green underline">
          Start a Family Assessment →
        </Link>
      </div>
    );
  }

  const familyCode = ownSubmission.family_code;

  const { data: family } = await supabase.from("families").select("family_name").eq("family_code", familyCode).maybeSingle();

  // Public-safe fields only — no soil data, open text, personal values, or coach notes, per spec.
  const { data: members } = await supabase
    .from("family_members")
    .select("id, member_name, member_role, submissions(seed_type_algorithm, seed_type_coach, q11_season)")
    .eq("family_code", familyCode);

  type MemberRow = {
    id: string;
    member_name: string | null;
    member_role: string | null;
    submissions: { seed_type_algorithm: string | null; seed_type_coach: string | null; q11_season: string | null } | null;
  };

  const memberList = (members ?? []) as unknown as MemberRow[];
  const membersWithType = memberList
    .map((m) => ({ ...m, seedType: (m.submissions?.seed_type_coach || m.submissions?.seed_type_algorithm) as SeedType | undefined }))
    .filter((m) => m.seedType);

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 md:px-8">
      <h1 className="text-center font-lora text-3xl text-soil md:text-4xl">
        {family?.family_name || "Your Family"}
      </h1>
      <p className="mt-2 text-center text-dark-gray">
        {memberList.length} member{memberList.length === 1 ? "" : "s"}
      </p>

      <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {memberList.map((m) => {
          const seedType = (m.submissions?.seed_type_coach || m.submissions?.seed_type_algorithm) as SeedType | undefined;
          return (
            <div key={m.id} className="rounded-lg border border-mid-gray bg-off-white p-6">
              <p className="font-medium text-soil">{m.member_name}</p>
              <p className="text-sm capitalize text-bark">{m.member_role}</p>
              {seedType && (
                <>
                  <p className="mt-3 font-lora text-lg text-soil">{seedType}</p>
                  <p className="text-sm italic text-bark">&ldquo;{SEED_TYPE_INFO[seedType].tagline}&rdquo;</p>
                </>
              )}
              <p className="mt-2 text-sm capitalize text-dark-gray">{m.submissions?.q11_season || ""}</p>
            </div>
          );
        })}
      </div>

      {membersWithType.length >= 2 && (
        <div className="mt-12">
          <h2 className="font-lora text-xl text-soil">What this combination tends to create</h2>
          <div className="mt-4 space-y-3">
            {membersWithType.flatMap((m1, i) =>
              membersWithType.slice(i + 1).map((m2) => {
                const compat = getCompatibility(m1.seedType as SeedType, m2.seedType as SeedType);
                return (
                  <div key={`${m1.id}-${m2.id}`} className="rounded-lg border border-mid-gray bg-off-white p-4">
                    <p className="font-medium text-soil">
                      {m1.member_name} + {m2.member_name}
                    </p>
                    <p className="mt-1 text-sm text-dark-gray">{compat.text}</p>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {memberList.length > 0 && (
        <div className="mt-12">
          <h2 className="font-lora text-xl text-soil">Season map</h2>
          <div className="mt-4 flex justify-between rounded-lg border border-mid-gray bg-off-white p-6">
            {SEASON_ORDER.map((season) => (
              <div key={season} className="flex-1 border-l border-mid-gray px-3 text-center first:border-l-0">
                <p className="text-sm font-medium capitalize text-bark">{season}</p>
                <div className="mt-2 space-y-1">
                  {memberList
                    .filter((m) => m.submissions?.q11_season === season)
                    .map((m) => (
                      <p key={m.id} className="text-sm text-dark-gray">
                        {m.member_name}
                      </p>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-12 rounded-lg bg-soil p-8 text-center text-linen">
        <p className="text-lg">Bring this picture into a coaching conversation.</p>
        <Link
          href="/coaching"
          className="mt-4 inline-block rounded bg-linen px-8 py-3 font-medium text-soil transition hover:bg-off-white"
        >
          Book a discovery call
        </Link>
      </div>
    </div>
  );
}
