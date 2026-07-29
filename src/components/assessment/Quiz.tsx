"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Turnstile } from "@marsidev/react-turnstile";
import { QUESTIONS, type ChoiceQuestion } from "@/lib/assessment-data";
import {
  WOUND_OPTIONS,
  INSTINCT_OPTIONS,
  STAND_VIRTUE_OPTIONS,
  REACH_VIRTUE_OPTIONS,
  GARDEN_VIRTUE_OPTIONS,
  WALK_VIRTUE_OPTIONS,
  STORY_SCENES,
  type WoundValue,
  type StandVirtue,
  type ReachVirtue,
  type GardenVirtue,
  type WalkVirtue,
} from "@/lib/story-assessment-data";
import type { SeedType } from "@/lib/assessment-data";
import OptionButton from "./OptionButton";

// The reinstated soil/season questions (Q7, Q8, Q9, Q10, Q11) — unchanged from the original
// 12-question assessment, appended after the story narrative so the admin/family dashboard
// features that depend on them (soil snapshot, soil synthesis, season map) keep working.
const FOLLOWUP_QUESTIONS = QUESTIONS.filter((q) => ["q7", "q8", "q9", "q10", "q11"].includes(q.id)) as ChoiceQuestion[];

type StoryAnswers = {
  wound: WoundValue | "";
  otherWords: string;
  woundCost: string;
  standVirtue: StandVirtue | "";
  reachVirtue: ReachVirtue | "";
  instinctType: SeedType | "";
  gardenVirtue: GardenVirtue | "";
  walkVirtue: WalkVirtue | "";
  closingText: string;
};

const EMPTY_STORY: StoryAnswers = {
  wound: "",
  otherWords: "",
  woundCost: "",
  standVirtue: "",
  reachVirtue: "",
  instinctType: "",
  gardenVirtue: "",
  walkVirtue: "",
  closingText: "",
};

type FollowupAnswers = {
  q7Relational: string;
  q8RelationalNeed: string;
  q9Internal: string;
  q10Longing: string[];
  q11Season: string;
};

const EMPTY_FOLLOWUP: FollowupAnswers = {
  q7Relational: "",
  q8RelationalNeed: "",
  q9Internal: "",
  q10Longing: [],
  q11Season: "",
};

const FOLLOWUP_FIELD: Record<string, keyof FollowupAnswers> = {
  q7: "q7Relational",
  q8: "q8RelationalNeed",
  q9: "q9Internal",
  q10: "q10Longing",
  q11: "q11Season",
};

type Slide =
  | { kind: "scene"; scene: number }
  | { kind: "question"; question: ChoiceQuestion }
  | { kind: "email" };

