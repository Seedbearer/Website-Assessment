export const metadata = {
  title: "Blog — Seedbearer Family",
};

export default function BlogIndexPage() {
  // TinaCMS-authored posts are added in Phase 3. No posts exist yet, so this renders the empty state.
  const posts: { slug: string; title: string; category: string; date: string; excerpt: string }[] = [];

  return (
    <section className="bg-linen px-4 py-20 md:px-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-center font-lora text-3xl text-soil md:text-5xl">Blog</h1>

        {posts.length === 0 ? (
          <p className="mt-10 text-center text-lg text-dark-gray">
            The first posts are coming soon — check back shortly.
          </p>
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="rounded-lg border border-mid-gray bg-off-white p-6"
              >
                <p className="text-xs uppercase tracking-wide text-bark">{post.category}</p>
                <h2 className="mt-2 font-lora text-xl text-soil">{post.title}</h2>
                <p className="mt-2 text-sm text-dark-gray">{post.excerpt}</p>
                <p className="mt-4 text-xs text-bark">{post.date}</p>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
