import { QUESTIONS } from "./assessment-data";

// Turns a stored answer value/slug (e.g. "solving_problems") back into its display label
// (e.g. "Solving a problem no one else has figured out") for the admin views.
export function formatAnswer(questionId: string, value: string | string[] | null): string {
  if (!value) return "—";

  const question = QUESTIONS.find((q) => q.id === questionId);
  if (!question || question.kind === "open") {
    return Array.isArray(value) ? value.join(", ") : value;
  }

  const lookup = (v: string) => question.options.find((o) => o.value === v)?.label ?? v;
  return Array.isArray(value) ? value.map(lookup).join("; ") : lookup(value);
}
