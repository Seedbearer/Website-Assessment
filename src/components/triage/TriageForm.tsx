"use client";

import { useState } from "react";
import Link from "next/link";
import { Turnstile } from "@marsidev/react-turnstile";
import OptionButton from "@/components/assessment/OptionButton";
import {
  Q1_OPTIONS,
  Q2_OPTIONS,
  Q3_OPTIONS,
  Q4_OPTIONS,
  Q5_OPTIONS,
  Q6_OPTIONS,
  MATCHED_RESPONSES,
  categoryForQ1,
} from "@/lib/triage-data";

type Answers = {
  q1Primary: string;
  q2Duration: string;
  q3WhoAffected: string[];
  q4StressResponse: string;
  q5BetterLooksLike: string;
  q6Wellbeing: string;
};

const EMPTY_ANSWERS: Answers = {
  q1Primary: "",
  q2Duration: "",
  q3WhoAffected: [],
  q4StressResponse: "",
  q5BetterLooksLike: "",
  q6Wellbeing: "",
};

type Step =
  | { kind: "intro" }
  | { kind: "q1" }
  | { kind: "q2" }
  | { kind: "q3" }
  | { kind: "q4" }
  | { kind: "q5" }
  | { kind: "q6" }
  | { kind: "email" }
  | { kind: "done" };

const STEPS: Step[] = [
  { kind: "intro" },
  { kind: "q1" },
  { kind: "q2" },
  { kind: "q3" },
  { kind: "q4" },
  { kind: "q5" },
  { kind: "q6" },
  { kind: "email" },
  { kind: "done" },
];

