import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { verifyTurnstile } from "@/lib/turnstile";
import { isRateLimited } from "@/lib/rate-limit";
import { notifyTriageCompleted, sendTriageResourceEmail } from "@/lib/notify";
import { categoryForQ1, isPriority, needsClinicalReferral } from "@/lib/triage-data";

const REQUIRED_FIELDS = ["firstName", "email", "q1Primary", "q2Duration", "q3WhoAffected", "q4StressResponse", "q5BetterLooksLike", "q6Wellbeing"] as const;

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

  // Category and urgency flags are derived server-side from the answers, not trusted from the
  // client — the same principle as the Seed Assessment's scoring engine.
  const category = categoryForQ1(body.q1Primary);
  const priorityFlag = isPriority(body.q6Wellbeing);
  const clinicalReferralFlag = needsClinicalReferral(category, body.q6Wellbeing);

  const submissionId = randomUUID();

  let writer;
  try {
    writer = getSupabaseAdmin();
  } catch (err) {
    console.error("triage/submit: Supabase is not configured", err);
    return NextResponse.json({ error: "Could not save your submission. Please try again." }, { status: 500 });
  }

  const { error } = await writer.from("triage_submissions").insert({
    id: submissionId,
    first_name: body.firstName,
    email: body.email,
    q1_primary: body.q1Primary,
    category,
    q2_duration: body.q2Duration,
    q3_who_affected: body.q3WhoAffected,
    q4_stress_response: body.q4StressResponse,
    q5_better_looks_like: body.q5BetterLooksLike,
    q6_wellbeing: body.q6Wellbeing,
    priority_flag: priorityFlag,
    clinical_referral_flag: clinicalReferralFlag,
    resource_sent: category,
  });

  if (error) {
    console.error("triage/submit: Supabase insert failed", error);
    return NextResponse.json({ error: "Could not save your submission. Please try again." }, { status: 500 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  // Awaited, not fire-and-forget — Netlify's serverless functions can freeze/terminate execution
  // immediately after the response is returned, killing any in-flight work that wasn't explicitly
  // waited for (see the same note on the Seed Assessment's submit route). Both catch their own
  // errors internally and never throw, so a failed send still never breaks the person's own result.
  await Promise.all([
    notifyTriageCompleted({ submissionId, firstName: body.firstName, category, priorityFlag, clinicalReferralFlag, siteUrl }),
    sendTriageResourceEmail({ firstName: body.firstName, email: body.email, category, siteUrl }),
  ]);

  return NextResponse.json({ category });
}
