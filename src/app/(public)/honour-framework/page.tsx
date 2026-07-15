export const metadata = {
  title: "The Honour Framework — Seedbearer Family",
};

export default function HonourFrameworkPage() {
  return (
    <section className="bg-linen px-4 py-20 md:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="font-lora text-3xl text-soil md:text-5xl">The Honour Framework</h1>
        {/*
          TODO: this page's copy source is `Seedbearer_Honour_Framework.docx`. That file could
          not be found on disk in this project. Replace this placeholder with the real copy
          before this phase ships.
        */}
        <p className="mt-6 text-lg text-dark-gray">
          This page&rsquo;s copy is pending — the reference document
          (Seedbearer_Honour_Framework.docx) hasn&rsquo;t been supplied yet.
        </p>
      </div>
    </section>
  );
}
