import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";

export const metadata = {
  title: "Privacy Policy",
  description: "How Aimers collects, uses, and protects your information.",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl flex-1 px-4 py-16 md:px-6 lg:px-8">
      <SectionHeading
        align="left"
        title="Privacy Policy"
        subtitle="Last updated: July 2026"
      />
      <div className="prose prose-sm mt-8 max-w-none text-aimers-muted">
        <p>
          Aimers respects your privacy. We collect account information (name,
          email), course activity (enrollments, reviews, preferences), and
          messages you send through our contact form.
        </p>
        <p className="mt-4">
          We use this data to operate the platform, personalize AI
          recommendations, and improve learning experiences. We do not sell your
          personal data.
        </p>
        <p className="mt-4">
          Authentication tokens are stored in your browser for session management.
          Passwords are hashed on the server. AI features may send prompts to
          configured LLM providers when API keys are enabled.
        </p>
        <p className="mt-4">
          For questions, contact{" "}
          <a href="mailto:hello@aimers.learn" className="text-aimers-black">
            hello@aimers.learn
          </a>
          .
        </p>
      </div>
      <Button href="/" variant="secondary" className="mt-10">
        Back home
      </Button>
    </main>
  );
}
