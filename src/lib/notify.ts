import "server-only";
import { Resend } from "resend";
import { MATCHED_RESPONSES, type TriageCategory } from "./triage-data";

// Internal completion-notification email — fires to NOTIFICATION_EMAIL, never to the person taking
// the assessment. Fire-and-forget by design: a failure here must never block the person's results page.
export async function notifyAssessmentCompleted(params: {
  submissionId: string;
  firstName: string;
  seedType: string;
  priorityResponse: boolean;
  urgentText: boolean;
  siteUrl: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFICATION_EMAIL;
  if (!apiKey || !to) {
    console.warn("notifyAssessmentCompleted: RESEND_API_KEY or NOTIFICATION_EMAIL not set — skipping");
    return;
  }

  const resend = new Resend(apiKey);
  const urgentPrefix = params.urgentText ? "[URGENT] " : "";
  const flags = [
    params.priorityResponse ? "priority response (internal soil: numb/heavy)" : null,
    params.urgentText ? "urgent-keyword match in written answers" : null,
  ].filter(Boolean);

  try {
    const { error } = await resend.emails.send({
      from: "Seedbearer Assessments <assessments@seedbearerfamily.com>",
      to,
      subject: `${urgentPrefix}New assessment completed — ${params.firstName}`,
      text: [
        `${params.firstName} just completed the Seed Assessment.`,
        `Seed type (algorithm): ${params.seedType}`,
        flags.length ? `Flags: ${flags.join(", ")}` : null,
        `View submission: ${params.siteUrl}/admin/submissions/${params.submissionId}`,
      ]
        .filter(Boolean)
        .join("\n"),
    });
    // The Resend SDK returns { data, error } rather than throwing on API-level failures
    // (e.g. an unverified sending domain) — that error must be checked explicitly, or a
    // failure like "domain not verified" would be silently swallowed and look like success.
    if (error) {
      console.error("notifyAssessmentCompleted: Resend API returned an error", error);
    }
  } catch (err) {
    console.error("notifyAssessmentCompleted: failed to send", err);
  }
}

// Internal completion-notification email for the Family Triage Assessment ("Door 1") — mirrors
// notifyAssessmentCompleted above. Fires to NOTIFICATION_EMAIL, never to the family.
export async function notifyTriageCompleted(params: {
  submissionId: string;
  firstName: string;
  category: TriageCategory;
  priorityFlag: boolean;
  clinicalReferralFlag: boolean;
  siteUrl: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFICATION_EMAIL;
  if (!apiKey || !to) {
    console.warn("notifyTriageCompleted: RESEND_API_KEY or NOTIFICATION_EMAIL not set — skipping");
    return;
  }

  const resend = new Resend(apiKey);
  const prefix = params.priorityFlag ? "[PRIORITY] " : "";
  const flags = [
    params.priorityFlag ? "priority — respond within 24 hours, lead with the parent's own need" : null,
    params.clinicalReferralFlag ? "clinical referral signposting included in their response" : null,
  ].filter(Boolean);

  try {
    const { error } = await resend.emails.send({
      from: "Seedbearer Assessments <assessments@seedbearerfamily.com>",
      to,
      subject: `${prefix}New triage submission — ${params.firstName} (${params.category})`,
      text: [
        `${params.firstName} just completed the Family Triage Assessment.`,
        `Category: ${params.category}`,
        flags.length ? `Flags: ${flags.join("; ")}` : null,
        `Submission id: ${params.submissionId}`,
      ]
        .filter(Boolean)
        .join("\n"),
    });
    if (error) {
      console.error("notifyTriageCompleted: Resend API returned an error", error);
    }
  } catch (err) {
    console.error("notifyTriageCompleted: failed to send", err);
  }
}

// The family-facing email — "we'll send your results and a matched resource directly to your
// inbox." Sent to the person who filled out the triage form, not the coach. A failure here must
// not fail the submission (the on-screen thank-you page already gave them the Conversation Framework
// link directly), but it should still be awaited — see the Netlify fire-and-forget gotcha on
// notifyAssessmentCompleted above; the same platform behavior applies here.
export async function sendTriageResourceEmail(params: { firstName: string; email: string; category: TriageCategory; siteUrl: string }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("sendTriageResourceEmail: RESEND_API_KEY not set — skipping");
    return;
  }

  const response = MATCHED_RESPONSES[params.category];
  const resend = new Resend(apiKey);

  const stepLines = response.nextSteps.map((step) => {
    const url = step.url ? `${params.siteUrl}${step.url}` : null;
    return [`- ${step.label}${url ? `: ${url}` : ""}`, step.description ? `  ${step.description}` : null].filter(Boolean).join("\n");
  });

  const text = [
    `Hi ${params.firstName},`,
    "",
    "Thank you for being honest about where your family is right now. That takes courage.",
    "",
    response.whatToKnow,
    "",
    "Your immediate next step:",
    ...stepLines,
    "",
    "Take this further:",
    response.takeThisFurther,
    response.safetyNote ? `\n${response.safetyNote}` : null,
    "",
    "We read every submission personally. If anything in what you shared feels urgent, just reply to this email — we read those too.",
  ]
    .filter((line) => line !== null)
    .join("\n");

  try {
    const { error } = await resend.emails.send({
      from: "Seedbearer Family <hello@seedbearerfamily.com>",
      to: params.email,
      subject: `Your family, right now — ${response.presentingLine.replace(/[“”]/g, "")}`,
      text,
    });
    if (error) {
      console.error("sendTriageResourceEmail: Resend API returned an error", error);
    }
  } catch (err) {
    console.error("sendTriageResourceEmail: failed to send", err);
  }
}
