import { SectionHeading } from "@/components/ui/section-heading";

export const metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return (
    <main className="mx-auto max-w-4xl flex-1 px-4 py-16 md:px-6 lg:px-8">
      <SectionHeading
        align="left"
        title="Dashboard"
        subtitle="Your enrolled courses, progress, and upcoming deadlines will appear here in Phase 1."
      />
    </main>
  );
}
