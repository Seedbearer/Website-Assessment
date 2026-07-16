import Link from "next/link";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

type SubmissionRow = {
  id: string;
  first_name: string;
  seed_type_algorithm: string | null;
  seed_type_coach: string | null;
  q11_season: string | null;
  created_at: string;
  responded: boolean;
  priority_response: boolean;
  flag_for_review: boolean;
};

export default async function AdminDashboardPage() {
  const supabase = getSupabaseAdmin();

  const [{ count: total }, { count: thisWeek }, { count: unresponded }, { count: flagged }, { data: priorityQueue }, { data: recent }, { data: families }] =
    await Promise.all([
      supabase.from("submissions").select("id", { count: "exact", head: true }),
      supabase
        .from("submissions")
        .select("id", { count: "exact", head: true })
        .gte("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
      supabase.from("submissions").select("id", { count: "exact", head: true }).eq("responded", false),
      supabase.from("submissions").select("id", { count: "exact", head: true }).eq("flag_for_review", true),
      supabase
        .from("submissions")
        .select("id, first_name, seed_type_algorithm, seed_type_coach, q11_season, created_at, responded, priority_response, flag_for_review")
        .or("priority_response.eq.true,responded.eq.false")
        .order("created_at", { ascending: false })
        .limit(20),
      supabase
        .from("submissions")
        .select("id, first_name, seed_type_algorithm, seed_type_coach, q11_season, created_at, responded, priority_response, flag_for_review")
        .order("created_at", { ascending: false })
        .limit(10),
      supabase
        .from("families")
        .select("family_code, family_name, created_at")
        .order("created_at", { ascending: false })
        .limit(10),
    ]);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-lora text-3xl text-soil">Dashboard</h1>
        <p className="mt-1 text-dark-gray">Your daily workflow starts here.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Total submissions" value={total ?? 0} />
        <StatCard label="This week" value={thisWeek ?? 0} />
        <StatCard label="Unresponded" value={unresponded ?? 0} />
        <StatCard label="Flagged for review" value={flagged ?? 0} />
      </div>

      <section>
        <h2 className="font-lora text-xl text-soil">Priority queue</h2>
        <p className="mt-1 text-sm text-dark-gray">Priority-flagged or not yet responded to, newest first.</p>
        <SubmissionTable rows={(priorityQueue as SubmissionRow[]) ?? []} emptyMessage="Nothing waiting on you right now." />
      </section>

      <section>
        <h2 className="font-lora text-xl text-soil">Recent submissions</h2>
        <SubmissionTable rows={(recent as SubmissionRow[]) ?? []} emptyMessage="No submissions yet." />
      </section>

      <section>
        <h2 className="font-lora text-xl text-soil">Family groups</h2>
        {families && families.length > 0 ? (
          <ul className="mt-3 space-y-2">
            {families.map((f) => (
              <li key={f.family_code}>
                <Link
                  href={`/admin/families/${f.family_code}`}
                  className="block rounded-lg border border-mid-gray bg-off-white p-4 hover:border-bark"
                >
                  <span className="font-medium text-soil">{f.family_name || f.family_code}</span>
                  <span className="ml-2 text-sm text-bark">{f.family_code}</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-dark-gray">
            No family groups yet — this fills in once the family assessment flow (Phase 4) is live.
          </p>
        )}
      </section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-mid-gray bg-off-white p-6 text-center">
      <p className="font-lora text-3xl text-soil">{value}</p>
      <p className="mt-1 text-sm text-dark-gray">{label}</p>
    </div>
  );
}

function SubmissionTable({ rows, emptyMessage }: { rows: SubmissionRow[]; emptyMessage: string }) {
  if (rows.length === 0) {
    return <p className="mt-3 text-sm text-dark-gray">{emptyMessage}</p>;
  }

  return (
    <div className="mt-3 overflow-x-auto rounded-lg border border-mid-gray bg-off-white">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-mid-gray text-bark">
          <tr>
            <th className="px-4 py-3 font-medium">Name</th>
            <th className="px-4 py-3 font-medium">Seed type</th>
            <th className="px-4 py-3 font-medium">Season</th>
            <th className="px-4 py-3 font-medium">Date</th>
            <th className="px-4 py-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-mid-gray last:border-0">
              <td className="px-4 py-3">
                <Link href={`/admin/submissions/${row.id}`} className="font-medium text-soil hover:underline">
                  {row.first_name}
                </Link>
              </td>
              <td className="px-4 py-3 text-dark-gray">{row.seed_type_coach || row.seed_type_algorithm || "—"}</td>
              <td className="px-4 py-3 capitalize text-dark-gray">{row.q11_season || "—"}</td>
              <td className="px-4 py-3 text-dark-gray">{new Date(row.created_at).toLocaleDateString()}</td>
              <td className="px-4 py-3">
                <div className="flex gap-1.5">
                  {row.priority_response && <Badge label="Priority" />}
                  {row.flag_for_review && <Badge label="Flagged" />}
                  <span className={row.responded ? "text-deep-green" : "text-bark"}>
                    {row.responded ? "Responded" : "Awaiting response"}
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Badge({ label }: { label: string }) {
  return <span className="rounded bg-amber px-2 py-0.5 text-xs font-medium text-linen">{label}</span>;
}
