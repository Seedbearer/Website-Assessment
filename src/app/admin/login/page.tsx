"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError("");

    const supabase = createSupabaseBrowserClient();
    const { error: signInError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/admin/dashboard`,
      },
    });

    if (signInError) {
      setError(signInError.message);
      setStatus("error");
      return;
    }
    setStatus("sent");
  }

  return (
    <section className="flex min-h-[70vh] items-center justify-center bg-linen px-4">
      <div className="w-full max-w-sm rounded-lg border border-mid-gray bg-off-white p-8">
        <h1 className="font-lora text-2xl text-soil">Admin Login</h1>
        <p className="mt-2 text-sm text-dark-gray">
          Enter your admin email and we&rsquo;ll send you a sign-in link.
        </p>

        {status === "sent" ? (
          <p className="mt-6 rounded-lg border border-mid-gray bg-linen p-4 text-sm text-dark-gray">
            Check <strong>{email}</strong> for a sign-in link.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@seedbearerfamily.com"
              className="w-full rounded-lg border border-mid-gray bg-linen p-3 text-dark-gray focus:border-deep-green focus:outline-none"
            />
            {error && <p className="text-sm text-amber">{error}</p>}
            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full rounded bg-deep-green px-6 py-3 font-medium text-linen transition hover:opacity-90 disabled:opacity-50"
            >
              {status === "sending" ? "Sending…" : "Send sign-in link"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