export default function TriageForm() {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>(EMPTY_ANSWERS);
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const step = STEPS[stepIndex];

  function isStepValid(): boolean {
    switch (step.kind) {
      case "intro":
        return true;
      case "q1":
        return answers.q1Primary !== "";
      case "q2":
        return answers.q2Duration !== "";
      case "q3":
        return answers.q3WhoAffected.length > 0;
      case "q4":
        return answers.q4StressResponse !== "";
      case "q5":
        return answers.q5BetterLooksLike !== "";
      case "q6":
        return answers.q6Wellbeing !== "";
      case "email": {
        const turnstileSatisfied = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ? Boolean(turnstileToken) : true;
        return firstName.trim().length > 0 && /\S+@\S+\.\S+/.test(email) && consent && turnstileSatisfied;
      }
      default:
        return true;
    }
  }

  async function handleNext() {
    if (!isStepValid()) return;

    if (step.kind !== "email") {
      setStepIndex((i) => i + 1);
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/triage/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, email, turnstileToken, ...answers }),
      });
      if (!res.ok) {
        const resBody = await res.json().catch(() => ({}));
        throw new Error(resBody.error || "Something went wrong submitting your answers.");
      }
      setStepIndex((i) => i + 1);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleBack() {
    if (stepIndex > 0) setStepIndex((i) => i - 1);
  }

  const matchedCategory = answers.q1Primary ? categoryForQ1(answers.q1Primary) : null;
  const matchedResponse = matchedCategory ? MATCHED_RESPONSES[matchedCategory] : null;

  if (step.kind === "done" && matchedResponse) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 md:px-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-bark">We&rsquo;ve received your answers.</p>
        <h1 className="mt-2 font-lora text-3xl text-soil">
          {matchedResponse.emoji} {matchedResponse.category}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-dark-gray">
          Thank you for being honest. That takes courage — especially when things are hard. We&rsquo;ve
          matched your answers to a specific resource and we&rsquo;re sending it to <strong>{email}</strong>{" "}
          now. We also read every submission personally — if what you&rsquo;ve shared needs a real
          conversation rather than a resource, we&rsquo;ll say so, and we&rsquo;ll reach out within 48
          hours.
        </p>

        <div className="mt-8 rounded-lg border border-mid-gray bg-off-white p-6">
          <p className="italic text-dark-gray">{matchedResponse.presentingLine}</p>
          <p className="mt-3 leading-relaxed text-dark-gray">{matchedResponse.whatToKnow}</p>
        </div>

        <div className="mt-6 rounded-lg bg-soil p-6 text-linen">
          <p className="font-lora text-lg">While you wait</p>
          <p className="mt-2 text-straw">
            If there&rsquo;s a difficult moment happening in your family right now, the Honour Framework
            is the most practical immediate tool we have. It&rsquo;s free, it&rsquo;s live, and you can use
            Step 1 tonight.
          </p>
          <Link href="/honour-framework" className="mt-4 inline-block rounded bg-linen px-6 py-3 font-medium text-soil">
            Read the Honour Framework →
          </Link>
        </div>

        <p className="mt-6 text-sm text-bark">
          If something in what you shared feels urgent, you can reply to the email you&rsquo;re about to
          receive. We read those too.
        </p>
      </div>
    );
  }

  const questionNumber = STEPS.slice(1, 7).findIndex((s) => s.kind === step.kind) + 1; // 0 if not a Q1-Q6 step

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 md:px-8">
      {step.kind !== "intro" && (
        <div className="mb-8">
          <p className="text-center text-sm text-bark">
            {questionNumber > 0 ? `Question ${questionNumber} of 6` : "Almost there"}
          </p>
          <div className="mt-2 h-1.5 w-full rounded-full bg-mid-gray">
            <div
              className="h-1.5 rounded-full bg-deep-green transition-all"
              style={{ width: `${(stepIndex / (STEPS.length - 2)) * 100}%` }}
            />
          </div>
        </div>
      )}

      {step.kind === "intro" && (
        <div className="text-center">
          <h1 className="font-lora text-3xl text-soil md:text-4xl">Where is your family right now?</h1>
          <p className="mt-4 text-lg leading-relaxed text-dark-gray">
            Before we talk about who your family was designed to be, we want to know what&rsquo;s
            happening right now. This takes 3–5 minutes. Answer honestly — there are no wrong answers,
            and what you share helps us point you to something genuinely useful.
          </p>
        </div>
      )}

      {step.kind === "q1" && (
        <QuestionStep
          heading="What best describes what’s most difficult in your family right now?"
          sub="Choose the one that feels most urgent today."
          options={Q1_OPTIONS}
          selected={answers.q1Primary}
          onSelect={(v) => setAnswers((a) => ({ ...a, q1Primary: v }))}
        />
      )}

      {step.kind === "q2" && (
        <QuestionStep
          heading="How long has this been going on?"
          options={Q2_OPTIONS}
          selected={answers.q2Duration}
          onSelect={(v) => setAnswers((a) => ({ ...a, q2Duration: v }))}
        />
      )}

      {step.kind === "q3" && (
        <QuestionStep
          heading="Who is most affected by what’s happening right now?"
          sub="Choose all that apply."
          options={Q3_OPTIONS}
          selected={answers.q3WhoAffected}
          multi
          onToggle={(v) =>
            setAnswers((a) => ({
              ...a,
              q3WhoAffected: a.q3WhoAffected.includes(v) ? a.q3WhoAffected.filter((x) => x !== v) : [...a.q3WhoAffected, v],
            }))
          }
        />
      )}

      {step.kind === "q4" && (
        <QuestionStep
          heading="When things are at their hardest, what do you find yourself doing?"
          sub="Choose the one that feels most honest."
          options={Q4_OPTIONS}
          selected={answers.q4StressResponse}
          onSelect={(v) => setAnswers((a) => ({ ...a, q4StressResponse: v }))}
        />
      )}

      {step.kind === "q5" && (
        <QuestionStep
          heading="What would “better” actually look like for your family right now?"
          sub="Not the ideal — the next step. What’s the smallest change that would matter most?"
          options={Q5_OPTIONS}
          selected={answers.q5BetterLooksLike}
          onSelect={(v) => setAnswers((a) => ({ ...a, q5BetterLooksLike: v }))}
        />
      )}

      {step.kind === "q6" && (
        <QuestionStep
          heading="How are you doing in all of this?"
          sub="Be honest. Nobody is watching."
          options={Q6_OPTIONS}
          selected={answers.q6Wellbeing}
          onSelect={(v) => setAnswers((a) => ({ ...a, q6Wellbeing: v }))}
        />
      )}

      {step.kind === "email" && (
        <div>
          <h1 className="font-lora text-2xl text-soil md:text-3xl">You&rsquo;re almost there.</h1>
          <p className="mt-3 text-lg leading-relaxed text-dark-gray">
            Enter your name and email below and we&rsquo;ll send your results and a matched resource
            directly to your inbox. We read every submission and will respond personally within 48
            hours.
          </p>

          <div className="mt-6 space-y-4">
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First name"
              className="w-full rounded-lg border border-mid-gray bg-off-white p-4 text-lg text-dark-gray focus:border-deep-green focus:outline-none"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full rounded-lg border border-mid-gray bg-off-white p-4 text-lg text-dark-gray focus:border-deep-green focus:outline-none"
            />
            <label className="flex items-start gap-3 text-sm text-dark-gray">
              <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 h-4 w-4" />
              I&rsquo;m happy to receive my results and occasional Seedbearer content by email.
              Unsubscribe any time.
            </label>

            {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ? (
              <Turnstile siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY} onSuccess={setTurnstileToken} />
            ) : (
              <p className="text-xs text-amber">
                NEXT_PUBLIC_TURNSTILE_SITE_KEY is not set — abuse protection is disabled in this environment.
              </p>
            )}
          </div>
        </div>
      )}

      {error && <p className="mt-4 text-sm text-amber">{error}</p>}

      {step.kind !== "done" && (
        <div className="mt-8 flex items-center justify-between">
          {stepIndex > 0 ? (
            <button type="button" onClick={handleBack} className="text-sm text-bark hover:text-soil transition">
              ← Back
            </button>
          ) : (
            <span />
          )}
          <button
            type="button"
            onClick={handleNext}
            disabled={!isStepValid() || submitting}
            className="rounded bg-deep-green px-8 py-3 font-medium text-linen transition hover:opacity-90 disabled:opacity-50"
          >
            {submitting ? "Sending…" : step.kind === "intro" ? "Begin" : step.kind === "email" ? "Get my results" : "Next"}
          </button>
        </div>
      )}
    </div>
  );
}

function QuestionStep({
  heading,
  sub,
  options,
  selected,
  onSelect,
  onToggle,
  multi = false,
}: {
  heading: string;
  sub?: string;
  options: { value: string; label: string }[];
  selected: string | string[];
  onSelect?: (value: string) => void;
  onToggle?: (value: string) => void;
  multi?: boolean;
}) {
  return (
    <div>
      <h1 className="font-lora text-2xl text-soil md:text-3xl">{heading}</h1>
      {sub && <p className="mt-2 text-dark-gray">{sub}</p>}
      <div className="mt-6 space-y-3">
        {options.map((opt) => (
          <OptionButton
            key={opt.value}
            label={opt.label}
            selected={multi ? (selected as string[]).includes(opt.value) : selected === opt.value}
            onClick={() => (multi ? onToggle?.(opt.value) : onSelect?.(opt.value))}
          />
        ))}
      </div>
    </div>
  );
}
