import Button from "@/components/ui/Button";

export const metadata = {
  title: "Work With Me — Seedbearer Family",
};

export default function CoachingPage() {
  return (
    <section className="bg-linen px-4 py-20 md:px-8">
      <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
        <h1 className="font-lora text-3xl text-soil md:text-5xl">Work With Me</h1>
        {/*
          TODO: this page's copy source is `Seedbearer_Carrd_Website_Guide.docx` — Section 5
          coaching copy. That file could not be found on disk in this project. Replace this
          placeholder with the real copy before this phase ships.
        */}
        <p className="mt-6 max-w-lg text-lg text-dark-gray">
          The coaching page copy is pending — the reference document
          (Seedbearer_Carrd_Website_Guide.docx) hasn&rsquo;t been supplied yet.
        </p>
        <div className="mt-8">
          <Button href="/assessment">Take the Free Seed Assessment</Button>
        </div>
      </div>
    </section>
  );
}
