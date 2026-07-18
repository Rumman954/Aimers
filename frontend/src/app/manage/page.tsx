import { SectionHeading } from "@/components/ui/section-heading";

export const metadata = {
  title: "Manage",
};

export default function ManagePage() {
  return (
    <main className="mx-auto max-w-4xl flex-1 px-4 py-16 md:px-6 lg:px-8">
      <SectionHeading
        align="left"
        title="Manage"
        subtitle="Instructor and admin tools for creating courses, managing students, and viewing analytics arrive in Phase 1."
      />
    </main>
  );
}
