"use client";

import Link from "next/link";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { Sparkles, Compass, MessageCircle } from "lucide-react";

export default function AiToolsPage() {
  return (
    <ProtectedRoute>
      <main className="mx-auto max-w-5xl flex-1 px-4 py-16 md:px-6 lg:px-8">
        <SectionHeading
          align="left"
          title="AI Tools"
          subtitle="Use Aimers agents to write course content, get personalized recommendations, and chat with course support after you enroll."
        />

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <article className="rounded-[var(--aimers-radius)] border border-aimers-border p-6">
            <Sparkles className="h-6 w-6 text-aimers-gold" />
            <h2 className="mt-4 font-[family-name:var(--font-space-grotesk)] text-xl font-bold">
              Course Writer
            </h2>
            <p className="mt-2 text-sm text-aimers-muted">
              Generate outlines, module plans, and descriptions from structured
              inputs. Adjust length and regenerate anytime.
            </p>
            <Button href="/ai/generate" className="mt-6">
              Open Course Writer
            </Button>
          </article>

          <article className="rounded-[var(--aimers-radius)] border border-aimers-border p-6">
            <Compass className="h-6 w-6 text-aimers-gold" />
            <h2 className="mt-4 font-[family-name:var(--font-space-grotesk)] text-xl font-bold">
              Pathfinder
            </h2>
            <p className="mt-2 text-sm text-aimers-muted">
              Get personalized course recommendations with reasons, then refine
              results using filters and like/dislike feedback.
            </p>
            <Button href="/ai/recommend" className="mt-6">
              Open Pathfinder
            </Button>
          </article>

          <article className="rounded-[var(--aimers-radius)] border border-aimers-border p-6">
            <MessageCircle className="h-6 w-6 text-aimers-gold" />
            <h2 className="mt-4 font-[family-name:var(--font-space-grotesk)] text-xl font-bold">
              Course Support
            </h2>
            <p className="mt-2 text-sm text-aimers-muted">
              Enroll in a course, then open its detail page to chat with an AI
              assistant about overview, timeline, instructor, and study tips.
            </p>
            <Button href="/courses" variant="secondary" className="mt-6">
              Browse courses
            </Button>
          </article>
        </div>

        <p className="mt-8 text-sm text-aimers-muted">
          Tip: instructors can apply Course Writer output into{" "}
          <Link href="/items/add" className="font-medium underline">
            Add Course
          </Link>
          .
        </p>
      </main>
    </ProtectedRoute>
  );
}