export default function Quiz() {
  const router = useRouter();

  const slides = useMemo<Slide[]>(() => {
    const scenes: Slide[] = [0, 1, 2, 3, 4, 5, 6].map((scene) => ({ kind: "scene", scene }));
    const q7q8q9 = FOLLOWUP_QUESTIONS.slice(0, 3).map((question) => ({ kind: "question" as const, question }));
    const q10q11 = FOLLOWUP_QUESTIONS.slice(3).map((question) => ({ kind: "question" as const, question }));
    return [...scenes, ...q7q8q9, { kind: "email" as const }, ...q10q11];
  }, []);

  const [slideIndex, setSlideIndex] = useState(0);
  const [story, setStory] = useState<StoryAnswers>(EMPTY_STORY);
  const [followup, setFollowup] = useState<FollowupAnswers>(EMPTY_FOLLOWUP);
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

  const seasonLabel = (() => {
    if (slide.kind !== "scene") return null;
    if (slide.scene <= 1) return "Winter";
    if (slide.scene === 2) return "Thaw";
    if (slide.scene === 3 || slide.scene === 4) return "Spring";
    if (slide.scene === 5) return "Summer";
    return "Close";
  })();

  function isSlideValid(): boolean {
    if (slide.kind === "email") {
      const turnstileSatisfied = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ? Boolean(turnstileToken) : true;
      return firstName.trim().length > 0 && /\S+@\S+\.\S+/.test(email) && consent && turnstileSatisfied;
    }
    if (slide.kind === "question") {
      const field = FOLLOWUP_FIELD[slide.question.id];
      const value = followup[field];
      if (slide.question.kind === "multi") return Array.isArray(value) && value.length > 0;
      return typeof value === "string" && value.length > 0;
    }
    switch (slide.scene) {
      case 0:
        return story.wound !== "";
      case 1:
        return story.woundCost.trim().length > 0 && story.standVirtue !== "";
      case 2:
        return story.reachVirtue !== "";
      case 3:
        return story.instinctType !== "";
      case 4:
        return story.gardenVirtue !== "";
      case 5:
        return story.walkVirtue !== "";
      case 6:
        return story.closingText.trim().length > 0;
      default:
        return false;
    }
  }

  async function handleNext() {
    if (!isSlideValid()) return;

    if (slideIndex < slides.length - 1) {
      setSlideIndex((i) => i + 1);
      return;
    }

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
          ...story,
          ...followup,
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
          standVirtue: story.standVirtue,
          reachVirtue: story.reachVirtue,
          gardenVirtue: story.gardenVirtue,
          walkVirtue: story.walkVirtue,
          q9Internal: followup.q9Internal,
          q11Season: followup.q11Season,
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
          {seasonLabel ?? (slide.kind === "email" ? "Almost there" : "Your soil")}
        </p>
        <div className="mt-2 h-1.5 w-full rounded-full bg-mid-gray">
          <div
            className="h-1.5 rounded-full bg-deep-green transition-all"
            style={{ width: `${((slideIndex + 1) / slides.length) * 100}%` }}
          />
        </div>
      </div>

      {slide.kind === "scene" && (
        <StoryScene scene={slide.scene} story={story} setStory={setStory} />
      )}

      {slide.kind === "question" && (
        <FollowupQuestion question={slide.question} followup={followup} setFollowup={setFollowup} />
      )}

      {slide.kind === "email" && (
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

function SceneText({ body, prompt }: { body: string; prompt?: string }) {
  return (
    <>
      {body.split("\n\n").map((para, i) => (
        <p key={i} className="mt-3 text-lg leading-relaxed text-dark-gray first:mt-0">
          {para}
        </p>
      ))}
      {prompt && <p className="mt-4 font-lora text-xl text-soil">{prompt}</p>}
    </>
  );
}

function StoryScene({
  scene,
  story,
  setStory,
}: {
  scene: number;
  story: StoryAnswers;
  setStory: React.Dispatch<React.SetStateAction<StoryAnswers>>;
}) {
  if (scene === 0) {
    return (
      <div>
        <h1 className="font-lora text-2xl text-soil md:text-3xl">Winter</h1>
        <SceneText body={STORY_SCENES.winterWall.body} prompt={STORY_SCENES.winterWall.prompt} />
        <div className="mt-4 space-y-3">
          {WOUND_OPTIONS.map((w) => (
            <OptionButton
              key={w}
              label={w}
              selected={story.wound === w}
              onClick={() => setStory((s) => ({ ...s, wound: w }))}
            />
          ))}
        </div>
        <p className="mt-6 text-lg text-dark-gray">{STORY_SCENES.winterWall.otherWordsPrompt}</p>
        <textarea
          value={story.otherWords}
          onChange={(e) => setStory((s) => ({ ...s, otherWords: e.target.value }))}
          rows={3}
          className="mt-2 w-full rounded-lg border border-mid-gray bg-off-white p-4 text-lg text-dark-gray focus:border-deep-green focus:outline-none"
          placeholder="Optional…"
        />
      </div>
    );
  }

  if (scene === 1) {
    return (
      <div>
        <h1 className="font-lora text-2xl text-soil md:text-3xl">Winter</h1>
        <p className="mt-3 text-lg text-dark-gray">
          You named <strong>&ldquo;{story.wound}&rdquo;</strong> as the word carved deepest.
        </p>
        <p className="mt-4 font-lora text-xl text-soil">{STORY_SCENES.winterStand.woundCostPrompt}</p>
        <textarea
          value={story.woundCost}
          onChange={(e) => setStory((s) => ({ ...s, woundCost: e.target.value }))}
          rows={4}
          className="mt-2 w-full rounded-lg border border-mid-gray bg-off-white p-4 text-lg text-dark-gray focus:border-deep-green focus:outline-none"
          placeholder="Take your time…"
        />
        <SceneText body={STORY_SCENES.winterStand.body} prompt={STORY_SCENES.winterStand.prompt} />
        <div className="mt-4 space-y-3">
          {STAND_VIRTUE_OPTIONS.map((v) => (
            <OptionButton
              key={v.value}
              label={v.label}
              selected={story.standVirtue === v.value}
              onClick={() => setStory((s) => ({ ...s, standVirtue: v.value }))}
            />
          ))}
        </div>
      </div>
    );
  }

  if (scene === 2) {
    return (
      <div>
        <h1 className="font-lora text-2xl text-soil md:text-3xl">Thaw</h1>
        <SceneText body={STORY_SCENES.thaw.body} prompt={STORY_SCENES.thaw.prompt} />
        <div className="mt-4 space-y-3">
          {REACH_VIRTUE_OPTIONS.map((v) => (
            <OptionButton
              key={v.value}
              label={v.label}
              selected={story.reachVirtue === v.value}
              onClick={() => setStory((s) => ({ ...s, reachVirtue: v.value }))}
            />
          ))}
        </div>
      </div>
    );
  }

  if (scene === 3) {
    return (
      <div>
        <h1 className="font-lora text-2xl text-soil md:text-3xl">Spring</h1>
        <SceneText body={STORY_SCENES.springInstinct.body} prompt={STORY_SCENES.springInstinct.prompt} />
        <div className="mt-4 space-y-3">
          {INSTINCT_OPTIONS.map((opt) => (
            <OptionButton
              key={opt.type}
              label={opt.text}
              selected={story.instinctType === opt.type}
              onClick={() => setStory((s) => ({ ...s, instinctType: opt.type }))}
            />
          ))}
        </div>
      </div>
    );
  }

  if (scene === 4) {
    return (
      <div>
        <h1 className="font-lora text-2xl text-soil md:text-3xl">Spring</h1>
        <SceneText body={STORY_SCENES.springGarden.body} prompt={STORY_SCENES.springGarden.prompt} />
        <div className="mt-4 space-y-3">
          {GARDEN_VIRTUE_OPTIONS.map((v) => (
            <OptionButton
              key={v.value}
              label={v.label}
              selected={story.gardenVirtue === v.value}
              onClick={() => setStory((s) => ({ ...s, gardenVirtue: v.value }))}
            />
          ))}
        </div>
      </div>
    );
  }

  if (scene === 5) {
    return (
      <div>
        <h1 className="font-lora text-2xl text-soil md:text-3xl">Summer</h1>
        <SceneText body={STORY_SCENES.summer.body} prompt={STORY_SCENES.summer.prompt} />
        <div className="mt-4 space-y-3">
          {WALK_VIRTUE_OPTIONS.map((v) => (
            <OptionButton
              key={v.value}
              label={v.label}
              selected={story.walkVirtue === v.value}
              onClick={() => setStory((s) => ({ ...s, walkVirtue: v.value }))}
            />
          ))}
        </div>
      </div>
    );
  }

  // scene 6 — close
  const virtues = [story.standVirtue, story.reachVirtue, story.gardenVirtue, story.walkVirtue].filter(Boolean);
  return (
    <div>
      <h1 className="font-lora text-2xl text-soil md:text-3xl">Four seasons</h1>
      <SceneText body={STORY_SCENES.close.body} />

      <div className="mt-4 rounded-lg border border-mid-gray bg-off-white p-4">
        <p className="text-sm font-medium text-bark">Yours to keep</p>
        <p className="mt-1 text-lg text-dark-gray">{virtues.join(" · ")}</p>
      </div>

      <div className="mt-4 rounded-lg border border-mid-gray bg-linen p-4">
        <p className="text-sm font-medium text-bark">What your coach reads before your first session</p>
        <p className="mt-1 text-dark-gray">
          Wound: <strong>{story.wound}</strong>
          {story.otherWords && <> · Other words: {story.otherWords}</>}
        </p>
        <p className="mt-1 text-dark-gray">Cost: {story.woundCost}</p>
        <p className="mt-1 text-dark-gray">Instinct: {story.instinctType}</p>
      </div>

      <p className="mt-6 font-lora text-xl text-soil">{STORY_SCENES.close.whoAreYou}</p>
      <p className="mt-2 text-lg text-dark-gray">{STORY_SCENES.close.closingPrompt}</p>
      <textarea
        value={story.closingText}
        onChange={(e) => setStory((s) => ({ ...s, closingText: e.target.value }))}
        rows={4}
        className="mt-2 w-full rounded-lg border border-mid-gray bg-off-white p-4 text-lg text-dark-gray focus:border-deep-green focus:outline-none"
        placeholder="Take your time…"
      />
    </div>
  );
}

function FollowupQuestion({
  question,
  followup,
  setFollowup,
}: {
  question: ChoiceQuestion;
  followup: FollowupAnswers;
  setFollowup: React.Dispatch<React.SetStateAction<FollowupAnswers>>;
}) {
  const field = FOLLOWUP_FIELD[question.id];
  const value = followup[field];

  return (
    <div>
      <h1 className="font-lora text-2xl text-soil md:text-3xl">{question.title}</h1>
      <p className="mt-3 text-lg leading-relaxed text-dark-gray">{question.prompt}</p>
      {question.helper && <p className="mt-2 text-sm italic text-bark">{question.helper}</p>}

      <div className="mt-6 space-y-3">
        {question.options.map((opt) => {
          const selected = question.kind === "multi" ? (value as string[]).includes(opt.value) : value === opt.value;
          return (
            <OptionButton
              key={opt.value}
              label={opt.label}
              selected={selected}
              onClick={() => {
                if (question.kind === "multi") {
                  setFollowup((prev) => {
                    const current = prev[field] as string[];
                    if (current.includes(opt.value)) {
                      return { ...prev, [field]: current.filter((v) => v !== opt.value) };
                    }
                    if (current.length >= (question.maxSelect ?? 2)) return prev;
                    return { ...prev, [field]: [...current, opt.value] };
                  });
                } else {
                  setFollowup((prev) => ({ ...prev, [field]: opt.value }));
                }
              }}
            />
          );
        })}
      </div>
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
      <p className="mt-3 text-lg leading-relaxed text-dark-gray">Two more questions after this, then your results are ready.</p>

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
          <input type="checkbox" checked={consent} onChange={(e) => onConsent(e.target.checked)} className="mt-1 h-4 w-4" />
          I&rsquo;m happy to receive my Seed Assessment results and occasional Seedbearer content by
          email. Unsubscribe any time.
        </label>

        {siteKey ? (
          <Turnstile siteKey={siteKey} onSuccess={onTurnstile} />
        ) : (
          <p className="text-xs text-amber">
            NEXT_PUBLIC_TURNSTILE_SITE_KEY is not set — abuse protection is disabled in this environment.
          </p>
        )}
      </div>
    </div>
  );
}
