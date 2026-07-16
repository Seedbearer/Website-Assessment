import "server-only";
import { Resend } from "resend";

// Internal completion-notification email — fires to NOTIFICATION_EMAIL, never to the person taking
// the assessment. Fire-and-forget by design: a failure here must never block the person's results page.
export async function notifyAssessmentCompleted(params: {
  submissionId: string;
  firstName: string;
  seedType: string;
  priorityResponse: boolean;
  urgentQ12: boolean;
  siteUrl: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFICATION_EMAIL;
  if (!apiKey || !to) {
    console.warn("notifyAssessmentCompleted: RESEND_API_KEY or NOTIFICATION_EMAIL not set — skipping");
    return;
  }

  const resend = new Resend(apiKey);
  const urgentPrefix = params.urgentQ12 ? "[URGENT] " : "";
  const flags = [
    params.priorityResponse ? "priority response (Q9 numb/heavy)" : null,
    params.urgentQ12 ? "Q12 urgent-keyword match" : null,
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
