"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { useAuth } from "@/components/auth/auth-provider";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import Link from "next/link";

const CHART_COLORS = ["#0a0a0a", "#d4a017", "#6b7280", "#e4e4e7", "#3f3f46"];

type StudentStats = {
  success: boolean;
  role: "student";
  summary: {
    enrollments: number;
    avgProgress: number;
    views: number;
    completed: number;
  };
  progressByCourse: Array<{ course: string; progress: number; id: string }>;
  categoryBreakdown: Array<{ category: string; count: number }>;
  recentEnrollments: Array<{
    id: string;
    progress: number;
    course: {
      id: string;
      title: string;
      thumbnail: string;
      category: string;
    } | null;
  }>;
};

type InstructorStats = {
  success: boolean;
  role: "instructor";
  summary: {
    courses: number;
    enrollments: number;
    reviews: number;
    avgRating: number;
    students: number;
  };
  enrollmentsOverTime: Array<{ label: string; enrollments: number }>;
  categoryBreakdown: Array<{
    category: string;
    courses: number;
    students: number;
  }>;
  topCourses: Array<{
    id: string;
    title: string;
    students: number;
    rating: number;
    price: number;
  }>;
};

type DashboardStats = StudentStats | InstructorStats;

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="rounded-[var(--aimers-radius)] border border-aimers-border bg-aimers-white p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-aimers-muted">
        {label}
      </p>
      <p className="mt-2 font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-aimers-black">
        {value}
      </p>
      {hint ? <p className="mt-1 text-xs text-aimers-muted">{hint}</p> : null}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const { user } = useAuth();
  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: () => api<DashboardStats>("/dashboard/stats"),
  });

  return (
    <main className="mx-auto max-w-7xl flex-1 px-4 py-12 md:px-6 lg:px-8 lg:py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading
          align="left"
          title={`Welcome, ${user?.name || "learner"}`}
          subtitle={
            user?.role === "instructor" || user?.role === "admin"
              ? "Track your catalog performance, enrollments, and ratings."
              : "Track your learning progress and enrolled courses."
          }
        />
        <div className="flex flex-wrap gap-3">
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

      {isLoading ? (
        <p className="mt-10 text-sm text-aimers-muted">Loading dashboard…</p>
      ) : null}
      {error ? (
        <p className="mt-10 text-sm text-red-600">
          Could not load dashboard stats. Is the backend running?
        </p>
      ) : null}

      {data?.role === "student" ? <StudentDashboard data={data} /> : null}
      {data?.role === "instructor" ? <InstructorDashboard data={data} /> : null}
    </main>
  );
}

function StudentDashboard({ data }: { data: StudentStats }) {
  return (
    <div className="mt-10 space-y-10">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Enrolled" value={data.summary.enrollments} />
        <StatCard
          label="Avg progress"
          value={`${data.summary.avgProgress}%`}
        />
        <StatCard label="Completed" value={data.summary.completed} />
        <StatCard label="Course views" value={data.summary.views} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-[var(--aimers-radius)] border border-aimers-border p-5">
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold">
            Progress by course
          </h2>
          <div className="mt-6 h-64 w-full">
            {data.progressByCourse.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.progressByCourse}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                  <XAxis dataKey="course" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="progress" fill="#d4a017" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChart hint="Enroll in a course to see progress." />
            )}
          </div>
        </section>

        <section className="rounded-[var(--aimers-radius)] border border-aimers-border p-5">
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold">
            Categories
          </h2>
          <div className="mt-6 h-64 w-full">
            {data.categoryBreakdown.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.categoryBreakdown}
                    dataKey="count"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label
                  >
                    {data.categoryBreakdown.map((_, index) => (
                      <Cell
                        key={index}
                        fill={CHART_COLORS[index % CHART_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChart hint="No category data yet." />
            )}
          </div>
        </section>
      </div>

      <section>
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold">
          Recent enrollments
        </h2>
        <div className="mt-4 divide-y divide-aimers-border rounded-[var(--aimers-radius)] border border-aimers-border">
          {data.recentEnrollments.filter((e) => e.course).length === 0 ? (
            <p className="p-5 text-sm text-aimers-muted">
              No enrollments yet.{" "}
              <Link href="/courses" className="font-medium underline">
                Browse courses
              </Link>
            </p>
          ) : (
            data.recentEnrollments
              .filter((e) => e.course)
              .map((item) => (
                <div
                  key={item.id}
                  className="flex flex-wrap items-center justify-between gap-3 p-4"
                >
                  <div>
                    <Link
                      href={`/courses/${item.course!.id}`}
                      className="font-semibold text-aimers-black hover:underline"
                    >
                      {item.course!.title}
                    </Link>
                    <p className="text-xs text-aimers-muted">
                      {item.course!.category} · {item.progress}% complete
                    </p>
                  </div>
                  <div className="h-2 w-32 overflow-hidden rounded-full bg-aimers-surface">
                    <div
                      className="h-full bg-aimers-gold"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                </div>
              ))
          )}
        </div>
      </section>
    </div>
  );
}

function InstructorDashboard({ data }: { data: InstructorStats }) {
  return (
    <div className="mt-10 space-y-10">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Courses" value={data.summary.courses} />
        <StatCard label="Enrollments" value={data.summary.enrollments} />
        <StatCard label="Students" value={data.summary.students} />
        <StatCard label="Reviews" value={data.summary.reviews} />
        <StatCard label="Avg rating" value={data.summary.avgRating} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-[var(--aimers-radius)] border border-aimers-border p-5">
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold">
            Enrollments over time
          </h2>
          <div className="mt-6 h-64 w-full">
            {data.enrollmentsOverTime.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.enrollmentsOverTime}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar
                    dataKey="enrollments"
                    fill="#0a0a0a"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChart hint="No enrollment history yet." />
            )}
          </div>
        </section>

        <section className="rounded-[var(--aimers-radius)] border border-aimers-border p-5">
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold">
            Students by category
          </h2>
          <div className="mt-6 h-64 w-full">
            {data.categoryBreakdown.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.categoryBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                  <XAxis dataKey="category" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="students" fill="#d4a017" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChart hint="Create courses to see category stats." />
            )}
          </div>
        </section>
      </div>

      <section>
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold">
            Top courses
          </h2>
          <Button href="/items/manage" variant="secondary" size="sm">
            Manage
          </Button>
        </div>
        <div className="mt-4 overflow-x-auto rounded-[var(--aimers-radius)] border border-aimers-border">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-aimers-surface text-aimers-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Students</th>
                <th className="px-4 py-3 font-medium">Rating</th>
                <th className="px-4 py-3 font-medium">Price</th>
              </tr>
            </thead>
            <tbody>
              {data.topCourses.map((course) => (
                <tr key={course.id} className="border-t border-aimers-border">
                  <td className="px-4 py-3 font-medium">
                    <Link
                      href={`/courses/${course.id}`}
                      className="hover:underline"
                    >
                      {course.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{course.students}</td>
                  <td className="px-4 py-3">{course.rating}</td>
                  <td className="px-4 py-3">${course.price}</td>
                </tr>
              ))}
              {data.topCourses.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-aimers-muted">
                    No courses yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function EmptyChart({ hint }: { hint: string }) {
  return (
    <div className="flex h-full items-center justify-center text-sm text-aimers-muted">
      {hint}
    </div>
  );
}
