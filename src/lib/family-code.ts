import "server-only";
import { getSupabaseAdmin } from "./supabase-admin";

// Uppercase, no ambiguous characters (0/O, 1/I/L) — per spec: 4 letters + 2 digits, e.g. SEED42.
const LETTERS = "ABCDEFGHJKMNPQRSTUVWXYZ";
const DIGITS = "23456789";

function randomFrom(chars: string, count: number): string {
  let out = "";
  for (let i = 0; i < count; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

function generateCandidate(): string {
  return randomFrom(LETTERS, 4) + randomFrom(DIGITS, 2);
}

// Generates a unique 6-character family code, checking against the families table.
export async function generateUniqueFamilyCode(): Promise<string> {
  const supabase = getSupabaseAdmin();

  for (let attempt = 0; attempt < 10; attempt++) {
    const candidate = generateCandidate();
    const { data } = await supabase.from("families").select("family_code").eq("family_code", candidate).maybeSingle();
    if (!data) return candidate;
  }

  throw new Error("Could not generate a unique family code after 10 attempts.");
}
