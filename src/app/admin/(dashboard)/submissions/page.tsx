import Link from "next/link";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import SubmissionFilterSelects from "@/components/admin/SubmissionFilterSelects";

export const dynamic = "force-dynamic";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "unresponded", label: "Unresponded" },
  { key: "priority", label: "Priority" },
  { key: "flagged", label: "Flagged for review" },
];

export default async function SubmissionsListPage({
  searchParams,
}: {
  searchParams: { filter?: string; seedType?: string; season?: string };
}) {
  const supabase = getSupabaseAdmin();
  const activeFilter = searchParams.filter || "all";

  let query = supabase
    .from("submissions")
    .select("id, first_name, email, seed_type_algorithm, seed_type_coach, q11_season, created_at, responded, priority_response, flag_for_review")
    .order("created_at", { ascending: false });

  if (activeFilter === "unresponded") query = query.eq("responded", false);
  if (activeFilter === "priority") query = query.eq("priority_response", true);
  if (activeFilter === "flagged") query = query.eq("flag_for_review", true);
  if (searchParams.seedType) query = query.eq("seed_type_algorithm", searchParams.seedType);
  if (searchParams.season) query = query.eq("q11_season", searchParams.season);

  const { data: submissions } = await query;

  return (
    <div className="space-y-6">
      <h1 className="font-lora text-3xl text-soil">Submissions</h1>

      <div className="flex flex-wrap items-center gap-2">
        {FILTERS.map((f) => (
          <Link
            key={f.key}
            href={`/admin/submissions${f.key === "all" ? "" : `?filter=${f.key}`}`}
            className={`rounded px-3 py-1.5 text-sm transition ${
              activeFilter === f.key ? "bg-deep-green text-linen" : "bg-off-white text-dark-gray hover:bg-mid-gray"
            }`}
          >
            {f.label}
          </Link>
        ))}

        <SubmissionFilterSelects />
      </div>

      <div className="overflow-x-auto rounded-lg border border-mid-gray bg-off-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-mid-gray text-bark">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Seed type</th>
              <th className="px-4 py-3 font-medium">Season</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {(submissions ?? []).map((row) => (
              <tr key={row.id} className="border-b border-mid-gray last:border-0">
                <td className="px-4 py-3">
                  <Link href={`/admin/submissions/${row.id}`} className="font-medium text-soil hover:underline">
                    {row.first_name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-dark-gray">{row.email}</td>
                <td className="px-4 py-3 text-dark-gray">{row.seed_type_coach || row.seed_type_algorithm || "—"}</td>
                <td className="px-4 py-3 capitalize text-dark-gray">{row.q11_season || "—"}</td>
                <td className="px-4 py-3 text-dark-gray">{new Date(row.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1.5">
                    {row.priority_response && <span className="rounded bg-amber px-2 py-0.5 text-xs text-linen">Priority</span>}
                    {row.flag_for_review && <span className="rounded bg-amber px-2 py-0.5 text-xs text-linen">Flagged</span>}
                    <span className={row.responded ? "text-deep-green" : "text-bark"}>
                      {row.responded ? "Responded" : "Awaiting"}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
            {(submissions ?? []).length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-dark-gray">
                  No submissions match this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
