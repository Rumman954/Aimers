"use client";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";

export default function ManagePage() {
  return (
    <ProtectedRoute roles={["instructor", "admin"]}>
      <main className="mx-auto max-w-4xl flex-1 px-4 py-16 md:px-6 lg:px-8">
        <SectionHeading
          align="left"
          title="Manage courses"
          subtitle="Create and manage your Aimers catalog. Full table actions expand in Phase 3."
        />
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href="/items/add">Add course</Button>
          <Button href="/items/manage" variant="secondary">
            Manage items
          </Button>
        </div>
      </main>
    </ProtectedRoute>
  );
}
