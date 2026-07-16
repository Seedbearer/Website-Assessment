import "server-only";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

let cached: SupabaseClient | null = null;

// Lazily constructed — Next.js executes route modules during the build's "collect page data" step,
// before Netlify's runtime environment variables are necessarily available. Creating the client only
// on first request (not at module scope) means a missing env var fails a request, not the build.
//
// Service-role client, bypasses RLS. Used by the admin dashboard (reads/writes everything) and by
// the public assessment submit route (falls back to the anon/publishable key if no service-role key
// is configured yet, which only supports the anon-insert-only path — not reads).
export function getSupabaseAdmin(): SupabaseClient {
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
