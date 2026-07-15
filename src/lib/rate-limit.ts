// Minimal in-memory rate limiter. Good enough to blunt scripted repeat submissions from a single
// source; it resets whenever the server process restarts and isn't shared across instances. If the
// site outgrows that, swap this for a shared store (e.g. Upstash Redis) without changing the call site.

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 5;

const hits = new Map<string, number[]>();

export function isRateLimited(key: string): boolean {
  const now = Date.now();
  const timestamps = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  timestamps.push(now);
  hits.set(key, timestamps);
  return timestamps.length > MAX_REQUESTS;
}
