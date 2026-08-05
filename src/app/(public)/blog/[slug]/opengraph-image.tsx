import { ImageResponse } from "next/og";
import { getPostBySlug } from "@/lib/blog";

// next/og's ImageResponse renders via satori, which needs Node's fs — getPostBySlug reads the
// content/blog directory from disk, so this can't run on the edge runtime.
export const runtime = "nodejs";

export const alt = "Seedbearer Family";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const SOIL = "#5C3D1E";
const STRAW = "#C4A882";
const LINEN = "#F5F0E8";

// Loaded at request time rather than bundled in the repo. Satori (which ImageResponse uses) needs
// an explicit font passed in — without one it falls back to its own bundled default font file,
// which fails to load from a Windows path containing spaces (a local-dev-only quirk; harmless to
// fall back to no custom font if this fetch fails for any reason, including offline dev).
async function loadLoraBold(): Promise<ArrayBuffer | null> {
  try {
    // Chrome 41's UA predates woff2 support, so Google's css2 endpoint replies with plain .woff
    // links (latin subset first) instead of woff2 — satori can parse woff directly.
    const cssRes = await fetch("https://fonts.googleapis.com/css2?family=Lora:wght@700&display=swap", {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36" },
    });
    const css = await cssRes.text();
    // Google lists several unicode-range subsets (cyrillic, vietnamese, etc.) before the plain
    // "latin" one our (English) titles need — it's listed last, so take the last match.
    const matches = Array.from(css.matchAll(/src: url\((https:\/\/fonts\.gstatic\.com\/[^)]+\.woff)\) format\('woff'\)/g));
    const fontUrl = matches.at(-1)?.[1];
    if (!fontUrl) return null;
    const fontRes = await fetch(fontUrl);
    return await fontRes.arrayBuffer();
  } catch {
    return null;
  }
}

export default async function Image({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  const title = post?.title ?? "Seedbearer Family";
  const category = post?.category;
  const loraBold = await loadLoraBold();

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          background: SOIL,
          padding: "72px 88px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <span
            style={{
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: 6,
              color: STRAW,
              textTransform: "uppercase",
            }}
          >
            Seedbearer Family
          </span>
        </div>

        {category && (
          <div style={{ display: "flex", marginTop: 44 }}>
            <span
              style={{
                display: "flex",
                fontSize: 20,
                fontWeight: 700,
                letterSpacing: 3,
                color: SOIL,
                textTransform: "uppercase",
                background: STRAW,
                padding: "10px 24px",
                borderRadius: 999,
              }}
            >
              {category}
            </span>
          </div>
        )}

        <div style={{ display: "flex", flex: 1, alignItems: "center" }}>
          <span
            style={{
              display: "flex",
              fontSize: title.length > 70 ? 50 : 60,
              fontWeight: 700,
              fontFamily: loraBold ? "Lora" : undefined,
              color: LINEN,
              lineHeight: 1.25,
              maxWidth: 1000,
            }}
          >
            {title}
          </span>
        </div>

        <div style={{ display: "flex", width: 120, height: 5, background: STRAW }} />
      </div>
    ),
    {
      ...size,
      fonts: loraBold ? [{ name: "Lora", data: loraBold, weight: 700, style: "normal" }] : undefined,
    }
  );
}
