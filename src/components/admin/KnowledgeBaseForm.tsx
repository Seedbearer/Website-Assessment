"use client";

import { useState } from "react";
import { SEED_TYPE_INFO, type SeedType } from "@/lib/assessment-data";

const SEED_TYPES = Object.keys(SEED_TYPE_INFO) as SeedType[];

export default function KnowledgeBaseForm({
  submissionId,
  algorithmType,
}: {
  submissionId: string;
  algorithmType: string | null;
}) {
  const [coachType, setCoachType] = useState("");
  const [overridden, setOverridden] = useState(false);
  const [overrideSignal, setOverrideSignal] = useState("");
  const [woundPattern, setWoundPattern] = useState("");
  const [soilPattern, setSoilPattern] = useState("");
  const [insight, setInsight] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    if (!insight.trim()) return;
    setSaving(true);
    await fetch("/api/admin/knowledge-base", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        submissionId,
        algorithmType,
        coachType: coachType || null,
        overridden,
        overrideSignal: overrideSignal || null,
        woundPattern: woundPattern || null,
        soilPattern: soilPattern || null,
        insight,
      }),
    });
    setSaving(false);
    setSaved(true);
  }

  return (
    <div className="rounded-lg border border-mid-gray bg-off-white p-6">
      <h3 className="font-lora text-lg text-soil">Knowledge base entry</h3>
      <p className="mt-1 text-sm text-dark-gray">After reading their answers — log what you noticed.</p>

      <div className="mt-4 space-y-3">
        <label className="flex items-center gap-2 text-sm text-dark-gray">
          <input type="checkbox" checked={overridden} onChange={(e) => setOverridden(e.target.checked)} />
          Coach type overrides the algorithm result
        </label>

        {overridden && (
          <select
            value={coachType}
            onChange={(e) => setCoachType(e.target.value)}
            className="w-full rounded border border-mid-gray bg-linen p-2 text-dark-gray"
          >
            <option value="">— Select the type you read —</option>
            {SEED_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        )}

        <input
          value={overrideSignal}
          onChange={(e) => setOverrideSignal(e.target.value)}
          placeholder="Which answer revealed it (e.g. Q6 open text)"
          className="w-full rounded border border-mid-gray bg-linen p-2 text-dark-gray"
        />
        <input
          value={woundPattern}
          onChange={(e) => setWoundPattern(e.target.value)}
          placeholder="Wound pattern noticed"
          className="w-full rounded border border-mid-gray bg-linen p-2 text-dark-gray"
        />
        <input
          value={soilPattern}
          onChange={(e) => setSoilPattern(e.target.value)}
          placeholder="Soil pattern noticed"
          className="w-full rounded border border-mid-gray bg-linen p-2 text-dark-gray"
        />
        <textarea
          value={insight}
          onChange={(e) => setInsight(e.target.value)}
          rows={3}
          placeholder="What you noticed that the algorithm missed"
          className="w-full rounded border border-mid-gray bg-linen p-2 text-dark-gray"
        />

        <button
          onClick={handleSave}
          disabled={saving || !insight.trim()}
          className="rounded bg-deep-green px-4 py-2 text-sm font-medium text-linen transition hover:opacity-90 disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save entry"}
        </button>
        {saved && <span className="ml-3 text-sm text-deep-green">Saved</span>}
      </div>
    </div>
  );
}
