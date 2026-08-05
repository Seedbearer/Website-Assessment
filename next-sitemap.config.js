/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://seedbearerfamily.com",
  generateRobotsTxt: true,
  exclude: ["/admin", "/admin/*", "/dashboard", "/dashboard/*", "/login", "/tina-admin", "/tina-admin/*"],
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
