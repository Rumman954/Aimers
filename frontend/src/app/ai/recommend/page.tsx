"use client";

import { useState } from "react";
import Link from "next/link";
import { ThumbsDown, ThumbsUp, Compass } from "lucide-react";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { api, ApiError } from "@/lib/api";
import { CATEGORIES, LEVELS } from "@/lib/courses";

type RecCourse = {
  id: string;
  title: string;
  shortDescription: string;
  category: string;
  level: string;
  price: number;
  duration: string;
  rating: number;
};

type RecommendationItem = {
  courseId: string;
  reason: string;
  matchScore: number;
  course: RecCourse;
};

type RecommendResponse = {
  success: boolean;
  provider: string;
  message?: string;
  data: {
    recommendations: RecommendationItem[];
    learningPathTitle?: string;
    summary?: string;
  };
  context: {
    interests: string[];
    level: string | null;
    maxBudget: number | null;
    enrolledCount: number;
    viewedCount: number;
  };
};

const fieldClass =
  "mt-1.5 w-full rounded-[var(--aimers-radius)] border border-aimers-border px-4 py-2.5 text-sm focus:border-aimers-black focus:outline-none focus:ring-1 focus:ring-aimers-black";

export default function AiRecommendPage() {
  return (
    <ProtectedRoute>
      <Pathfinder />
    </ProtectedRoute>
  );
}

