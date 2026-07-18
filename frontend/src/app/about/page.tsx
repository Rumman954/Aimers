import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-4xl flex-1 px-4 py-16 md:px-6 lg:px-8">
      <SectionHeading
        align="left"
        title="About Aimers"
        subtitle="We believe focused learning beats scattered content. Aimers exists to help students aim higher and finish what they start."
      />

      <div className="prose prose-neutral max-w-none space-y-6 text-aimers-muted">
        <p>
          Aimers is an online education platform built for learners who want
          structure without rigidity. We combine expert-led courses, curated
          learning paths, and AI-powered study tools so you can progress with
          clarity — whether you are switching careers, preparing for exams, or
          leveling up in your current role.
        </p>
        <p>
          Our instructors are practitioners first. They teach what they use daily
          in their work, update materials as industries shift, and design
          projects that belong in a real portfolio. Every course on Aimers
          follows a consistent format: clear outcomes, milestone checkpoints,
          and assessments that prove you understand the material.
        </p>
        <p>
          We started Aimers after seeing too many students bounce between free
          tutorials without ever finishing a complete skill. Our platform
          removes that friction with guided paths, progress tracking, and an AI
          assistant that adapts to how you learn.
        </p>
      </div>

      <div className="mt-10 rounded-[var(--aimers-radius)] border border-aimers-border bg-aimers-surface p-6 md:p-8">
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-bold text-aimers-black">
          Our mission
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-aimers-muted">
          Make quality education accessible, structured, and achievable for
          every motivated learner — no matter where they start or how busy their
          schedule is.
        </p>
        <div className="mt-6">
          <Button href="/courses">Explore our courses</Button>
        </div>
      </div>
    </main>
  );
}
