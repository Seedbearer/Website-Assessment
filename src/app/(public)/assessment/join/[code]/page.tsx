"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const ROLES = ["Parent", "Youth", "Child"];

export default function JoinFamilyPage({ params }: { params: { code: string } }) {
  const router = useRouter();
  const code = params.code.toUpperCase();

  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [familyName, setFamilyName] = useState<string | null>(null);
  const [memberCount, setMemberCount] = useState(0);

  const [memberName, setMemberName] = useState("");
  const [memberRole, setMemberRole] = useState(ROLES[0]);

  useEffect(() => {
    fetch(`/api/family/${code}`)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        setFamilyName(data.familyName);
        setMemberCount(data.memberCount);
        setLoading(false);
      })
      .catch(() => {
        setNotFound(true);
        setLoading(false);
      });
  }, [code]);

  function handleContinue(e: React.FormEvent) {
    e.preventDefault();
    if (!memberName.trim()) return;
    sessionStorage.setItem("seedbearer_family_context", JSON.stringify({ familyCode: code, memberName, memberRole }));
    router.push("/assessment/quiz");
  }

  if (loading) {
    return (
      <section className="bg-linen px-4 py-20 text-center md:px-8">
        <p className="text-lg text-dark-gray">Checking your family code…</p>
      </section>
    );
  }

  if (notFound) {
    return (
      <section className="bg-linen px-4 py-20 md:px-8">
        <div className="mx-auto max-w-xl text-center">
          <h1 className="font-lora text-3xl text-soil">We couldn&rsquo;t find that code</h1>
          <p className="mt-3 text-lg text-dark-gray">Double check the code you were sent, or start a new family assessment.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-linen px-4 py-20 md:px-8">
      <div className="mx-auto max-w-xl">
        <h1 className="text-center font-lora text-3xl text-soil">
          Join {familyName ? `the ${familyName} family` : "your family"}
        </h1>
        <p className="mt-3 text-center text-lg text-dark-gray">
          {memberCount === 0
            ? "You'll be the first to complete the assessment."
            : `${memberCount} member${memberCount === 1 ? " has" : "s have"} already completed theirs.`}
        </p>

        <form onSubmit={handleContinue} className="mt-8 space-y-4">
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

          <button
            type="submit"
            disabled={!memberName.trim()}
            className="w-full rounded bg-deep-green px-8 py-4 text-lg font-medium text-linen transition hover:opacity-90 disabled:opacity-50"
          >
            Continue to the assessment →
          </button>
        </form>
      </div>
    </section>
  );
}
