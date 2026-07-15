import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { getSubmissionWriter } from "@/lib/supabase-admin";
import { calculateSeedType } from "@/lib/scoring";
import { verifyTurnstile } from "@/lib/turnstile";
import { isRateLimited } from "@/lib/rate-limit";
import { notifyAssessmentCompleted } from "@/lib/notify";

const REQUIRED_FIELDS = [
  "firstName",
  "email",
  "q1Open",
  "q2Answer",
  "q3Answers",
  "q4Answer",
  "q5Answer",
  "q6Open",
  "q7Relational",
  "q8RelationalNeed",
  "q9Internal",
  "q10Longing",
  "q11Season",
  "q12Open",
] as const;

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many submissions. Please try again in a minute." }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const turnstileOk = await verifyTurnstile(body.turnstileToken, ip);
  if (!turnstileOk) {
    return NextResponse.json({ error: "Verification failed. Please try again." }, { status: 400 });
  }

  for (const field of REQUIRED_FIELDS) {
    const value = body[field];
    const missing =
      value === undefined ||
      value === null ||
      (typeof value === "string" && value.trim().length === 0) ||
      (Array.isArray(value) && value.length === 0);
    if (missing) {
      return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
    }
  }

  const scoring = calculateSeedType({
    q1Open: body.q1Open,
    q2Answer: body.q2Answer,
    q3Answers: body.q3Answers,
    q4Answer: body.q4Answer,
    q5Answer: body.q5Answer,
    q6Open: body.q6Open,
    q7Relational: body.q7Relational,
    q8RelationalNeed: body.q8RelationalNeed,
    q9Internal: body.q9Internal,
    q10Longing: body.q10Longing,
    q11Season: body.q11Season,
    q12Open: body.q12Open,
  });

  const priorityResponse = scoring.priorityResponse || scoring.urgentQ12;

  // Client-generated id: with only the anon/publishable key configured (no service-role key yet),
  // the "anon can insert submissions" RLS policy allows the insert but not a SELECT-back of the row,
  // so we can't rely on Postgres to hand back the generated id. Generating it here avoids that need.
  const submissionId = randomUUID();

  let writer;
  try {
    writer = getSubmissionWriter();
  } catch (err) {
    console.error("assessment/submit: Supabase is not configured", err);
    return NextResponse.json({ error: "Could not save your submission. Please try again." }, { status: 500 });
  }

  const { error } = await writer.from("submissions").insert({
    id: submissionId,
    first_name: body.firstName,
    email: body.email,
    q1_open: body.q1Open,
    q2_answer: body.q2Answer,
    q3_answers: body.q3Answers,
    q4_answer: body.q4Answer,
    q5_answer: body.q5Answer,
    q6_open: body.q6Open,
    q7_relational: body.q7Relational,
    q8_relational_need: body.q8RelationalNeed,
    q9_internal: body.q9Internal,
    q10_longing: body.q10Longing,
    q11_season: body.q11Season,
    q12_open: body.q12Open,
    seed_type_algorithm: scoring.seedType,
    flag_for_review: scoring.flagForReview || scoring.urgentQ12,
    priority_response: priorityResponse,
  });

  if (error) {
    console.error("assessment/submit: Supabase insert failed", error);
    return NextResponse.json({ error: "Could not save your submission. Please try again." }, { status: 500 });
  }

  // Fire-and-forget — a failed notification must never block the person's own results.
  notifyAssessmentCompleted({
    submissionId,
    firstName: body.firstName,
    seedType: scoring.seedType,
    priorityResponse: scoring.priorityResponse,
    urgentQ12: scoring.urgentQ12,
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  }).catch((err) => console.error("assessment/submit: notification failed", err));

  return NextResponse.json({ seedType: scoring.seedType, submissionId });
}
