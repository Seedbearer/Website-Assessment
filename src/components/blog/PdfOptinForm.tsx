"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Turnstile } from "@marsidev/react-turnstile";

// Reusable lead-magnet email capture — embedded directly in MDX blog post bodies via the
// components map passed to <MDXRemote> (see blog/[slug]/page.tsx). One component, any post:
// just pass the slug/title/pdfPath for that post's PDF.
export default function PdfOptinForm({ slug, title, pdfPath }: { slug: string; title: string; pdfPath: string }) {
  const pathname = usePathname();
  const [email, setEmail] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/optin/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, slug, title, pdfPath, turnstileToken, sourcePath: pathname }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }
      setSent(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <div className="not-prose rounded-lg border border-straw bg-off-white p-6 text-center">
        <p className="font-lora text-lg text-soil">Check your inbox</p>
        <p className="mt-2 text-sm text-dark-gray">
          Your copy of &ldquo;{title}&rdquo; is on its way to {email}.
        </p>
      </div>
    );
  }

  return (
    <div className="not-prose rounded-lg border border-straw bg-off-white p-6">
      <p className="font-lora text-lg text-soil">Get the free PDF</p>
      <p className="mt-2 text-sm text-dark-gray">
        The full version of &ldquo;{title}&rdquo; — laid out step by step, with the exact
        language to use. We&rsquo;ll email it straight to you.
      </p>
      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="flex-1 rounded border border-mid-gray bg-linen px-4 py-2.5 text-sm text-dark-gray"
        />
        <button
          type="submit"
          disabled={submitting || !turnstileToken}
          className="whitespace-nowrap rounded bg-deep-green px-6 py-2.5 text-sm font-medium text-linen transition hover:opacity-90 disabled:opacity-50"
        >
          {submitting ? "Sending…" : "Send me the PDF"}
        </button>
      </form>
      <div className="mt-3">
        <Turnstile siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!} onSuccess={setTurnstileToken} />
      </div>
      {error && <p className="mt-2 text-sm text-red-700">{error}</p>}
      <p className="mt-3 text-xs text-bark">No spam. No sales pitch. Just the PDF.</p>
    </div>
  );
}
