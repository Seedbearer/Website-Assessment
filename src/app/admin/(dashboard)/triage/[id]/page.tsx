import Link from "next/link";
import { notFound } from "next/navigation";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { Q2_OPTIONS, Q3_OPTIONS, Q4_OPTIONS, Q5_OPTIONS, Q6_OPTIONS, Q1_OPTIONS, MATCHED_RESPONSES, labelFor, type TriageCategory } from "@/lib/triage-data";
import TriageResponseTracking from "@/components/admin/TriageResponseTracking";
import DeleteSubmissionButton from "@/components/admin/DeleteSubmissionButton";

export const dynamic = "force-dynamic";

export default async function TriageDetailPage({ params }: { params: { id: string } }) {
  const supabase = getSupabaseAdmin();
  const { data: submission } = await supabase.from("triage_submissions").select("*").eq("id", params.id).single();

  if (!submission) notFound();

  const matchedResponse = MATCHED_RESPONSES[submission.category as TriageCategory];

  return (
    <div className="space-y-8">
      <div>
        <Link href="/admin/triage" className="text-sm text-bark hover:text-soil transition">
          ← Back to triage submissions
        </Link>
      </div>

      {/* Header */}
      <div className="rounded-lg border border-mid-gray bg-off-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-lora text-2xl text-soil">{submission.first_name}</h1>
            <p className="text-dark-gray">{submission.email}</p>
            <p className="text-sm text-bark">{new Date(submission.created_at).toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-bark">Category</p>
            <p className="font-lora text-xl text-soil">
              {matchedResponse?.emoji} {submission.category}
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {submission.priority_flag && <span className="rounded bg-amber px-2 py-0.5 text-xs text-linen">Priority — respond within 24hrs</span>}
          {submission.clinical_referral_flag && (
            <span className="rounded bg-amber px-2 py-0.5 text-xs text-linen">Clinical referral signposted</span>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <a
            href={`mailto:${submission.email}`}
            className="inline-block rounded bg-soil px-4 py-2 text-sm font-medium text-linen transition hover:bg-bark"
          >
            Reply via email →
          </a>
          <DeleteSubmissionButton
            submissionId={submission.id}
            submissionName={submission.first_name}
            endpoint={`/api/admin/triage/${submission.id}`}
            confirmMessage={`Delete ${submission.first_name}'s triage submission? This can't be undone.`}
            redirectTo="/admin/triage"
          />
        </div>
      </div>

      {/* Answers */}
      <div className="rounded-lg border border-mid-gray bg-off-white p-6">
        <h2 className="font-lora text-lg text-soil">Their answers</h2>
        <dl className="mt-3 space-y-3 text-sm">
          <AnswerRow label="Q1 — What's most difficult" value={labelFor(Q1_OPTIONS, submission.q1_primary)} />
          <AnswerRow label="Q2 — How long" value={labelFor(Q2_OPTIONS, submission.q2_duration)} />
          <AnswerRow
            label="Q3 — Who's affected"
            value={(submission.q3_who_affected ?? []).map((v: string) => labelFor(Q3_OPTIONS, v)).join("; ") || "—"}
          />
          <AnswerRow label="Q4 — Default response under pressure" value={labelFor(Q4_OPTIONS, submission.q4_stress_response)} />
          <AnswerRow label="Q5 — What better would look like" value={labelFor(Q5_OPTIONS, submission.q5_better_looks_like)} />
          <AnswerRow label="Q6 — How they're doing" value={labelFor(Q6_OPTIONS, submission.q6_wellbeing)} />
        </dl>
      </div>

      {/* Matched response sent */}
      {matchedResponse && (
        <div className="rounded-lg border border-mid-gray bg-off-white p-6">
          <h2 className="font-lora text-lg text-soil">Resource sent</h2>
          <p className="mt-2 italic text-dark-gray">{matchedResponse.presentingLine}</p>
          <p className="mt-2 text-sm leading-relaxed text-dark-gray">{matchedResponse.whatToKnow}</p>
        </div>
      )}

      <TriageResponseTracking
        submissionId={submission.id}
        initialResponded={submission.responded}
        initialResponseDate={submission.response_date}
      />
    </div>
  );
}

function AnswerRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 border-b border-mid-gray pb-3 last:border-0 sm:flex-row sm:justify-between sm:gap-4">
      <dt className="shrink-0 text-bark">{label}</dt>
      <dd className="text-dark-gray sm:text-right">{value}</dd>
    </div>
  );
}
