import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const { submissionId, algorithmType, coachType, overridden, overrideSignal, woundPattern, soilPattern, insight } = body ?? {};

  if (!submissionId || !insight?.trim()) {
    return NextResponse.json({ error: "submissionId and insight are required." }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("knowledge_base").insert({
    submission_id: submissionId,
    algorithm_type: algorithmType ?? null,
    coach_type: coachType ?? null,
    overridden: Boolean(overridden),
    override_signal: overrideSignal ?? null,
    wound_pattern: woundPattern ?? null,
    soil_pattern: soilPattern ?? null,
    insight,
  });

  if (error) {
    console.error("admin/knowledge-base POST failed", error);
    return NextResponse.json({ error: "Could not save entry." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
