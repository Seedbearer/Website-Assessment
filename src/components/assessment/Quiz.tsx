"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Turnstile } from "@marsidev/react-turnstile";
import { QUESTIONS, TOTAL_QUESTIONS, type ChoiceQuestion, type OpenQuestion } from "@/lib/assessment-data";
import OptionButton from "./OptionButton";

type Answers = {
  q1Open: string;
  q2Answer: string;
  q3Answers: string[];
  q4Answer: string;
  q5Answer: string;
  q6Open: string;
  q7Relational: string;
  q8RelationalNeed: string;
  q9Internal: string;
  q10Longing: string[];
  q11Season: string;
  q12Open: string;
};

const EMPTY_ANSWERS: Answers = {
  q1Open: "",
  q2Answer: "",
  q3Answers: [],
  q4Answer: "",
  q5Answer: "",
  q6Open: "",
  q7Relational: "",
  q8RelationalNeed: "",
  q9Internal: "",
  q10Longing: [],
  q11Season: "",
  q12Open: "",
};

const FIELD_BY_QUESTION_ID: Record<string, keyof Answers> = {
  q1: "q1Open",
  q2: "q2Answer",
  q3: "q3Answers",
  q4: "q4Answer",
  q5: "q5Answer",
  q6: "q6Open",
  q7: "q7Relational",
  q8: "q8RelationalNeed",
  q9: "q9Internal",
  q10: "q10Longing",
  q11: "q11Season",
  q12: "q12Open",
};

type Slide = { kind: "question"; question: typeof QUESTIONS[number] } | { kind: "email" };

