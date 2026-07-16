import { createBrowserClient } from "@supabase/ssr";

// Browser-side client for Client Components — used to request magic links and read the
// client-side session. Anon/publishable key only; RLS applies same as any other browser call.
export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
