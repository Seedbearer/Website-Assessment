import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { calculateSeedType } from "@/lib/scoring";
import { INSTINCT_OPTIONS } from "@/lib/story-assessment-data";
import { verifyTurnstile } from "@/lib/turnstile";
import { isRateLimited } from "@/lib/rate-limit";
import { notifyAssessmentCompleted } from "@/lib/notify";

const REQUIRED_FIELDS = [
  "firstName",
  "email",
  "wound",
  "woundCost",
  "standVirtue",
  "reachVirtue",
  "instinctType",
  "gardenVirtue",
  "walkVirtue",
  "closingText",
  "q7Relational",
  "q8RelationalNeed",
  "q9Internal",
  "q10Longing",
  "q11Season",
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
    wound: body.wound,
    otherWords: body.otherWords ?? "",
    woundCost: body.woundCost,
    instinctType: body.instinctType,
    closingText: body.closingText,
    q9Internal: body.q9Internal,
  });

  const instinctText = INSTINCT_OPTIONS.find((o) => o.type === body.instinctType)?.text ?? null;
  const priorityResponse = scoring.priorityResponse || scoring.urgentText;

  // Client-generated id: with only the anon/publishable key configured (no service-role key yet),
  // the "anon can insert submissions" RLS policy allows the insert but not a SELECT-back of the row,
  // so we can't rely on Postgres to hand back the generated id. Generating it here avoids that need.
  const submissionId = randomUUID();

  let writer;
  try {
    writer = getSupabaseAdmin();
  } catch (err) {
    console.error("assessment/submit: Supabase is not configured", err);
    return NextResponse.json({ error: "Could not save your submission. Please try again." }, { status: 500 });
  }

  const familyCode: string | undefined = body.familyCode?.trim()?.toUpperCase() || undefined;
  const memberName: string | undefined = body.memberName?.trim() || undefined;
  const memberRole: string | undefined = body.memberRole || undefined;

  const { error } = await writer.from("submissions").insert({
    id: submissionId,
    first_name: body.firstName,
    email: body.email,
    family_code: familyCode ?? null,
    wound: body.wound,
    other_words: body.otherWords ?? null,
    wound_cost: body.woundCost,
    stand_virtue: body.standVirtue,
    reach_virtue: body.reachVirtue,
    instinct_type: body.instinctType,
    instinct_text: instinctText,
    garden_virtue: body.gardenVirtue,
    walk_virtue: body.walkVirtue,
    closing_text: body.closingText,
    q7_relational: body.q7Relational,
    q8_relational_need: body.q8RelationalNeed,
    q9_internal: body.q9Internal,
    q10_longing: body.q10Longing,
    q11_season: body.q11Season,
    seed_type_algorithm: scoring.seedType,
    flag_for_review: scoring.flagForReview || scoring.urgentText,
    priority_response: priorityResponse,
  });

  if (error) {
    console.error("assessment/submit: Supabase insert failed", error);
    return NextResponse.json({ error: "Could not save your submission. Please try again." }, { status: 500 });
  }

  if (familyCode) {
    const { error: memberError } = await writer.from("family_members").insert({
      family_code: familyCode,
      submission_id: submissionId,
      member_name: memberName ?? body.firstName,
      member_role: memberRole ?? null,
    });
    if (memberError) {
      // Don't fail the whole submission over this — the person's results still matter even if
      // the family link didn't save; log it so it can be manually reconciled.
      console.error("assessment/submit: family_members insert failed", memberError);
    }
  }

  // Awaited (not truly fire-and-forget) — Netlify's serverless functions can freeze/terminate
  // execution immediately after the response is returned, killing any in-flight work that wasn't
  // explicitly waited for. A failed *send* still never blocks or breaks the person's own results,
  // since notifyAssessmentCompleted catches its own errors internally and never throws here.
  await notifyAssessmentCompleted({
    submissionId,
    firstName: body.firstName,
    seedType: scoring.seedType,
    priorityResponse: scoring.priorityResponse,
    urgentText: scoring.urgentText,
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  });

  return NextResponse.json({ seedType: scoring.seedType, submissionId });
}
