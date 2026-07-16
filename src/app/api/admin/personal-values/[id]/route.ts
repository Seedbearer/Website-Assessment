import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

type ValueSlot = { value_order: number; value_name: string; value_definition: string };

// Upserts all five value slots for a submission in one call — simpler than five separate PATCHes
// for a form that's always edited and saved as a whole unit.
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json().catch(() => null);
  const values: ValueSlot[] = body?.values;
  if (!Array.isArray(values) || values.length === 0) {
    return NextResponse.json({ error: "Invalid values payload." }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  const { data: submission, error: fetchError } = await supabase
    .from("submissions")
    .select("family_code")
    .eq("id", params.id)
    .single();

  if (fetchError || !submission) {
    return NextResponse.json({ error: "Submission not found." }, { status: 404 });
  }

  const rows = values.map((v) => ({
    submission_id: params.id,
    family_code: submission.family_code,
    value_order: v.value_order,
    value_name: v.value_name,
    value_definition: v.value_definition,
    updated_at: new Date().toISOString(),
  }));

  const { error } = await supabase
    .from("personal_values")
    .upsert(rows, { onConflict: "submission_id,value_order" });

  if (error) {
    console.error("admin/personal-values PUT failed", error);
    return NextResponse.json({ error: "Save failed." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
