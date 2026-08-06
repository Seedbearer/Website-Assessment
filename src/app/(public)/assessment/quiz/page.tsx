import Quiz from "@/components/assessment/Quiz";

export const metadata = {
  title: "The Seed Assessment",
};

export default function AssessmentQuizPage() {
  return (
    <section className="bg-linen">
      <Quiz />
    </section>
  );
}
