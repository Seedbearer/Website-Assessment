import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Session-aware Supabase client for Server Components and Route Handlers — reads the auth
// session from cookies (set during the magic-link callback). Uses the anon/publishable key;
// RLS still applies, this only carries the logged-in user's identity, not elevated privileges.
export function createSupabaseServerClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {
            // Called from a Server Component that can't set cookies — safe to ignore since
            // middleware refreshes the session on every request anyway.
          }
        },
      },
    }
  );
}
