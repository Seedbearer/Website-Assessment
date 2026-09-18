import { renderOgImage, size, contentType } from "@/lib/og-image";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const alt = "Seedbearer Family";
export { size, contentType };

export default async function Image() {
  return renderOgImage("Work With Me", "12-Week Coaching Program");
}
