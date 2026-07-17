import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPosts, getPostBySlug, getRelatedPosts } from "@/lib/blog";
import Button from "@/components/ui/Button";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  if (!post) return {};
  return {
    title: `${post.seo_title || post.title} — Seedbearer Family`,
    description: post.seo_description || post.excerpt,
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  const related = getRelatedPosts(post);

  return (
    <article className="bg-linen px-4 py-16 md:px-8">
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
