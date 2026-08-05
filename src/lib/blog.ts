import "server-only";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export type PostCategory = "Identity" | "Parenting" | "Healing" | "Connection";

export type PostFrontmatter = {
  title: string;
  date: string;
  category: PostCategory;
  youtube_id?: string;
  excerpt?: string;
  seo_title?: string;
  seo_description?: string;
};

export type Post = PostFrontmatter & { slug: string; content: string };

// Content is authored as .mdx files directly in content/blog/ — no CMS in the loop right now
// (TinaCMS is configured in tina/config.ts but not yet wired up, pending a Tina Cloud issue).
// Editing a post means editing/adding a file here; the shape matches what Tina's schema expects,
// so wiring up the visual editor later doesn't require changing this content or its format.
//
// `date` doubles as a publish/embargo date: a post with a future date is written now but stays
// invisible (index, related posts, direct URL — all 404) until that date arrives. This only works
// because the blog routes are rendered dynamically (see `dynamic = "force-dynamic"` on the index
// and [slug] pages) rather than statically at build time — there's no scheduled rebuild anywhere,
// so a build-time-only check would never re-run to reveal a post on its date.
export function getAllPosts(): Post[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"));
  const posts = files
    .map((filename) => {
      const slug = filename.replace(/\.mdx$/, "");
      const raw = fs.readFileSync(path.join(BLOG_DIR, filename), "utf-8");
      const { data, content } = matter(raw);
      return { ...(data as PostFrontmatter), slug, content };
    })
    .filter((post) => new Date(post.date).getTime() <= Date.now());

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): Post | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}

export function getRelatedPosts(post: Post, limit = 3): Post[] {
  return getAllPosts()
    .filter((p) => p.slug !== post.slug && p.category === post.category)
    .slice(0, limit);
}
