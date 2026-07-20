"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, MessageCircle, PlayCircle } from "lucide-react";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { AimersChatPanel } from "@/components/courses/aimers-chat-panel";
import { CourseImage } from "@/components/courses/course-image";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

type EnrolledCourse = {
  id: string;
  progress: number;
  enrolledAt: string;
  course: {
    id: string;
    title: string;
    thumbnail: string;
    category: string;
    level: string;
    price: number;
    instructorName: string;
  };
};

type EnrollmentsResponse = {
  success: boolean;
  data: EnrolledCourse[];
};

export default function MyClassPage() {
  return (
    <ProtectedRoute roles={["student"]}>
      <MyClassContent />
    </ProtectedRoute>
  );
}

function MyClassContent() {
  const [enrollments, setEnrollments] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCourse, setActiveCourse] = useState<EnrolledCourse | null>(null);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    async function loadEnrollments() {
      setLoading(true);
      setError("");
      try {
        const res = await api<EnrollmentsResponse>("/dashboard/enrollments");
        setEnrollments(res.data);
      } catch {
        setError("Could not load your enrolled courses.");
      } finally {
        setLoading(false);
      }
    }

    void loadEnrollments();
  }, []);

  useEffect(() => {
    function handleEnrolled() {
      void api<EnrollmentsResponse>("/dashboard/enrollments").then((res) => {
        setEnrollments(res.data);
      });
    }

    window.addEventListener("aimers:enrolled", handleEnrolled);
    return () => window.removeEventListener("aimers:enrolled", handleEnrolled);
  }, []);

  return (
    <main className="mx-auto max-w-6xl flex-1 px-4 py-12 md:px-6 lg:px-8 lg:py-16">
      <SectionHeading
        align="left"
        title="My Class"
        subtitle="Choose an enrolled course to start learning, then open Aimers support whenever you need help."
      />

      {loading ? (
        <p className="mt-10 text-sm text-aimers-muted">Loading your classes…</p>
      ) : null}

      {error ? (
        <p className="mt-10 rounded-[var(--aimers-radius)] bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      {!loading && !error && enrollments.length === 0 ? (
        <div className="mt-10 rounded-[var(--aimers-radius)] border border-dashed border-aimers-border p-10 text-center">
          <BookOpen className="mx-auto h-10 w-10 text-aimers-gold" />
          <h2 className="mt-4 font-[family-name:var(--font-space-grotesk)] text-xl font-bold">
            No courses yet
          </h2>
          <p className="mt-2 text-sm text-aimers-muted">
            Enroll in a course to see it here and start learning with Aimers
            support.
          </p>
          <Button href="/courses" className="mt-6">
            Browse courses
          </Button>
        </div>
      ) : null}

      {!loading && enrollments.length > 0 ? (
        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <section>
            <h2 className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold">
              Your enrolled courses
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {enrollments.map((item) => {
                const selected = activeCourse?.course.id === item.course.id;
                return (
                  <article
                    key={item.id}
                    className={cn(
                      "overflow-hidden rounded-[var(--aimers-radius)] border p-4 transition",
                      selected
                        ? "border-aimers-gold bg-aimers-gold/5"
                        : "border-aimers-border hover:border-aimers-black/30"
                    )}
                  >
                    <div className="relative aspect-[16/10] overflow-hidden rounded-[var(--aimers-radius)] bg-aimers-surface">
                      <CourseImage
                        src={item.course.thumbnail}
                        alt={item.course.title}
                        sizes="(max-width: 640px) 100vw, 320px"
                      />
                    </div>
                    <p className="mt-3 text-xs uppercase tracking-wide text-aimers-gold">
                      {item.course.category} · {item.course.level}
                    </p>
                    <h3 className="mt-1 font-semibold text-aimers-black">
                      {item.course.title}
                    </h3>
                    <p className="mt-1 text-xs text-aimers-muted">
                      Instructor: {item.course.instructorName}
                    </p>
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs text-aimers-muted">
                        <span>Progress</span>
                        <span>{item.progress}%</span>
                      </div>
                      <div className="mt-1 h-2 overflow-hidden rounded-full bg-aimers-surface">
                        <div
                          className="h-full rounded-full bg-aimers-gold transition-all"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      className="mt-4 w-full"
                      variant={selected ? "gold" : "primary"}
                      onClick={() => {
                        setActiveCourse(item);
                        setChatOpen(false);
                      }}
                    >
                      <PlayCircle className="h-4 w-4" />
                      {selected ? "Selected" : "Start course"}
                    </Button>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="rounded-[var(--aimers-radius)] border border-aimers-border p-5 md:p-6">
            {!activeCourse ? (
              <div className="flex h-full min-h-72 flex-col items-center justify-center text-center">
                <PlayCircle className="mb-3 h-10 w-10 text-aimers-gold" />
                <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-bold">
                  Choose a course
                </h2>
                <p className="mt-2 max-w-sm text-sm text-aimers-muted">
                  Select one of your enrolled courses to start learning and
                  unlock the Aimers support assistant.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                <div>
                  <p className="text-xs uppercase tracking-wide text-aimers-gold">
                    Now learning
                  </p>
                  <h2 className="mt-1 font-[family-name:var(--font-space-grotesk)] text-2xl font-bold">
                    {activeCourse.course.title}
                  </h2>
                  <p className="mt-2 text-sm text-aimers-muted">
                    {activeCourse.course.category} · {activeCourse.course.level}{" "}
                    · {activeCourse.progress}% complete
                  </p>
                </div>

                <div className="rounded-[var(--aimers-radius)] bg-aimers-surface p-4 text-sm text-aimers-muted">
                  <p>
                    Continue your lessons, track progress on your dashboard, and
                    ask Aimers whenever you feel stuck or need guidance about
                    this course.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button
                    type="button"
                    onClick={() => setChatOpen(true)}
                  >
                    <MessageCircle className="h-4 w-4" />
                    Support
                  </Button>
                  <Button
                    href={`/courses/${activeCourse.course.id}`}
                    variant="secondary"
                  >
                    Open course page
                  </Button>
                  <Button href="/dashboard" variant="secondary" size="sm">
                    Dashboard
                  </Button>
                </div>

                <div className="rounded-[var(--aimers-radius)] border border-aimers-border p-4">
                  <p className="text-sm font-semibold text-aimers-black">
                    Need help?
                  </p>
                  <p className="mt-1 text-sm text-aimers-muted">
                    Click <strong>Support</strong> to chat with{" "}
                    <strong>Aimers</strong>. Describe your problem and the
                    assistant will reply with course-specific guidance.
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>
      ) : null}

      {activeCourse ? (
        <AimersChatPanel
          courseId={activeCourse.course.id}
          courseTitle={activeCourse.course.title}
          open={chatOpen}
          onClose={() => setChatOpen(false)}
        />
      ) : null}
    </main>
  );
}
