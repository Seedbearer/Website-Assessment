"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type ValueSlot = { value_order: number; value_name: string; value_definition: string };

function emptySlots(): ValueSlot[] {
  return [1, 2, 3, 4, 5].map((n) => ({ value_order: n, value_name: "", value_definition: "" }));
}

export default function PersonalValuesEditor({
  submissionId,
  initialValues,
}: {
  submissionId: string;
  initialValues: ValueSlot[];
}) {
  const router = useRouter();
  const [slots, setSlots] = useState<ValueSlot[]>(() => {
    const base = emptySlots();
    for (const v of initialValues) {
      const idx = base.findIndex((b) => b.value_order === v.value_order);
      if (idx >= 0) base[idx] = v;
    }
    return base;
  });
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  function update(order: number, field: "value_name" | "value_definition", value: string) {
    setSlots((prev) => prev.map((s) => (s.value_order === order ? { ...s, [field]: value } : s)));
  }

  async function handleSave() {
    setSaving(true);
    await fetch(`/api/admin/personal-values/${submissionId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ values: slots }),
    });
    setSaving(false);
    setSavedAt(Date.now());
    router.refresh();
  }

  return (
    <div className="rounded-lg border border-mid-gray bg-off-white p-6">
      <h3 className="font-lora text-lg text-soil">Personal values</h3>
      <div className="mt-4 space-y-4">
        {slots.map((slot) => (
          <div key={slot.value_order} className="grid grid-cols-1 gap-2 md:grid-cols-3">
            <input
              value={slot.value_name}
              onChange={(e) => update(slot.value_order, "value_name", e.target.value)}
              placeholder={`Value ${slot.value_order}`}
              className="rounded border border-mid-gray bg-linen p-2 text-dark-gray md:col-span-1"
            />
            <textarea
              value={slot.value_definition}
              onChange={(e) => update(slot.value_order, "value_definition", e.target.value)}
              placeholder="What this means to them, in their words"
              rows={2}
              className="rounded border border-mid-gray bg-linen p-2 text-dark-gray md:col-span-2"
            />
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded bg-deep-green px-4 py-2 text-sm font-medium text-linen transition hover:opacity-90 disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save values"}
        </button>
        {savedAt && <span className="text-sm text-deep-green">Saved</span>}
      </div>
    </div>
  );
}