export default function Quiz() {
  const router = useRouter();

  const slides = useMemo<Slide[]>(() => {
    const q1to10 = QUESTIONS.slice(0, 10).map((question) => ({ kind: "question" as const, question }));
    const q11to12 = QUESTIONS.slice(10).map((question) => ({ kind: "question" as const, question }));
    return [...q1to10, { kind: "email" as const }, ...q11to12];
  }, []);

  const [slideIndex, setSlideIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>(EMPTY_ANSWERS);
  const [firstName, setFirstName] = useState(() => {
    if (typeof window === "undefined") return "";
    const raw = sessionStorage.getItem("seedbearer_family_context");
    if (!raw) return "";
    try {
      return JSON.parse(raw).memberName ?? "";
    } catch {
      return "";
    }
  });
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const slide = slides[slideIndex];
  const questionsAnsweredSoFar = slides
    .slice(0, slideIndex)
    .filter((s) => s.kind === "question").length;

  function isSlideValid(): boolean {
    if (slide.kind === "email") {
      const turnstileSatisfied = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
        ? Boolean(turnstileToken)
        : true;
      return firstName.trim().length > 0 && /\S+@\S+\.\S+/.test(email) && consent && turnstileSatisfied;
    }
    const q = slide.question;
    const field = FIELD_BY_QUESTION_ID[q.id];
    const value = answers[field];
    if (q.kind === "open") return typeof value === "string" && value.trim().length > 0;
    if (q.kind === "multi") return Array.isArray(value) && value.length > 0;
    return typeof value === "string" && value.length > 0;
  }

  function updateSingle(field: keyof Answers, value: string) {
    setAnswers((prev) => ({ ...prev, [field]: value }));
  }

  function toggleMulti(field: keyof Answers, value: string, maxSelect: number) {
    setAnswers((prev) => {
      const current = prev[field] as string[];
      if (current.includes(value)) {
        return { ...prev, [field]: current.filter((v) => v !== value) };
      }
      if (current.length >= maxSelect) return prev;
      return { ...prev, [field]: [...current, value] };
    });
  }

  async function handleNext() {
    if (!isSlideValid()) return;

    if (slideIndex < slides.length - 1) {
      setSlideIndex((i) => i + 1);
      return;
    }

    // Last slide (Q12) — submit.
    setSubmitting(true);
    setError("");
    try {
      const familyContextRaw = sessionStorage.getItem("seedbearer_family_context");
      const familyContext = familyContextRaw ? JSON.parse(familyContextRaw) : null;

      const res = await fetch("/api/assessment/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          email,
          turnstileToken,
          familyCode: familyContext?.familyCode,
          memberName: familyContext?.memberName,
          memberRole: familyContext?.memberRole,
          ...answers,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Something went wrong submitting your assessment.");
      }
      const data = await res.json();
      sessionStorage.removeItem("seedbearer_family_context");
      sessionStorage.setItem(
        "seedbearer_result",
        JSON.stringify({
          firstName,
          seedType: data.seedType,
          q9Internal: answers.q9Internal,
          q11Season: answers.q11Season,
          familyCode: familyContext?.familyCode,
        })
      );
      router.push("/assessment/results");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  function handleBack() {
    if (slideIndex > 0) setSlideIndex((i) => i - 1);
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 md:px-8">
      <div className="mb-8">
        <p className="text-center text-sm text-bark">
          {slide.kind === "question" ? `Question ${slide.question.number} of ${TOTAL_QUESTIONS}` : "Almost there"}
        </p>
        <div className="mt-2 h-1.5 w-full rounded-full bg-mid-gray">
          <div
            className="h-1.5 rounded-full bg-deep-green transition-all"
            style={{ width: `${(questionsAnsweredSoFar / TOTAL_QUESTIONS) * 100}%` }}
          />
        </div>
      </div>

      {slide.kind === "question" ? (
        <QuestionSlide
          question={slide.question}
          answers={answers}
          onSingle={updateSingle}
          onMulti={toggleMulti}
        />
      ) : (
        <EmailCaptureSlide
          firstName={firstName}
          email={email}
          consent={consent}
          onFirstName={setFirstName}
          onEmail={setEmail}
          onConsent={setConsent}
          onTurnstile={setTurnstileToken}
        />
      )}

      {error && <p className="mt-4 text-sm text-amber">{error}</p>}

      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          onClick={handleBack}
          disabled={slideIndex === 0 || submitting}
          className="text-sm text-bark hover:text-soil transition disabled:opacity-0"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={!isSlideValid() || submitting}
          className="rounded bg-deep-green px-8 py-4 text-lg font-medium text-linen transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {submitting ? "Submitting…" : slideIndex === slides.length - 1 ? "See my results" : "Next"}
        </button>
      </div>
    </div>
  );
}

function QuestionSlide({
  question,
  answers,
  onSingle,
  onMulti,
}: {
  question: ChoiceQuestion | OpenQuestion;
  answers: Answers;
  onSingle: (field: keyof Answers, value: string) => void;
  onMulti: (field: keyof Answers, value: string, maxSelect: number) => void;
}) {
  const field = FIELD_BY_QUESTION_ID[question.id];

  return (
    <div>
      <h1 className="font-lora text-2xl text-soil md:text-3xl">{question.title}</h1>
      <p className="mt-3 text-lg leading-relaxed text-dark-gray">{question.prompt}</p>
      {question.helper && <p className="mt-2 text-sm italic text-bark">{question.helper}</p>}

      {question.kind === "open" && (
        <textarea
          value={answers[field] as string}
          onChange={(e) => onSingle(field, e.target.value)}
          rows={5}
          className="mt-6 w-full rounded-lg border border-mid-gray bg-off-white p-4 text-lg text-dark-gray focus:border-deep-green focus:outline-none"
          placeholder="Take your time…"
        />
      )}

      {question.kind === "single" && (
        <div className="mt-6 space-y-3">
          {question.options.map((opt) => (
            <OptionButton
              key={opt.value}
              label={opt.label}
              selected={answers[field] === opt.value}
              onClick={() => onSingle(field, opt.value)}
            />
          ))}
        </div>
      )}

      {question.kind === "multi" && (
        <div className="mt-6 space-y-3">
          {question.options.map((opt) => (
            <OptionButton
              key={opt.value}
              label={opt.label}
              selected={(answers[field] as string[]).includes(opt.value)}
              onClick={() => onMulti(field, opt.value, question.maxSelect ?? 2)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function EmailCaptureSlide({
  firstName,
  email,
  consent,
  onFirstName,
  onEmail,
  onConsent,
  onTurnstile,
}: {
  firstName: string;
  email: string;
  consent: boolean;
  onFirstName: (v: string) => void;
  onEmail: (v: string) => void;
  onConsent: (v: boolean) => void;
  onTurnstile: (token: string) => void;
}) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  return (
    <div>
      <h1 className="font-lora text-2xl text-soil md:text-3xl">Where should we send your results?</h1>
      <p className="mt-3 text-lg leading-relaxed text-dark-gray">
        Two more questions after this, then your results are ready.
      </p>

      <div className="mt-6 space-y-4">
        <input
          type="text"
          value={firstName}
          onChange={(e) => onFirstName(e.target.value)}
          placeholder="First name"
          className="w-full rounded-lg border border-mid-gray bg-off-white p-4 text-lg text-dark-gray focus:border-deep-green focus:outline-none"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => onEmail(e.target.value)}
          placeholder="Email address"
          className="w-full rounded-lg border border-mid-gray bg-off-white p-4 text-lg text-dark-gray focus:border-deep-green focus:outline-none"
        />
        <label className="flex items-start gap-3 text-sm text-dark-gray">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => onConsent(e.target.checked)}
            className="mt-1 h-4 w-4"
          />
          I&rsquo;m happy to receive my Seed Assessment results and occasional Seedbearer content by
          email. Unsubscribe any time.
        </label>

        {siteKey ? (
          <Turnstile siteKey={siteKey} onSuccess={onTurnstile} />
        ) : (
          <p className="text-xs text-amber">
            NEXT_PUBLIC_TURNSTILE_SITE_KEY is not set — abuse protection is disabled in this
            environment.
          </p>
        )}
      </div>
    </div>
  );
}
