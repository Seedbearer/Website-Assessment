import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import SignOutButton from "@/components/admin/SignOutButton";

const ADMIN_NAV = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/submissions", label: "Submissions" },
  { href: "/admin/families", label: "Families" },
];

// Defense in depth: middleware is the primary gate for /admin routes, but every page under
// this layout also checks the session directly here. Belt-and-suspenders — if middleware
// ever fails to run for any reason (a platform-specific quirk, a config change, a new route
// added without updating the matcher), this still refuses to render admin data.
export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user?.email !== process.env.ADMIN_EMAIL) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-linen">
      <header className="bg-soil text-linen">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 md:px-8">
          <span className="font-lora text-lg">Seedbearer Admin</span>
          <nav className="flex items-center gap-6">
            {ADMIN_NAV.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm hover:text-straw transition">
                {link.label}
              </Link>
            ))}
            <SignOutButton />
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 md:px-8">{children}</main>
    </div>
  );
}
