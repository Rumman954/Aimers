import { SectionHeading } from "@/components/ui/section-heading";

export const metadata = {
  title: "AI Tools",
};

export default function AiToolsPage() {
  return (
    <main className="mx-auto max-w-4xl flex-1 px-4 py-16 md:px-6 lg:px-8">
      <SectionHeading
        align="left"
        title="AI Tools"
        subtitle="The Aimers AI study assistant — summaries, practice questions, and progress insights — ships in Phase 1."
      />
    </main>
  );
}