function Pathfinder() {
  const [interests, setInterests] = useState("Programming, Data Science");
  const [skills, setSkills] = useState("");
  const [level, setLevel] = useState("");
  const [category, setCategory] = useState("");
  const [maxBudget, setMaxBudget] = useState("100");
  const [preferredDuration, setPreferredDuration] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [result, setResult] = useState<RecommendResponse | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState("");

  async function handleRecommend(e?: React.FormEvent) {
    e?.preventDefault();
    setError("");
    setFeedbackMsg("");
    setLoading(true);
    try {
      const res = await api<RecommendResponse>("/ai/recommend", {
        method: "POST",
        body: {
          interests: interests
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          skills: skills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          level: level || undefined,
          category: category || undefined,
          maxBudget: maxBudget ? Number(maxBudget) : undefined,
          preferredDuration: preferredDuration || undefined,
        },
      });
      setResult(res);
      setInfo(res.message || `Ranked with ${res.provider}`);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Could not load recommendations."
      );
    } finally {
      setLoading(false);
    }
  }

  async function sendFeedback(
    courseId: string,
    action: "like" | "dislike"
  ) {
    setFeedbackMsg("");
    try {
      const res = await api<{ success: boolean; message: string }>(
        "/ai/recommend/feedback",
        {
          method: "POST",
          body: { courseId, action },
        }
      );
      setFeedbackMsg(res.message);
      // Refresh recommendations so learning continues
      await handleRecommend();
    } catch (err) {
      setFeedbackMsg(
        err instanceof ApiError ? err.message : "Could not save feedback."
      );
    }
  }

  return (
    <main className="mx-auto max-w-6xl flex-1 px-4 py-12 md:px-6 lg:px-8 lg:py-16">
      <SectionHeading
        align="left"
        title="Aimers Pathfinder"
        subtitle="Get personalized course recommendations from your interests, budget, level, and learning activity — then refine with feedback."
      />

      <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.2fr)]">
        <form
          onSubmit={handleRecommend}
          className="space-y-4 rounded-[var(--aimers-radius)] border border-aimers-border p-5 md:p-6"
        >
          <div>
            <label className="text-sm font-medium" htmlFor="interests">
              Interests (comma separated)
            </label>
            <input
              id="interests"
              className={fieldClass}
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              placeholder="e.g. Programming, Design"
            />
          </div>
          <div>
            <label className="text-sm font-medium" htmlFor="skills">
              Skills to build
            </label>
            <input
              id="skills"
              className={fieldClass}
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="e.g. React, SQL, IELTS"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium" htmlFor="level">
                Level
              </label>
              <select
                id="level"
                className={fieldClass}
                value={level}
                onChange={(e) => setLevel(e.target.value)}
              >
                <option value="">Any</option>
                {LEVELS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="category">
                Category
              </label>
              <select
                id="category"
                className={fieldClass}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Any</option>
                {CATEGORIES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium" htmlFor="budget">
                Max budget (USD)
              </label>
              <input
                id="budget"
                type="number"
                min={0}
                className={fieldClass}
                value={maxBudget}
                onChange={(e) => setMaxBudget(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="duration">
                Preferred duration
              </label>
              <input
                id="duration"
                className={fieldClass}
                value={preferredDuration}
                onChange={(e) => setPreferredDuration(e.target.value)}
                placeholder="e.g. 6 weeks"
              />
            </div>
          </div>

          {error ? (
            <p className="rounded-[var(--aimers-radius)] bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          ) : null}
          {info ? (
            <p className="rounded-[var(--aimers-radius)] bg-aimers-surface px-3 py-2 text-sm text-aimers-muted">
              {info}
            </p>
          ) : null}

          <Button type="submit" size="lg" disabled={loading}>
            <Compass className="h-4 w-4" />
            {loading ? "Finding matches…" : "Get recommendations"}
          </Button>
        </form>

        <section className="rounded-[var(--aimers-radius)] border border-aimers-border p-5 md:p-6">
          {!result && !loading ? (
            <div className="flex min-h-72 flex-col items-center justify-center text-center text-aimers-muted">
              <Compass className="mb-3 h-8 w-8 text-aimers-gold" />
              <p className="max-w-sm text-sm">
                Set your preferences and Pathfinder will rank courses with clear
                reasons. Like or dislike to improve future matches.
              </p>
            </div>
          ) : null}

          {loading ? (
            <p className="text-sm text-aimers-muted">Pathfinder is ranking courses…</p>
          ) : null}

          {result ? (
            <div className="space-y-5">
              <div>
                <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-bold">
                  {result.data.learningPathTitle || "Recommended for you"}
                </h2>
                {result.data.summary ? (
                  <p className="mt-2 text-sm text-aimers-muted">
                    {result.data.summary}
                  </p>
                ) : null}
                <p className="mt-2 text-xs text-aimers-muted">
                  Context: {result.context.enrolledCount} enrolled ·{" "}
                  {result.context.viewedCount} recent views
                  {result.context.maxBudget != null
                    ? ` · budget ≤ $${result.context.maxBudget}`
                    : ""}
                </p>
              </div>

              {feedbackMsg ? (
                <p className="rounded-[var(--aimers-radius)] bg-aimers-surface px-3 py-2 text-sm text-aimers-muted">
                  {feedbackMsg}
                </p>
              ) : null}

              <div className="space-y-4">
                {result.data.recommendations.length === 0 ? (
                  <p className="text-sm text-aimers-muted">
                    No matches for these filters. Try raising budget or clearing
                    level/category.
                  </p>
                ) : (
                  result.data.recommendations.map((item) => (
                    <article
                      key={item.courseId}
                      className="rounded-[var(--aimers-radius)] border border-aimers-border p-4"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-xs uppercase tracking-wide text-aimers-gold">
                            {item.course.category} · {item.course.level} · Match{" "}
                            {item.matchScore}%
                          </p>
                          <h3 className="mt-1 font-semibold text-aimers-black">
                            <Link
                              href={`/courses/${item.course.id}`}
                              className="hover:underline"
                            >
                              {item.course.title}
                            </Link>
                          </h3>
                          <p className="mt-1 text-sm text-aimers-muted">
                            {item.course.shortDescription}
                          </p>
                          <p className="mt-2 text-sm text-aimers-black/80">
                            {item.reason}
                          </p>
                          <p className="mt-2 text-xs text-aimers-muted">
                            ${item.course.price} · {item.course.duration} · ★{" "}
                            {item.course.rating}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => sendFeedback(item.courseId, "like")}
                            className="inline-flex items-center gap-1 rounded-[var(--aimers-radius)] border border-aimers-border px-3 py-2 text-xs font-medium hover:bg-aimers-surface"
                            aria-label="Like recommendation"
                          >
                            <ThumbsUp className="h-3.5 w-3.5" />
                            Like
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              sendFeedback(item.courseId, "dislike")
                            }
                            className="inline-flex items-center gap-1 rounded-[var(--aimers-radius)] border border-aimers-border px-3 py-2 text-xs font-medium hover:bg-aimers-surface"
                            aria-label="Dislike recommendation"
                          >
                            <ThumbsDown className="h-3.5 w-3.5" />
                            Not for me
                          </button>
                        </div>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}
