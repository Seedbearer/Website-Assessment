export const metadata = {
  title: "Recommended Reading — Seedbearer Family",
};

export default function ReadingPage() {
  return (
    <section className="bg-linen px-4 py-20 md:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="font-lora text-3xl text-soil md:text-5xl">Recommended Reading</h1>
        {/*
          TODO: this page's copy source is `Seedbearer_Carrd_Website_Guide.docx` — Section 4 book list.
          That file could not be found on disk in this project, so the book list below is a
          placeholder. Replace with the real list before this phase ships.
        */}
        <p className="mt-6 text-lg text-dark-gray">
          The book list for this page is pending — the reference document
          (Seedbearer_Carrd_Website_Guide.docx) hasn&rsquo;t been supplied yet.
        </p>
      </div>
    </section>
  );
}
