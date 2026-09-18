import { ImageResponse } from "next/og";

// Shared with the blog's per-post opengraph-image.tsx (src/app/(public)/blog/[slug]/opengraph-image.tsx)
// — kept in one place so every route's social-share card stays visually consistent without
// duplicating the satori/font-loading setup per page.
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const SOIL = "#5C3D1E";
const STRAW = "#C4A882";
const LINEN = "#F5F0E8";

// Satori (which ImageResponse uses) needs an explicit font passed in — without one it falls back
// to its own bundled default, which fails to load from a Windows path containing spaces (a
// local-dev-only quirk; harmless to fall back to no custom font if this fetch fails for any
// reason, including offline dev).
async function loadLoraBold(): Promise<ArrayBuffer | null> {
  try {
    const cssRes = await fetch("https://fonts.googleapis.com/css2?family=Lora:wght@700&display=swap", {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36" },
    });
    const css = await cssRes.text();
    const matches = Array.from(css.matchAll(/src: url\((https:\/\/fonts\.gstatic\.com\/[^)]+\.woff)\) format\('woff'\)/g));
    const fontUrl = matches.at(-1)?.[1];
    if (!fontUrl) return null;
    const fontRes = await fetch(fontUrl);
    return await fontRes.arrayBuffer();
  } catch {
    return null;
  }
}

export async function renderOgImage(title: string, eyebrow?: string) {
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

        {eyebrow && (
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
              {eyebrow}
            </span>
          </div>
        )}

        <div style={{ display: "flex", flex: 1, alignItems: "center" }}>
          <span
            style={{
              display: "flex",
              fontSize: title.length > 40 ? 54 : 66,
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
      fonts: loraBold ? [{ name: "Lora", data: loraBold, weight: 700, style: "normal" as const }] : undefined,
    }
  );
}
