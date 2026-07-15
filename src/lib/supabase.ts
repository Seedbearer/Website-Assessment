import { createClient } from "@supabase/supabase-js";

// Browser-safe client — anon key only. Per Section 03 of the spec, the anon role can INSERT into
// `submissions` and nothing else; every other read/write goes through supabase-admin.ts server-side.
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
