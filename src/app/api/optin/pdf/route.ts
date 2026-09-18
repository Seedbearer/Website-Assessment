import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { verifyTurnstile } from "@/lib/turnstile";
import { isRateLimited } from "@/lib/rate-limit";
import { sendPdfOptinEmail } from "@/lib/notify";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many requests. Please try again in a minute." }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim() : "";
  const slug = typeof body.slug === "string" ? body.slug.trim() : "";
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const pdfPath = typeof body.pdfPath === "string" ? body.pdfPath.trim() : "";
  const sourcePath = typeof body.sourcePath === "string" ? body.sourcePath.trim() : "";

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  if (!slug || !title || !pdfPath) {
    return NextResponse.json({ error: "Missing lead-magnet configuration." }, { status: 400 });
  }

  const turnstileOk = await verifyTurnstile(body.turnstileToken, ip);
  if (!turnstileOk) {
    return NextResponse.json({ error: "Verification failed. Please try again." }, { status: 400 });
  }

  let writer;
  try {
    writer = getSupabaseAdmin();
  } catch (err) {
    console.error("optin/pdf: Supabase is not configured", err);
    return NextResponse.json({ error: "Could not save your request. Please try again." }, { status: 500 });
  }

  const { error } = await writer.from("pdf_optins").insert({ email, slug, source_path: sourcePath || null });
  if (error) {
    console.error("optin/pdf: Supabase insert failed", error);
    return NextResponse.json({ error: "Could not save your request. Please try again." }, { status: 500 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  // Awaited, not fire-and-forget — Netlify's serverless functions can freeze/terminate execution
  // immediately after the response is returned (see the same note on the triage/assessment routes).
  await sendPdfOptinEmail({
    email,
    title,
    pdfUrl: `${siteUrl}${pdfPath}`,
    postUrl: `${siteUrl}/blog/${slug}`,
  });

  return NextResponse.json({ ok: true });
}
