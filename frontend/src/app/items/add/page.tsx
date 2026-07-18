"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { api, ApiError } from "@/lib/api";

export default function AddItemPage() {
  return (
    <ProtectedRoute roles={["instructor", "admin"]}>
      <AddItemForm />
    </ProtectedRoute>
  );
}

function AddItemForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [fullDescription, setFullDescription] = useState("");
  const [price, setPrice] = useState("49");
  const [category, setCategory] = useState("Programming");
  const [level, setLevel] = useState<"Beginner" | "Intermediate" | "Advanced">(
    "Beginner"
  );
  const [duration, setDuration] = useState("6 weeks");
  const [thumbnail, setThumbnail] = useState(
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80"
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api("/courses", {
        method: "POST",
        body: {
          title,
          shortDescription,
          fullDescription,
          price: Number(price),
          category,
          level,
          duration,
          thumbnail,
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
        className="mt-8 space-y-4 rounded-[var(--aimers-radius)] border border-aimers-border p-6"
      >
        {error ? (
          <p className="rounded-[var(--aimers-radius)] bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        ) : null}
        {(
          [
            ["Title", title, setTitle, "text"],
            ["Short description", shortDescription, setShortDescription, "text"],
            ["Full description", fullDescription, setFullDescription, "textarea"],
            ["Price", price, setPrice, "number"],
            ["Category", category, setCategory, "text"],
            ["Duration", duration, setDuration, "text"],
            ["Image URL", thumbnail, setThumbnail, "url"],
          ] as const
        ).map(([label, value, setter, type]) => (
          <div key={label}>
            <label className="block text-sm font-medium">{label}</label>
            {type === "textarea" ? (
              <textarea
                required
                value={value}
                onChange={(e) => setter(e.target.value)}
                rows={4}
                className="mt-1.5 w-full rounded-[var(--aimers-radius)] border border-aimers-border px-4 py-2.5 text-sm"
              />
            ) : (
              <input
                required
                type={type}
                value={value}
                onChange={(e) => setter(e.target.value)}
                className="mt-1.5 w-full rounded-[var(--aimers-radius)] border border-aimers-border px-4 py-2.5 text-sm"
              />
            )}
          </div>
        ))}
        <div>
          <label className="block text-sm font-medium">Level</label>
          <select
            value={level}
            onChange={(e) =>
              setLevel(e.target.value as "Beginner" | "Intermediate" | "Advanced")
            }
            className="mt-1.5 w-full rounded-[var(--aimers-radius)] border border-aimers-border px-4 py-2.5 text-sm"
          >
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
        </div>
        <Button type="submit" size="lg" disabled={loading}>
          {loading ? "Saving..." : "Submit"}
        </Button>
      </form>
    </main>
  );
}
