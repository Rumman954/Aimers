import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";

export const metadata = {
  title: "Terms of Service",
  description: "Terms for using the Aimers online education platform.",
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl flex-1 px-4 py-16 md:px-6 lg:px-8">
      <SectionHeading
        align="left"
        title="Terms of Service"
        subtitle="Last updated: July 2026"
      />
      <div className="prose prose-sm mt-8 max-w-none text-aimers-muted">
        <p>
          By using Aimers, you agree to use the platform for lawful learning and
          teaching purposes. You are responsible for the accuracy of content you
          submit as an instructor.
        </p>
        <p className="mt-4">
          Course listings, enrollments, and dashboards reflect platform activity
          and are not proof of paid purchases unless explicitly stated.
        </p>
        <p className="mt-4">
          AI-generated content (Course Writer, Pathfinder) is provided as
          assistance. Review outputs before publishing or making enrollment
          decisions.
        </p>
        <p className="mt-4">
          We may update these terms as the product evolves. Continued use after
          changes constitutes acceptance.
        </p>
      </div>
      <Button href="/" variant="secondary" className="mt-10">
        Back home
      </Button>
    </main>
  );
}
