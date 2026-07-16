import Link from "next/link";
import { notFound } from "next/navigation";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { getCompatibility } from "@/lib/compatibility";
import type { SeedType } from "@/lib/assessment-data";
import FamilyOverviewNotes from "@/components/admin/FamilyOverviewNotes";
import CoachingNotes from "@/components/admin/CoachingNotes";

export const dynamic = "force-dynamic";

const SEASON_ORDER = ["winter", "thaw", "spring", "summer"];

export default async function FamilyDetailPage({ params }: { params: { code: string } }) {
  const supabase = getSupabaseAdmin();
  const code = params.code;

  const { data: family } = await supabase.from("families").select("*").eq("family_code", code).single();
  if (!family) notFound();

  const { data: members } = await supabase
    .from("family_members")
    .select("id, member_name, member_role, submission_id, submissions(id, seed_type_algorithm, seed_type_coach, q9_internal, q11_season)")
    .eq("family_code", code);

  const submissionIds = (members ?? []).map((m) => m.submission_id).filter(Boolean) as string[];

  const { data: allValues } = submissionIds.length
    ? await supabase
        .from("personal_values")
        .select("submission_id, value_order, value_name, value_definition")
        .in("submission_id", submissionIds)
        .order("value_order")
    : { data: [] as { submission_id: string; value_order: number; value_name: string; value_definition: string }[] };

  const { data: familyNotes } = await supabase
    .from("coaching_notes")
    .select("id, note_type, content, created_at")
    .eq("family_code", code)
    .is("submission_id", null)
    .order("created_at", { ascending: false });

  type MemberRow = {
    id: string;
    member_name: string | null;
    member_role: string | null;
    submission_id: string | null;
    submissions: { id: string; seed_type_algorithm: string | null; seed_type_coach: string | null; q9_internal: string | null; q11_season: string | null } | null;
  };

  const memberList = (members ?? []) as unknown as MemberRow[];
  const membersWithType = memberList
    .map((m) => ({
      ...m,
      seedType: (m.submissions?.seed_type_coach || m.submissions?.seed_type_algorithm) as SeedType | undefined,
    }))
    .filter((m) => m.seedType);

  return (
    <div className="space-y-8">
      <div>
        <Link href="/admin/families" className="text-sm text-bark hover:text-soil transition">
          ← Back to families
        </Link>
      </div>

      <div className="rounded-lg border border-mid-gray bg-off-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-lora text-2xl text-soil">{family.family_name || family.family_code}</h1>
            <p className="text-sm text-bark">{family.family_code} · created {new Date(family.created_at).toLocaleDateString()}</p>
          </div>
          <p className="text-sm text-dark-gray">{memberList.length} member{memberList.length === 1 ? "" : "s"}</p>
        </div>
      </div>

      <FamilyOverviewNotes familyCode={code} initialNotes={family.coach_notes} />

      <section>
        <h2 className="font-lora text-lg text-soil">Members</h2>
        {memberList.length === 0 ? (
          <p className="mt-2 text-dark-gray">No members linked yet.</p>
        ) : (
          <div className="mt-3 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {memberList.map((m) => (
              <Link
                key={m.id}
                href={m.submission_id ? `/admin/submissions/${m.submission_id}` : "#"}
                className="rounded-lg border border-mid-gray bg-off-white p-4 hover:border-bark"
              >
                <p className="font-medium text-soil">{m.member_name || "Unnamed"}</p>
                <p className="text-sm capitalize text-bark">{m.member_role || "member"}</p>
                <p className="mt-2 text-sm text-dark-gray">
                  {m.submissions?.seed_type_coach || m.submissions?.seed_type_algorithm || "No result yet"}
                </p>
                <p className="text-sm capitalize text-dark-gray">{m.submissions?.q11_season || ""}</p>
              </Link>
            ))}
          </div>
        )}
      </section>

      {membersWithType.length >= 2 && (
        <section>
          <h2 className="font-lora text-lg text-soil">Ecosystem analysis</h2>
          <p className="mt-1 text-sm text-dark-gray">
            Green = natural complement, amber = productive tension, neutral = worth noticing case-by-case. No red — all combinations have value.
          </p>
          <div className="mt-3 space-y-3">
            {membersWithType.flatMap((m1, i) =>
              membersWithType.slice(i + 1).map((m2) => {
                const compat = getCompatibility(m1.seedType as SeedType, m2.seedType as SeedType);
                const color =
                  compat.level === "complement" ? "border-deep-green bg-new-growth" : compat.level === "tension" ? "border-amber bg-linen" : "border-mid-gray bg-off-white";
                return (
                  <div key={`${m1.id}-${m2.id}`} className={`rounded-lg border p-4 ${color}`}>
                    <p className="font-medium text-soil">
                      {m1.member_name || m1.seedType} ({m1.seedType}) + {m2.member_name || m2.seedType} ({m2.seedType})
                    </p>
                    <p className="mt-1 text-sm text-dark-gray">{compat.text}</p>
                  </div>
                );
              })
            )}
          </div>
        </section>
      )}

      <section>
        <h2 className="font-lora text-lg text-soil">Soil synthesis</h2>
        {memberList.length === 0 ? (
          <p className="mt-2 text-dark-gray">No data yet.</p>
        ) : (
          <div className="mt-3 overflow-x-auto rounded-lg border border-mid-gray bg-off-white">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-mid-gray text-bark">
                <tr>
                  <th className="px-4 py-2 font-medium">Member</th>
                  <th className="px-4 py-2 font-medium">Internal soil</th>
                  <th className="px-4 py-2 font-medium">Season</th>
                </tr>
              </thead>
              <tbody>
                {memberList.map((m) => (
                  <tr key={m.id} className="border-b border-mid-gray last:border-0">
                    <td className="px-4 py-2 text-dark-gray">{m.member_name || "—"}</td>
                    <td className="px-4 py-2 capitalize text-dark-gray">{m.submissions?.q9_internal || "—"}</td>
                    <td className="px-4 py-2 capitalize text-dark-gray">{m.submissions?.q11_season || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section>
        <h2 className="font-lora text-lg text-soil">Season map</h2>
        {memberList.length === 0 ? (
          <p className="mt-2 text-dark-gray">No data yet.</p>
        ) : (
          <div className="mt-3 flex justify-between rounded-lg border border-mid-gray bg-off-white p-6">
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
        )}
      </section>

      <section>
        <h2 className="font-lora text-lg text-soil">Values comparison</h2>
        {allValues && allValues.length > 0 ? (
          <div className="mt-3 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {memberList.map((m) => {
              const memberValues = allValues.filter((v) => v.submission_id === m.submission_id);
              if (memberValues.length === 0) return null;
              return (
                <div key={m.id} className="rounded-lg border border-mid-gray bg-off-white p-4">
                  <p className="font-medium text-soil">{m.member_name}</p>
                  <ul className="mt-2 space-y-1 text-sm text-dark-gray">
                    {memberValues.map((v) => (
                      <li key={v.value_order}>{v.value_name}</li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="mt-2 text-dark-gray">No personal values recorded yet for this family.</p>
        )}
      </section>

      <CoachingNotes
        familyCode={code}
        initialNotes={familyNotes ?? []}
        noteTypes={["family-session", "pattern", "milestone"]}
        title="Family coaching notes"
      />
    </div>
  );
}
