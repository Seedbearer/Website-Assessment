import { getPostBySlug } from "@/lib/blog";
import { renderOgImage, size, contentType } from "@/lib/og-image";

// next/og's ImageResponse renders via satori, which needs Node's fs — getPostBySlug reads the
// content/blog directory from disk, so this can't run on the edge runtime.
export const runtime = "nodejs";

export const alt = "Seedbearer Family";
export { size, contentType };

export default async function Image({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  const title = post?.title ?? "Seedbearer Family";
  return renderOgImage(title, post?.category);
}
