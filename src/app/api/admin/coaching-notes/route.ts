import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const { submissionId, familyCode, noteType, content } = body ?? {};

  // Either an individual note (tied to a submission) or a family-level note (tied only to a
  // family code, submission_id left null) — at least one anchor is required.
  if ((!submissionId && !familyCode) || !noteType || !content?.trim()) {
    return NextResponse.json({ error: "noteType and content are required, plus a submissionId or familyCode." }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("coaching_notes")
    .insert({
      submission_id: submissionId ?? null,
      family_code: familyCode ?? null,
      note_type: noteType,
      content,
    })
    .select("id, note_type, content, created_at")
    .single();

  if (error) {
    console.error("admin/coaching-notes POST failed", error);
    return NextResponse.json({ error: "Could not save note." }, { status: 500 });
  }

  return NextResponse.json({ note: data });
}
