import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { isAuthorizedAdmin } from "@/lib/require-admin";

// Editable fields on the submission detail view: coach's seed-type read, pipeline stage, and
// response tracking. Auth is enforced by middleware (matcher covers /api/admin/:path*) and,
// as a defense-in-depth backstop, checked again directly below.
const ALLOWED_FIELDS = ["seed_type_coach", "pipeline_stage", "responded", "response_date", "coach_notes"] as const;

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await isAuthorizedAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const update: Record<string, unknown> = {};
  for (const field of ALLOWED_FIELDS) {
    if (field in body) update[field] = body[field];
  }
  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "No valid fields to update." }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("submissions").update(update).eq("id", params.id);

  if (error) {
    console.error("admin/submissions PATCH failed", error);
    return NextResponse.json({ error: "Update failed." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
