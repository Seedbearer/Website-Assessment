"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const ROLES = ["Parent", "Youth", "Child"];

export default function StartFamilyAssessmentPage() {
  const router = useRouter();
  const [familyName, setFamilyName] = useState("");
  const [memberName, setMemberName] = useState("");
  const [memberRole, setMemberRole] = useState(ROLES[0]);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ familyCode: string } | null>(null);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!memberName.trim()) return;
    setCreating(true);
    setError("");

    try {
      const res = await fetch("/api/family/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ familyName: familyName.trim() || undefined }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Could not create a family code. Please try again.");
      }
      const data = await res.json();
      setResult({ familyCode: data.familyCode });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setCreating(false);
    }
  }

  function handleContinue() {
    if (!result) return;
    sessionStorage.setItem(
      "seedbearer_family_context",
      JSON.stringify({ familyCode: result.familyCode, memberName, memberRole })
    );
    router.push("/assessment/quiz");
  }

  const joinLink = result ? `${window.location.origin}/assessment/join/${result.familyCode}` : "";

  if (result) {
    return (
      <section className="bg-linen px-4 py-20 md:px-8">
        <div className="mx-auto max-w-xl text-center">
          <h1 className="font-lora text-3xl text-soil">Your family code</h1>
          <p className="mt-3 text-lg text-dark-gray">
            Share this with the rest of your family so they can complete their own assessment and
            join your family picture.
          </p>

          <div className="mt-8 rounded-lg border border-mid-gray bg-off-white p-8">
            <p className="font-lora text-4xl tracking-widest text-soil">{result.familyCode}</p>
          </div>

          <div className="mt-4 flex items-center gap-2 rounded-lg border border-mid-gray bg-off-white p-3">
            <input readOnly value={joinLink} className="flex-1 truncate bg-transparent text-sm text-dark-gray" />
            <button
              onClick={() => navigator.clipboard.writeText(joinLink)}
              className="rounded bg-soil px-3 py-1.5 text-sm text-linen transition hover:bg-bark"
            >
              Copy link
            </button>
          </div>

          <button
            onClick={handleContinue}
            className="mt-8 rounded bg-deep-green px-8 py-4 text-lg font-medium text-linen transition hover:opacity-90"
          >
            Continue to my assessment →
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-linen px-4 py-20 md:px-8">
      <div className="mx-auto max-w-xl">
        <h1 className="text-center font-lora text-3xl text-soil">Start a Family Assessment</h1>
        <p className="mt-3 text-center text-lg text-dark-gray">
          You&rsquo;ll get a code to share with the rest of your family. Everyone completes their
          own assessment, and a family picture builds as each person joins.
        </p>

        <form onSubmit={handleCreate} className="mt-8 space-y-4">
          <input
            value={familyName}
            onChange={(e) => setFamilyName(e.target.value)}
            placeholder="Family name (optional)"
            className="w-full rounded-lg border border-mid-gray bg-off-white p-4 text-lg text-dark-gray focus:border-deep-green focus:outline-none"
          />
          <input
            value={memberName}
            onChange={(e) => setMemberName(e.target.value)}
            placeholder="Your name"
            required
            className="w-full rounded-lg border border-mid-gray bg-off-white p-4 text-lg text-dark-gray focus:border-deep-green focus:outline-none"
          />
          <select
            value={memberRole}
            onChange={(e) => setMemberRole(e.target.value)}
            className="w-full rounded-lg border border-mid-gray bg-off-white p-4 text-lg text-dark-gray focus:border-deep-green focus:outline-none"
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>

          {error && <p className="text-sm text-amber">{error}</p>}

          <button
            type="submit"
            disabled={creating || !memberName.trim()}
            className="w-full rounded bg-deep-green px-8 py-4 text-lg font-medium text-linen transition hover:opacity-90 disabled:opacity-50"
          >
            {creating ? "Creating…" : "Create our family code"}
          </button>
        </form>
      </div>
    </section>
  );
}
