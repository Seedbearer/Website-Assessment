import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

// Public endpoint — used by the join page to validate a code and show the family name/member
// count before someone starts their assessment. Deliberately returns only public-safe fields.
export async function GET(_req: NextRequest, { params }: { params: { code: string } }) {
  const supabase = getSupabaseAdmin();
  const code = params.code.toUpperCase();

  const { data: family, error } = await supabase
    .from("families")
    .select("family_code, family_name")
    .eq("family_code", code)
    .maybeSingle();

  if (error || !family) {
    return NextResponse.json({ error: "That family code wasn't found. Double check it and try again." }, { status: 404 });
  }

  const { count } = await supabase
    .from("family_members")
    .select("id", { count: "exact", head: true })
    .eq("family_code", code);

  return NextResponse.json({
    familyCode: family.family_code,
    familyName: family.family_name,
    memberCount: count ?? 0,
  });
}
