import { NextRequest, NextResponse } from "next/server";
import { verifyTurnstile } from "@/lib/turnstile";
import { isRateLimited } from "@/lib/rate-limit";
import { sendPdfOptinEmail, recordPdfOptinLead } from "@/lib/notify";

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

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  // Both awaited, not fire-and-forget — Netlify's serverless functions can freeze/terminate
  // execution immediately after the response is returned (see the same note on the
  // triage/assessment routes). recordPdfOptinLead never throws (see notify.ts), so a Resend
  // Contacts failure can't block the person from getting their email.
  await Promise.all([
    recordPdfOptinLead({ email, slug, title, sourcePath: sourcePath || null }),
    sendPdfOptinEmail({
      email,
      title,
      pdfUrl: `${siteUrl}${pdfPath}`,
      postUrl: `${siteUrl}/blog/${slug}`,
    }),
  ]);

  return NextResponse.json({ ok: true });
}
