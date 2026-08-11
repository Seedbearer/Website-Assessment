import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { isAuthorizedAdmin } from "@/lib/require-admin";

const ALLOWED_FIELDS = ["responded", "response_date"] as const;

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
  const { error } = await supabase.from("triage_submissions").update(update).eq("id", params.id);

  if (error) {
    console.error("admin/triage PATCH failed", error);
    return NextResponse.json({ error: "Update failed." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await isAuthorizedAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("triage_submissions").delete().eq("id", params.id);

  if (error) {
    console.error("admin/triage DELETE failed", error);
    return NextResponse.json({ error: "Delete failed." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
