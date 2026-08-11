import TriageForm from "@/components/triage/TriageForm";

export const metadata = {
  title: "Get Help Now",
  description:
    "A short, honest check-in for families in a hard moment right now — six questions, then a matched resource sent straight to your inbox.",
};

export default function TriagePage() {
  return (
    <section className="bg-linen">
      <TriageForm />
    </section>
  );
}
