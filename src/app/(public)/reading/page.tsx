import { getReadingList } from "@/lib/reading-list";

export const metadata = {
  title: "Recommended Reading",
  description:
    "Books that shaped the Seedbearer framework — theology and identity, attachment psychology, neuroscience, communication, boundaries, and family connection.",
};

export default function ReadingPage() {
  const categories = getReadingList();
  const hasAffiliateLinks = categories.some((c) => c.books.some((b) => b.affiliateLink));

  return (
    <>
      <section className="bg-linen px-4 py-16 md:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="font-lora text-3xl text-soil md:text-5xl">Recommended Reading</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-dark-gray">
            The books that shaped the Seedbearer framework — theology, attachment psychology,
            neuroscience, communication, boundaries, and family connection. This is the library
            behind the coaching, not just a list of favourites.
          </p>
        </div>
      </section>

      {categories.length === 0 ? (
        <section className="bg-off-white px-4 py-14 md:px-8">
          <p className="mx-auto max-w-2xl text-center text-lg text-dark-gray">
            The reading list is being updated — check back shortly.
          </p>
        </section>
      ) : (
        categories.map((category, i) => (
          <section
            key={category.name}
            className={`px-4 py-14 md:px-8 ${i % 2 === 0 ? "bg-off-white" : "bg-linen"}`}
          >
            <div className="mx-auto max-w-4xl">
              <h2 className="font-lora text-2xl text-soil">{category.name}</h2>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {category.books.map((book) => (
                  <div key={book.title} className="rounded-lg border border-mid-gray bg-linen p-5">
                    <h3 className="font-lora text-lg text-soil">
                      {book.affiliateLink ? (
                        <a
                          href={book.affiliateLink}
                          target="_blank"
                          rel="noopener noreferrer sponsored"
                          className="hover:underline"
                        >
                          {book.title}
                        </a>
                      ) : (
                        book.title
                      )}
                    </h3>
                    <p className="mt-1 text-sm font-medium text-bark">{book.author}</p>
                    {book.relevance && (
                      <p className="mt-2 text-sm leading-relaxed text-dark-gray">{book.relevance}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        ))
      )}

      {hasAffiliateLinks && (
        <p className="bg-linen px-4 pb-12 text-center text-xs text-bark md:px-8">
          As an Amazon Associate, Seedbearer Family earns from qualifying purchases.
        </p>
      )}
    </>
  );
}
