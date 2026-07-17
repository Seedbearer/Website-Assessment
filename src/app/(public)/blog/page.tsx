import Link from "next/link";
import { getAllPosts, type PostCategory } from "@/lib/blog";

export const metadata = {
  title: "Blog — Seedbearer Family",
};

const CATEGORIES: PostCategory[] = ["Identity", "Parenting", "Healing", "Connection"];

export default function BlogIndexPage({ searchParams }: { searchParams: { category?: string } }) {
  const allPosts = getAllPosts();
  const activeCategory = searchParams.category;
  const posts = activeCategory ? allPosts.filter((p) => p.category === activeCategory) : allPosts;

  return (
    <section className="bg-linen px-4 py-20 md:px-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-center font-lora text-3xl text-soil md:text-5xl">Blog</h1>

        <div className="mt-8 flex flex-wrap justify-center gap-2">
          <Link
            href="/blog"
            className={`rounded px-3 py-1.5 text-sm transition ${
              !activeCategory ? "bg-deep-green text-linen" : "bg-off-white text-dark-gray hover:bg-mid-gray"
            }`}
          >
            All
          </Link>
          {CATEGORIES.map((c) => (
            <Link
              key={c}
              href={`/blog?category=${c}`}
              className={`rounded px-3 py-1.5 text-sm transition ${
                activeCategory === c ? "bg-deep-green text-linen" : "bg-off-white text-dark-gray hover:bg-mid-gray"
              }`}
            >
              {c}
            </Link>
          ))}
        </div>

        {posts.length === 0 ? (
          <p className="mt-10 text-center text-lg text-dark-gray">
            {activeCategory ? "No posts in this category yet." : "The first posts are coming soon — check back shortly."}
          </p>
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="block rounded-lg border border-mid-gray bg-off-white p-6 hover:border-bark"
              >
                <p className="text-xs uppercase tracking-wide text-bark">{post.category}</p>
                <h2 className="mt-2 font-lora text-xl text-soil">{post.title}</h2>
                {post.excerpt && <p className="mt-2 text-sm text-dark-gray">{post.excerpt}</p>}
                <p className="mt-4 text-xs text-bark">{new Date(post.date).toLocaleDateString()}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
