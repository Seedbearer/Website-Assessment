import "server-only";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

let cached: SupabaseClient | null = null;

// Lazily constructed — Next.js executes route modules during the build's "collect page data" step,
// before Netlify's runtime environment variables are necessarily available. Creating the client only
// on first request (not at module scope) means a missing env var fails a request, not the build.
//
// Returns a service-role client when SUPABASE_SERVICE_ROLE_KEY is configured, otherwise falls back to
// the anon/publishable key. The anon-key path only works for inserts allowed by RLS (e.g. the public
// assessment submission) — it cannot read data back. Once a service-role key is added, this starts
// using it automatically with no code changes elsewhere.
export function getSubmissionWriter(): SupabaseClient {
  if (cached) return cached;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error(
      "Supabase is not configured: set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY (and optionally SUPABASE_SERVICE_ROLE_KEY)."
    );
  }

  cached = createClient(url, key, { auth: { persistSession: false } });
  return cached;
}
