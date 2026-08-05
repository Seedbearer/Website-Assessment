import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getPostBySlug, getRelatedPosts } from "@/lib/blog";
import Button from "@/components/ui/Button";

// Rendered per-request rather than statically generated at build time — required for the
// date-based publish gating in lib/blog.ts to actually take effect on the day a post's date
// arrives, since nothing here triggers a rebuild on a schedule.
export const dynamic = "force-dynamic";

const SITE_URL = "https://seedbearerfamily.com";

export function generateMetadata({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  if (!post) return {};

  const title = post.seo_title || post.title;
  const description = post.seo_description || post.excerpt;
  const url = `${SITE_URL}/blog/${post.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title,
      description,
      url,
      publishedTime: post.date,
      section: post.category,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  const related = getRelatedPosts(post);
  const url = `${SITE_URL}/blog/${post.slug}`;

  // Article schema per post — lets search engines and AI answer/agent crawlers (Google AI
  // Overviews, ChatGPT/Perplexity/Claude search) parse author, date, and topic without having
  // to infer them from prose, and makes the post eligible for rich results.
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.seo_description || post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    articleSection: post.category,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    author: { "@type": "Organization", name: "Seedbearer Family", url: SITE_URL },
    publisher: { "@type": "Organization", name: "Seedbearer Family", url: SITE_URL, logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.svg` } },
  };

  return (
    <article className="bg-linen px-4 py-16 md:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <div className="mx-auto max-w-3xl">
        {post.youtube_id && (
          <div className="aspect-video overflow-hidden rounded-lg">
            <iframe
              className="h-full w-full"
              src={`https://www.youtube.com/embed/${post.youtube_id}`}
              title={post.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}

        <p className="mt-8 text-xs uppercase tracking-wide text-bark">{post.category}</p>
        <h1 className="mt-2 font-lora text-3xl text-soil md:text-4xl">{post.title}</h1>
        <p className="mt-2 text-sm text-bark">{new Date(post.date).toLocaleDateString()}</p>

        <div className="prose prose-lg mt-8 max-w-none text-dark-gray prose-headings:font-lora prose-headings:text-soil prose-a:text-deep-green">
          <MDXRemote source={post.content} />
        </div>

        <div className="mt-12 rounded-lg bg-soil p-6 text-center text-linen">
          <p className="text-lg">Curious what your own seed type is?</p>
          <div className="mt-4">
            <Button href="/assessment" variant="inverted">
              Take the Free Seed Assessment
            </Button>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="font-lora text-xl text-soil">More on {post.category}</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/blog/${r.slug}`}
                  className="block rounded-lg border border-mid-gray bg-off-white p-4 hover:border-bark"
                >
                  <p className="font-medium text-soil">{r.title}</p>
                  <p className="mt-1 text-xs text-bark">{new Date(r.date).toLocaleDateString()}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
