"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TriageResponseTracking({
  submissionId,
  initialResponded,
  initialResponseDate,
}: {
  submissionId: string;
  initialResponded: boolean;
  initialResponseDate: string | null;
}) {
  const router = useRouter();
  const [responded, setResponded] = useState(initialResponded);
  const [responseDate, setResponseDate] = useState(initialResponseDate);
  const [saving, setSaving] = useState(false);

  async function handleMarkResponded() {
    const now = new Date().toISOString();
    setSaving(true);
    setResponded(true);
    setResponseDate(now);
    await fetch(`/api/admin/triage/${submissionId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ responded: true, response_date: now }),
    });
    setSaving(false);
    router.refresh();
  }

  return (
    <div className="flex items-center justify-between rounded-lg border border-mid-gray bg-off-white p-6">
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
  );
}
