const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

// /blog and /blog/[slug] are rendered with `dynamic = "force-dynamic"` (see lib/blog.ts) so they
// have no static output for next-sitemap's postbuild crawl to discover — without this, published
// blog posts are simply absent from sitemap.xml despite being live, indexable pages. This mirrors
// the same date-gating getAllPosts() uses, so an unpublished (future-dated) post never appears.
function getPublishedBlogSlugs() {
  const blogDir = path.join(__dirname, "content", "blog");
  if (!fs.existsSync(blogDir)) return [];
  return fs
    .readdirSync(blogDir)
    .filter((f) => f.endsWith(".mdx"))
    .map((filename) => {
      const raw = fs.readFileSync(path.join(blogDir, filename), "utf-8");
      const { data } = matter(raw);
      return { slug: filename.replace(/\.mdx$/, ""), date: data.date };
    })
    .filter((post) => new Date(post.date).getTime() <= Date.now())
    .map((post) => post.slug);
}

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://seedbearerfamily.com",
  generateRobotsTxt: true,
  exclude: ["/admin", "/admin/*", "/dashboard", "/dashboard/*", "/login", "/tina-admin", "/tina-admin/*"],
  additionalPaths: async (config) => {
    const paths = ["/blog", ...getPublishedBlogSlugs().map((slug) => `/blog/${slug}`)];
    return Promise.all(paths.map((p) => config.transform(config, p)));
  },
  robotsTxtOptions: {
    policies: [
      // Everything not explicitly listed below still falls under this default-allow, private
      // routes are kept out of the sitemap and disallowed here since they sit behind auth anyway.
      { userAgent: "*", allow: "/", disallow: ["/admin", "/admin/*", "/dashboard", "/dashboard/*", "/login", "/api/*", "/tina-admin", "/tina-admin/*"] },
      // Explicit allow for known AI answer-engine / agent crawlers — this site wants to be read,
      // quoted, and cited by AI search and assistants, not just classic search engines.
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "ChatGPT-User", allow: "/" },
      { userAgent: "OAI-SearchBot", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "anthropic-ai", allow: "/" },
      { userAgent: "Claude-User", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "Perplexity-User", allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },
      { userAgent: "CCBot", allow: "/" },
    ],
    additionalSitemaps: [],
  },
};
