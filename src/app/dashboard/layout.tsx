import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";

// Defense in depth, same pattern as the admin dashboard layout: middleware is the primary gate,
// but this checks the session directly too, in case middleware ever fails to run.
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return <div className="min-h-screen bg-linen">{children}</div>;
}
