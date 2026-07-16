import "server-only";
import { createSupabaseServerClient } from "./supabase-server";

// Defense in depth for every /api/admin/* route handler — middleware is the primary gate, but
// each route also checks directly, in case middleware ever fails to run for any reason.
// Returns true if the current request is from the authorized admin, false otherwise.
export async function isAuthorizedAdmin(): Promise<boolean> {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.email === process.env.ADMIN_EMAIL;
}
