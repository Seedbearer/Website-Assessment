import Link from "next/link";
import { notFound } from "next/navigation";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { formatAnswer } from "@/lib/format-answer";
import ResponseTracking from "@/components/admin/ResponseTracking";
import PersonalValuesEditor from "@/components/admin/PersonalValuesEditor";
import CoachingNotes from "@/components/admin/CoachingNotes";
import KnowledgeBaseForm from "@/components/admin/KnowledgeBaseForm";

export const dynamic = "force-dynamic";

export default async function SubmissionDetailPage({ params }: { params: { id: string } }) {
  const supabase = getSupabaseAdmin();

  const [{ data: submission }, { data: personalValues }, { data: notes }] = await Promise.all([
    supabase.from("submissions").select("*").eq("id", params.id).single(),
    supabase.from("personal_values").select("value_order, value_name, value_definition").eq("submission_id", params.id).order("value_order"),
    supabase.from("coaching_notes").select("id, note_type, content, created_at").eq("submission_id", params.id).order("created_at", { ascending: false }),
  ]);

  if (!submission) notFound();

  return (
    <div className="space-y-8">
      <div>
        <Link href="/admin/dashboard" className="text-sm text-bark hover:text-soil transition">
          ← Back to dashboard
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
            <p className="text-sm text-bark">Seed type (algorithm)</p>
            <p className="font-lora text-xl text-soil">{submission.seed_type_algorithm}</p>
          </div>
        </div>
        <a
          href={`mailto:${submission.email}`}
          className="mt-4 inline-block rounded bg-soil px-4 py-2 text-sm font-medium text-linen transition hover:bg-bark"
        >
          Reply via email →
        </a>
      </div>

      {/* Open text panel */}
      <div className="rounded-lg border border-mid-gray bg-off-white p-6">
        <h2 className="font-lora text-lg text-soil">In their own words</h2>
        <div className="mt-4 space-y-4">
          <OpenAnswer label="Q1 — When most fully yourself" text={submission.q1_open} />
          <OpenAnswer label="Q6 — The longing" text={submission.q6_open} />
          <OpenAnswer label="Q12 — Why they're here" text={submission.q12_open} />
        </div>
      </div>

      {/* Scored answers + soil snapshot */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-mid-gray bg-off-white p-6">
          <h2 className="font-lora text-lg text-soil">Scored answers</h2>
          <dl className="mt-3 space-y-2 text-sm">
            <AnswerRow label="Q2 — How you give" value={formatAnswer("q2", submission.q2_answer)} />
            <AnswerRow label="Q3 — Energy source" value={formatAnswer("q3", submission.q3_answers)} />
            <AnswerRow label="Q4 — The wound" value={formatAnswer("q4", submission.q4_answer)} />
            <AnswerRow label="Q5 — Under pressure" value={formatAnswer("q5", submission.q5_answer)} />
          </dl>
        </div>
        <div className="rounded-lg border border-mid-gray bg-off-white p-6">
          <h2 className="font-lora text-lg text-soil">Soil snapshot</h2>
          <dl className="mt-3 space-y-2 text-sm">
            <AnswerRow label="Relational soil" value={formatAnswer("q7", submission.q7_relational)} />
            <AnswerRow label="What relational soil needs" value={formatAnswer("q8", submission.q8_relational_need)} />
            <AnswerRow label="Internal soil" value={formatAnswer("q9", submission.q9_internal)} />
            <AnswerRow label="What internal soil needs" value={formatAnswer("q10", submission.q10_longing)} />
            <AnswerRow label="Season" value={formatAnswer("q11", submission.q11_season)} />
          </dl>
        </div>
      </div>

      <ResponseTracking
        submissionId={submission.id}
        initialSeedTypeCoach={submission.seed_type_coach}
        initialPipelineStage={submission.pipeline_stage}
        initialResponded={submission.responded}
        initialResponseDate={submission.response_date}
      />

      <PersonalValuesEditor submissionId={submission.id} initialValues={personalValues ?? []} />

      <CoachingNotes submissionId={submission.id} familyCode={submission.family_code} initialNotes={notes ?? []} />

      <KnowledgeBaseForm submissionId={submission.id} algorithmType={submission.seed_type_algorithm} />
    </div>
  );
}

function OpenAnswer({ label, text }: { label: string; text: string | null }) {
  return (
    <div>
      <p className="text-sm font-medium text-bark">{label}</p>
      <p className="mt-1 whitespace-pre-wrap text-lg leading-relaxed text-dark-gray">{text || "—"}</p>
    </div>
  );
}

function AnswerRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-mid-gray pb-2 last:border-0">
      <dt className="text-bark">{label}</dt>
      <dd className="text-right text-dark-gray">{value}</dd>
    </div>
  );
}
