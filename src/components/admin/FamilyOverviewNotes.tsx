"use client";

import { useState } from "react";

export default function FamilyOverviewNotes({ familyCode, initialNotes }: { familyCode: string; initialNotes: string | null }) {
  const [notes, setNotes] = useState(initialNotes ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setSaving(true);
    await fetch(`/api/admin/families/${familyCode}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ coach_notes: notes }),
    });
    setSaving(false);
    setSaved(true);
  }

  return (
    <div className="rounded-lg border border-mid-gray bg-off-white p-6">
      <h2 className="font-lora text-lg text-soil">Family overview notes</h2>
      <p className="mt-1 text-sm text-dark-gray">Your overall observations about this family system.</p>
      <textarea
        value={notes}
        onChange={(e) => {
          setNotes(e.target.value);
          setSaved(false);
        }}
        rows={5}
        className="mt-3 w-full rounded border border-mid-gray bg-linen p-3 text-dark-gray"
        placeholder="What are you noticing about this family as a whole?"
      />
      <div className="mt-3 flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded bg-deep-green px-4 py-2 text-sm font-medium text-linen transition hover:opacity-90 disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save"}
        </button>
        {saved && <span className="text-sm text-deep-green">Saved</span>}
      </div>
    </div>
  );
}
