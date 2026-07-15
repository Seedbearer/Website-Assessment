import "server-only";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Server-only client — service role key bypasses RLS. Never import this from a Client Component.
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  { auth: { persistSession: false } }
);

// Returns a service-role client when SUPABASE_SERVICE_ROLE_KEY is configured, otherwise falls back
// to the anon/publishable key. The anon-key path only works for inserts allowed by RLS (e.g. the
// public assessment submission) — it cannot read data back. Once a service-role key is added, this
// starts using it automatically with no code changes elsewhere.
export function getSubmissionWriter(): SupabaseClient {
  return supabaseAdmin;
}
