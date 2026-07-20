import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import MemberSignOutButton from "@/components/dashboard/MemberSignOutButton";

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

  return (
    <div className="min-h-screen bg-linen">
      <header className="border-b border-mid-gray bg-off-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-4 md:px-8">
          <nav className="flex items-center gap-5">
            <Link href="/dashboard" className="text-sm text-dark-gray hover:text-soil transition">
              My Results
            </Link>
            <Link href="/dashboard/family" className="text-sm text-dark-gray hover:text-soil transition">
              Family
            </Link>
          </nav>
          <MemberSignOutButton />
        </div>
      </header>
      {children}
    </div>
  );
}
