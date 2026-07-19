"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { api, ApiError } from "@/lib/api";
import { CATEGORIES, LEVELS } from "@/lib/courses";
import type { CourseLevel } from "@/types/course";
import { cn } from "@/lib/utils";

const fieldClassName =
  "mt-1.5 w-full rounded-[var(--aimers-radius)] border border-aimers-border px-4 py-2.5 text-sm";

export default function AddItemPage() {
  return (
    <ProtectedRoute roles={["instructor", "admin"]}>
      <Suspense
        fallback={
          <main className="p-16 text-sm text-aimers-muted">Loading…</main>
        }
      >
        <AddItemForm />
      </Suspense>
    </ProtectedRoute>
  );
}

type FieldErrors = Partial<
  Record<
    | "title"
    | "shortDescription"
    | "fullDescription"
    | "price"
    | "category"
    | "duration"
    | "thumbnail",
    string
  >
>;

function AddItemForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [fullDescription, setFullDescription] = useState("");
  const [price, setPrice] = useState("49");
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [level, setLevel] = useState<CourseLevel>("Beginner");
  const [duration, setDuration] = useState("6 weeks");
  const [thumbnail, setThumbnail] = useState(
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80"
  );
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [error, setError] = useState("");
  const [aiApplied, setAiApplied] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchParams.get("from") !== "ai") return;
    try {
      const raw = sessionStorage.getItem("aimers_ai_course_draft");
      if (!raw) return;
      const draft = JSON.parse(raw) as {
        title?: string;
        shortDescription?: string;
        fullDescription?: string;
        category?: string;
        level?: CourseLevel;
        duration?: string;
      };
      if (draft.title) setTitle(draft.title);
      if (draft.shortDescription) setShortDescription(draft.shortDescription);
      if (draft.fullDescription) setFullDescription(draft.fullDescription);
      if (draft.category) setCategory(draft.category);
      if (draft.level) setLevel(draft.level);
      if (draft.duration) setDuration(draft.duration);
      setAiApplied(true);
      sessionStorage.removeItem("aimers_ai_course_draft");
    } catch {
      // ignore bad draft
    }
  }, [searchParams]);

  function validate(): FieldErrors {
    const next: FieldErrors = {};
    if (!title.trim()) next.title = "Title is required.";
    if (!shortDescription.trim()) {
      next.shortDescription = "Short description is required.";
    }
    if (!fullDescription.trim()) {
      next.fullDescription = "Full description is required.";
    }
    if (!price.trim() || Number.isNaN(Number(price)) || Number(price) < 0) {
      next.price = "Enter a valid price.";
    }
    if (!category) next.category = "Choose a category.";
    if (!duration.trim()) next.duration = "Duration is required.";
    if (!thumbnail.trim()) next.thumbnail = "Image URL is required.";
    return next;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const nextErrors = validate();
    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);
    try {
      await api("/courses", {
        method: "POST",
        body: {
          title: title.trim(),
          shortDescription: shortDescription.trim(),
          fullDescription: fullDescription.trim(),
          price: Number(price),
          category,
          level,
          duration: duration.trim(),
          thumbnail: thumbnail.trim(),
        },
      });
      router.push("/items/manage");
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Could not create course. Use an instructor account."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-2xl flex-1 px-4 py-16 md:px-6">
      <SectionHeading
        align="left"
        title="Add course"
        subtitle="Create a new course for the Aimers catalog."
      />
      <form
        onSubmit={handleSubmit}
        noValidate
        className="mt-8 space-y-5 rounded-[var(--aimers-radius)] border border-aimers-border p-6"
      >
        {aiApplied ? (
          <p className="rounded-[var(--aimers-radius)] bg-aimers-surface px-3 py-2 text-sm text-aimers-muted">
            Fields prefilled from Aimers Course Writer. Review and publish.
          </p>
        ) : null}
        {error ? (
          <p className="rounded-[var(--aimers-radius)] bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        <Field
          id="course-title"
          label="Course title"
          value={title}
          onChange={setTitle}
          error={fieldErrors.title}
          required
        />
        <Field
          id="course-short-description"
          label="Short description"
          value={shortDescription}
          onChange={setShortDescription}
          error={fieldErrors.shortDescription}
          required
        />
        <Field
          id="course-full-description"
          label="Full description"
          value={fullDescription}
          onChange={setFullDescription}
          error={fieldErrors.fullDescription}
          required
          multiline
        />
        <Field
          id="course-price"
          label="Price (USD)"
          type="number"
          min="0"
          step="0.01"
          value={price}
          onChange={setPrice}
          error={fieldErrors.price}
          required
        />

        <div>
          <label htmlFor="course-category" className="block text-sm font-medium">
            Category
          </label>
          <select
            id="course-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={fieldClassName}
          >
            {CATEGORIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
            {!CATEGORIES.includes(category as (typeof CATEGORIES)[number]) ? (
              <option value={category}>{category}</option>
            ) : null}
          </select>
          {fieldErrors.category ? (
            <p className="mt-1 text-xs text-red-600">{fieldErrors.category}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="course-level" className="block text-sm font-medium">
            Difficulty level
          </label>
          <select
            id="course-level"
            value={level}
            onChange={(e) => setLevel(e.target.value as CourseLevel)}
            className={fieldClassName}
          >
            {LEVELS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <Field
          id="course-duration"
          label="Duration"
          value={duration}
          onChange={setDuration}
          error={fieldErrors.duration}
          placeholder="e.g. 6 weeks"
          required
        />
        <Field
          id="course-thumbnail"
          label="Thumbnail image URL"
          type="url"
          value={thumbnail}
          onChange={setThumbnail}
          error={fieldErrors.thumbnail}
          required
        />

        <div className="flex flex-wrap gap-3">
          <Button type="submit" size="lg" disabled={loading}>
            {loading ? "Saving…" : "Publish course"}
          </Button>
          <Button href="/ai/generate" variant="secondary" size="lg">
            Open Course Writer
          </Button>
        </div>
      </form>
    </main>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  error,
  required,
  multiline,
  type = "text",
  placeholder,
  min,
  step,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  multiline?: boolean;
  type?: string;
  placeholder?: string;
  min?: string;
  step?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
      </label>
      {multiline ? (
        <textarea
          id={id}
          required={required}
          rows={4}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={cn(fieldClassName, error && "border-red-400")}
        />
      ) : (
        <input
          id={id}
          required={required}
          type={type}
          min={min}
          step={step}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={cn(fieldClassName, error && "border-red-400")}
        />
      )}
      {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
