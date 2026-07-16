"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SEED_TYPE_INFO, type SeedType } from "@/lib/assessment-data";

const SEED_TYPES = Object.keys(SEED_TYPE_INFO) as SeedType[];
const PIPELINE_STAGES = ["assessment_complete", "in_conversation", "coaching_active", "closed"];

export default function ResponseTracking({
  submissionId,
  initialSeedTypeCoach,
  initialPipelineStage,
  initialResponded,
  initialResponseDate,
}: {
  submissionId: string;
  initialSeedTypeCoach: string | null;
  initialPipelineStage: string | null;
  initialResponded: boolean;
  initialResponseDate: string | null;
}) {
  const router = useRouter();
  const [seedTypeCoach, setSeedTypeCoach] = useState(initialSeedTypeCoach ?? "");
  const [pipelineStage, setPipelineStage] = useState(initialPipelineStage ?? "assessment_complete");
  const [responded, setResponded] = useState(initialResponded);
  const [responseDate, setResponseDate] = useState(initialResponseDate);
  const [saving, setSaving] = useState(false);

  async function save(update: Record<string, unknown>) {
    setSaving(true);
    await fetch(`/api/admin/submissions/${submissionId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(update),
    });
    setSaving(false);
    router.refresh();
  }

  async function handleMarkResponded() {
    const now = new Date().toISOString();
    setResponded(true);
    setResponseDate(now);
    await save({ responded: true, response_date: now });
  }

  return (
    <div className="space-y-4 rounded-lg border border-mid-gray bg-off-white p-6">
      <div>
        <label className="block text-sm font-medium text-bark">Seed type (your read)</label>
        <select
          value={seedTypeCoach}
          onChange={(e) => {
            setSeedTypeCoach(e.target.value);
            save({ seed_type_coach: e.target.value || null });
          }}
          className="mt-1 w-full rounded border border-mid-gray bg-linen p-2 text-dark-gray"
        >
          <option value="">— Use algorithm result —</option>
          {SEED_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-bark">Pipeline stage</label>
        <select
          value={pipelineStage}
          onChange={(e) => {
            setPipelineStage(e.target.value);
            save({ pipeline_stage: e.target.value });
          }}
          className="mt-1 w-full rounded border border-mid-gray bg-linen p-2 text-dark-gray"
        >
          {PIPELINE_STAGES.map((stage) => (
            <option key={stage} value={stage}>
              {stage.replace(/_/g, " ")}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center justify-between border-t border-mid-gray pt-4">
        <div className="text-sm text-dark-gray">
          {responded ? (
            <span className="text-deep-green">
              Responded {responseDate ? `on ${new Date(responseDate).toLocaleDateString()}` : ""}
            </span>
          ) : (
            <span className="text-bark">Not yet responded</span>
          )}
        </div>
        {!responded && (
          <button
            onClick={handleMarkResponded}
            disabled={saving}
            className="rounded bg-deep-green px-4 py-2 text-sm font-medium text-linen transition hover:opacity-90 disabled:opacity-50"
          >
            Mark as responded
          </button>
        )}
      </div>
    </div>
  );
}
