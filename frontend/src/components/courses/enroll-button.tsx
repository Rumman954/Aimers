"use client";

import { useState } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";

export function EnrollButton() {
  const { isAuthenticated, isLoading } = useAuth();
  const [enrolled, setEnrolled] = useState(false);

  if (isLoading) {
    return (
      <Button size="lg" disabled>
        Loading…
      </Button>
    );
  }

  if (!isAuthenticated) {
    return (
      <Button href="/login" size="lg">
        Sign in to enroll
      </Button>
    );
  }

  if (enrolled) {
    return (
      <div className="flex flex-col gap-2">
        <Button size="lg" variant="gold" disabled>
          Enrolled
        </Button>
        <p className="text-sm font-medium text-aimers-gold">
          Enrolled (demo)
        </p>
      </div>
    );
  }

  return (
    <Button
      size="lg"
      type="button"
      onClick={() => setEnrolled(true)}
    >
      Enroll now
    </Button>
  );
}
