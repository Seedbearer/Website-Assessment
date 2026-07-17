import { defineConfig } from "tinacms";

const branch = process.env.TINA_BRANCH || process.env.VERCEL_GIT_COMMIT_REF || process.env.HEAD || "main";

export default defineConfig({
  branch,
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID || null,
  token: process.env.TINA_TOKEN || null,

  build: {
    // Deliberately NOT the Tina default ("admin", served at /admin) — that collides with the
    // coach dashboard's own /admin/* routes (Phase 3). Serves the Tina editor at /tina-admin
    // instead of the spec's originally-assumed /admin/tina.
    outputFolder: "tina-admin",
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "uploads",
      publicFolder: "public",
    },
  },

  schema: {
    collections: [
      {
        name: "post",
        label: "Blog Posts",
        path: "content/blog",
        format: "mdx",
        fields: [
          { type: "string", name: "title", label: "Title", isTitle: true, required: true },
          { type: "datetime", name: "date", label: "Date", required: true },
          {
            type: "string",
            name: "category",
            label: "Category",
            options: ["Identity", "Parenting", "Healing", "Connection"],
            required: true,
          },
          { type: "string", name: "youtube_id", label: "YouTube video ID" },
          { type: "string", name: "excerpt", label: "Excerpt (150 chars, for index + SEO)", ui: { component: "textarea" } },
          { type: "string", name: "seo_title", label: "SEO title (optional, defaults to Title)" },
          { type: "string", name: "seo_description", label: "SEO description (optional, defaults to Excerpt)" },
          { type: "rich-text", name: "body", label: "Body", isBody: true },
        ],
      },
    ],
  },
});
