"use client";

import { useState } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { api, ApiError } from "@/lib/api";

type EnrollButtonProps = {
  courseId: string;
};

export function EnrollButton({ courseId }: EnrollButtonProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [enrolled, setEnrolled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

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
          {message || "You're enrolled in this course."}
        </p>
      </div>
    );
  }

  async function handleEnroll() {
    setLoading(true);
    setMessage("");
    try {
      const res = await api<{ success: boolean; message?: string }>(
        `/dashboard/enroll/${courseId}`,
        { method: "POST" }
      );
      setEnrolled(true);
      setMessage(res.message || "Enrollment saved to your dashboard.");
      window.dispatchEvent(
        new CustomEvent("aimers:enrolled", { detail: { courseId } })
      );
      toast("You're enrolled. Progress will show on your dashboard.", "success");
    } catch (err) {
      const msg =
        err instanceof ApiError ? err.message : "Could not enroll right now.";
      setMessage(msg);
      toast(msg, "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Button size="lg" type="button" onClick={handleEnroll} disabled={loading}>
        {loading ? "Enrolling…" : "Enroll now"}
      </Button>
      {message && !enrolled ? (
        <p className="text-sm text-red-600">{message}</p>
      ) : null}
    </div>
  );
}
