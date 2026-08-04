"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteSubmissionButton({
  submissionId,
  submissionName,
  redirectTo,
  compact = false,
}: {
  submissionId: string;
  submissionName: string;
  redirectTo?: string;
  compact?: boolean;
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (
      !window.confirm(
        `Delete ${submissionName}'s submission? This permanently removes their assessment answers, coaching notes, and personal values. This can't be undone.`
      )
    ) {
      return;
    }

    setDeleting(true);
    const res = await fetch(`/api/admin/submissions/${submissionId}`, { method: "DELETE" });
    setDeleting(false);

    if (!res.ok) {
      window.alert("Delete failed. Please try again.");
      return;
    }

    if (redirectTo) {
      router.push(redirectTo);
    } else {
      router.refresh();
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className={
        compact
          ? "text-sm text-bark underline hover:text-red-700 disabled:opacity-50"
          : "rounded border border-red-700 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-700 hover:text-linen disabled:opacity-50"
      }
    >
      {deleting ? "Deleting…" : "Delete submission"}
    </button>
  );
}
