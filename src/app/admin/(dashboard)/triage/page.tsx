import Link from "next/link";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import DeleteSubmissionButton from "@/components/admin/DeleteSubmissionButton";

export const dynamic = "force-dynamic";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "unresponded", label: "Unresponded" },
  { key: "priority", label: "Priority" },
  { key: "clinical", label: "Clinical referral" },
];

export default async function TriageListPage({
  searchParams,
}: {
  searchParams: { filter?: string };
}) {
  const supabase = getSupabaseAdmin();
  const activeFilter = searchParams.filter || "all";

  let query = supabase
    .from("triage_submissions")
    .select("id, first_name, email, category, created_at, responded, priority_flag, clinical_referral_flag")
    .order("created_at", { ascending: false });

  if (activeFilter === "unresponded") query = query.eq("responded", false);
  if (activeFilter === "priority") query = query.eq("priority_flag", true);
  if (activeFilter === "clinical") query = query.eq("clinical_referral_flag", true);

  const { data: submissions } = await query;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-lora text-3xl text-soil">Triage Submissions</h1>
        <p className="mt-1 text-dark-gray">The Family Triage Assessment — "Door 1" for families in acute difficulty.</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {FILTERS.map((f) => (
          <Link
            key={f.key}
            href={`/admin/triage${f.key === "all" ? "" : `?filter=${f.key}`}`}
            className={`rounded px-3 py-1.5 text-sm transition ${
              activeFilter === f.key ? "bg-deep-green text-linen" : "bg-off-white text-dark-gray hover:bg-mid-gray"
            }`}
          >
            {f.label}
          </Link>
        ))}
      </div>

      <div className="overflow-x-auto rounded-lg border border-mid-gray bg-off-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-mid-gray text-bark">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {(submissions ?? []).map((row) => (
              <tr key={row.id} className="border-b border-mid-gray last:border-0">
                <td className="px-4 py-3">
                  <Link href={`/admin/triage/${row.id}`} className="font-medium text-soil hover:underline">
                    {row.first_name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-dark-gray">{row.email}</td>
                <td className="px-4 py-3 text-dark-gray">{row.category}</td>
                <td className="px-4 py-3 text-dark-gray">{new Date(row.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1.5">
                    {row.priority_flag && <span className="rounded bg-amber px-2 py-0.5 text-xs text-linen">Priority</span>}
                    {row.clinical_referral_flag && (
                      <span className="rounded bg-amber px-2 py-0.5 text-xs text-linen">Clinical</span>
                    )}
                    <span className={row.responded ? "text-deep-green" : "text-bark"}>
                      {row.responded ? "Responded" : "Awaiting"}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <DeleteSubmissionButton
                    submissionId={row.id}
                    submissionName={row.first_name}
                    endpoint={`/api/admin/triage/${row.id}`}
                    confirmMessage={`Delete ${row.first_name}'s triage submission? This can't be undone.`}
                    compact
                  />
                </td>
              </tr>
            ))}
            {(submissions ?? []).length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-dark-gray">
                  No triage submissions match this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
