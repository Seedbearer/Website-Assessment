import Link from "next/link";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

export default async function FamiliesListPage() {
  const supabase = getSupabaseAdmin();

  const { data: families } = await supabase
    .from("families")
    .select("family_code, family_name, pipeline_stage, created_at")
    .order("created_at", { ascending: false });

  const codes = (families ?? []).map((f) => f.family_code);
  const { data: memberCounts } = codes.length
    ? await supabase.from("family_members").select("family_code").in("family_code", codes)
    : { data: [] as { family_code: string }[] };

  const countByCode = new Map<string, number>();
  for (const m of memberCounts ?? []) {
    countByCode.set(m.family_code, (countByCode.get(m.family_code) ?? 0) + 1);
  }

  return (
    <div className="space-y-6">
      <h1 className="font-lora text-3xl text-soil">Families</h1>

      {!families || families.length === 0 ? (
        <p className="text-dark-gray">
          No family groups yet — this fills in once the family assessment flow (Phase 4) is live.
        </p>
      ) : (
        <ul className="space-y-3">
          {families.map((f) => (
            <li key={f.family_code}>
              <Link
                href={`/admin/families/${f.family_code}`}
                className="flex items-center justify-between rounded-lg border border-mid-gray bg-off-white p-4 hover:border-bark"
              >
                <div>
                  <span className="font-medium text-soil">{f.family_name || f.family_code}</span>
                  <span className="ml-2 text-sm text-bark">{f.family_code}</span>
                </div>
                <span className="text-sm text-dark-gray">{countByCode.get(f.family_code) ?? 0} members</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
