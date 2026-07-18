"use client";

import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { api, ApiError, type CourseApi } from "@/lib/api";

export default function ManageItemsPage() {
  return (
    <ProtectedRoute roles={["instructor", "admin"]}>
      <ManageItemsContent />
    </ProtectedRoute>
  );
}

function ManageItemsContent() {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ["my-courses"],
    queryFn: async () => {
      const res = await api<{ success: boolean; data: CourseApi[] }>(
        "/courses/mine/list"
      );
      return res.data;
    },
  });

  async function handleDelete(id: string) {
    if (!confirm("Delete this course?")) return;
    try {
      await api(`/courses/${id}`, { method: "DELETE" });
      await queryClient.invalidateQueries({ queryKey: ["my-courses"] });
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "Delete failed");
    }
  }

  return (
    <main className="mx-auto max-w-5xl flex-1 px-4 py-16 md:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading
          align="left"
          title="Manage items"
          subtitle="View or delete courses you created."
        />
        <Button href="/items/add">Add course</Button>
      </div>

      {isLoading ? (
        <p className="mt-8 text-sm text-aimers-muted">Loading your courses…</p>
      ) : null}
      {error ? (
        <p className="mt-8 text-sm text-red-600">
          Could not load courses. Sign in as an instructor.
        </p>
      ) : null}

      <div className="mt-8 overflow-x-auto rounded-[var(--aimers-radius)] border border-aimers-border">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-aimers-surface text-aimers-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(data || []).map((course) => (
              <tr key={course.id} className="border-t border-aimers-border">
                <td className="px-4 py-3 font-medium text-aimers-black">
                  {course.title}
                </td>
                <td className="px-4 py-3 text-aimers-muted">{course.category}</td>
                <td className="px-4 py-3">${course.price}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-3">
                    <Link
                      href={`/courses/${course.id}`}
                      className="font-medium underline-offset-2 hover:underline"
                    >
                      View
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(course.id)}
                      className="font-medium text-red-600 underline-offset-2 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!isLoading && (data || []).length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-aimers-muted">
                  No courses yet.{" "}
                  <Link href="/items/add" className="font-medium underline">
                    Add your first course
                  </Link>
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </main>
  );
}
