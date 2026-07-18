"use client";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { useAuth } from "@/components/auth/auth-provider";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const { user } = useAuth();

  return (
    <main className="mx-auto max-w-4xl flex-1 px-4 py-16 md:px-6 lg:px-8">
      <SectionHeading
        align="left"
        title={`Welcome, ${user?.name || "learner"}`}
        subtitle="Your learning hub. Charts and enrollment insights expand in Phase 4."
      />
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-[var(--aimers-radius)] border border-aimers-border p-5">
          <p className="text-xs uppercase tracking-wide text-aimers-muted">
            Account
          </p>
          <p className="mt-2 font-semibold">{user?.email}</p>
          <p className="mt-1 text-sm capitalize text-aimers-muted">
            Role: {user?.role}
          </p>
        </div>
        <div className="rounded-[var(--aimers-radius)] border border-aimers-border p-5">
          <p className="text-xs uppercase tracking-wide text-aimers-muted">
            Quick actions
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button href="/courses" size="sm">
              Browse courses
            </Button>
            {user?.role === "instructor" || user?.role === "admin" ? (
              <Button href="/items/add" variant="secondary" size="sm">
                Add course
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </main>
  );
}
