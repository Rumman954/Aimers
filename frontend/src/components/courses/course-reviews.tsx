"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { api, ApiError } from "@/lib/api";
import { cn } from "@/lib/utils";

type CourseReviewsProps = {
  courseId: string;
};

type ReviewUser = {
  _id?: string;
  name: string;
  avatar?: string;
};

type ReviewApi = {
  _id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: ReviewUser | string;
};

const fieldClassName =
  "w-full rounded-[var(--aimers-radius)] border border-aimers-border bg-aimers-white px-4 py-2.5 text-sm text-aimers-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aimers-gold focus-visible:ring-offset-2";

function getReviewerName(user: ReviewUser | string): string {
  if (typeof user === "string") return "Student";
  return user.name || "Student";
}

function formatReviewDate(value: string): string {
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function StarRating({
  value,
  max = 5,
  className,
}: {
  value: number;
  max?: number;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-0.5", className)} aria-hidden>
      {Array.from({ length: max }).map((_, index) => (
        <Star
          key={index}
          className={cn(
            "h-4 w-4",
            index < value
              ? "fill-aimers-gold text-aimers-gold"
              : "text-aimers-border"
          )}
        />
      ))}
    </div>
  );
}

export function CourseReviews({ courseId }: CourseReviewsProps) {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [formError, setFormError] = useState("");

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["course-reviews", courseId],
    queryFn: async () => {
      const res = await api<{ success: boolean; data: ReviewApi[] }>(
        `/courses/${courseId}/reviews`
      );
      return res.data;
    },
  });

  const submitReview = useMutation({
    mutationFn: async () => {
      await api(`/courses/${courseId}/reviews`, {
        method: "POST",
        body: { rating, comment },
      });
    },
    onSuccess: async () => {
      setComment("");
      setRating(5);
      setFormError("");
      await queryClient.invalidateQueries({
        queryKey: ["course-reviews", courseId],
      });
    },
    onError: (err) => {
      setFormError(
        err instanceof ApiError ? err.message : "Could not submit review"
      );
    },
  });

  return (
    <section className="mt-12">
      <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold">
        Reviews
      </h2>

      {isLoading ? (
        <p className="mt-4 text-sm text-aimers-muted">Loading reviews…</p>
      ) : reviews.length > 0 ? (
        <ul className="mt-6 space-y-4">
          {reviews.map((review) => (
            <li
              key={review._id}
              className="rounded-[var(--aimers-radius)] border border-aimers-border p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold text-aimers-black">
                  {getReviewerName(review.user)}
                </p>
                <time
                  dateTime={review.createdAt}
                  className="text-xs text-aimers-muted"
                >
                  {formatReviewDate(review.createdAt)}
                </time>
              </div>
              <StarRating value={review.rating} className="mt-2" />
              <p className="mt-3 text-sm leading-relaxed text-aimers-muted">
                {review.comment}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-aimers-muted">
          No reviews yet. Be the first to share your experience.
        </p>
      )}

      <div className="mt-8 rounded-[var(--aimers-radius)] border border-aimers-border bg-aimers-surface p-6">
        <h3 className="font-[family-name:var(--font-space-grotesk)] text-lg font-semibold text-aimers-black">
          Write a review
        </h3>

        {authLoading ? (
          <p className="mt-3 text-sm text-aimers-muted">Checking sign-in…</p>
        ) : isAuthenticated ? (
          <form
            className="mt-4 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              setFormError("");
              if (comment.trim().length < 5) {
                setFormError("Comment must be at least 5 characters.");
                return;
              }
              submitReview.mutate();
            }}
          >
            {formError ? (
              <p className="rounded-[var(--aimers-radius)] bg-red-50 px-3 py-2 text-sm text-red-700">
                {formError}
              </p>
            ) : null}
            <div>
              <label htmlFor="review-rating" className="block text-sm font-medium">
                Rating
              </label>
              <select
                id="review-rating"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className={cn(fieldClassName, "mt-1.5 max-w-xs")}
              >
                {[5, 4, 3, 2, 1].map((value) => (
                  <option key={value} value={value}>
                    {value} star{value === 1 ? "" : "s"}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="review-comment" className="block text-sm font-medium">
                Comment
              </label>
              <textarea
                id="review-comment"
                required
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share what you liked about this course…"
                className={cn(fieldClassName, "mt-1.5")}
              />
            </div>
            <Button type="submit" disabled={submitReview.isPending}>
              {submitReview.isPending ? "Submitting…" : "Submit review"}
            </Button>
          </form>
        ) : (
          <p className="mt-3 text-sm text-aimers-muted">
            <Link
              href="/login"
              className="font-medium text-aimers-black underline-offset-2 hover:underline"
            >
              Sign in
            </Link>{" "}
            to leave a review.
          </p>
        )}
      </div>
    </section>
  );
}
