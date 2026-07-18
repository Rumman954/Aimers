"use client";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { SectionHeading } from "@/components/ui/section-heading";

export default function AiToolsPage() {
  return (
    <ProtectedRoute>
      <main className="mx-auto max-w-4xl flex-1 px-4 py-16 md:px-6 lg:px-8">
        <SectionHeading
          align="left"
          title="AI Tools"
          subtitle="Course Writer and Pathfinder arrive in Phases 5–6. Sign-in is required to use them."
        />
      </main>
    </ProtectedRoute>
  );
}
