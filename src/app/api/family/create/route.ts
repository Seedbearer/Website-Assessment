import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { generateUniqueFamilyCode } from "@/lib/family-code";
import { isRateLimited } from "@/lib/rate-limit";

// Public endpoint — anyone starting a family assessment can create a family code. Uses the
// service-role key server-side rather than an anon RLS insert policy, consistent with how the
// rest of the public-facing write paths in this app are handled.
export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many requests. Please try again in a minute." }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const familyName: string | undefined = body?.familyName?.trim() || undefined;
  const createdByEmail: string | undefined = body?.createdByEmail?.trim() || undefined;

  let supabase;
  let familyCode: string;
  try {
    supabase = getSupabaseAdmin();
    familyCode = await generateUniqueFamilyCode();
  } catch (err) {
    console.error("family/create failed", err);
    return NextResponse.json({ error: "Could not create a family code. Please try again." }, { status: 500 });
  }

  const { error } = await supabase.from("families").insert({
    family_code: familyCode,
    family_name: familyName ?? null,
    created_by_email: createdByEmail ?? null,
  });

  if (error) {
    console.error("family/create insert failed", error);
    return NextResponse.json({ error: "Could not create a family code. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ familyCode });
}
