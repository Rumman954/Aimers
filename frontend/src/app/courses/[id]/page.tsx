import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, Star, Users } from "lucide-react";
import { CourseCard } from "@/components/courses/course-card";
import { CourseImage } from "@/components/courses/course-image";
import { Button } from "@/components/ui/button";
import {
  getCourseById,
  getRelatedCourses,
} from "@/data/courses";
import type { Course } from "@/types/course";

type CourseDetailPageProps = {
  params: Promise<{ id: string }>;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function fetchCourse(id: string): Promise<Course | null> {
  try {
    const res = await fetch(`${API_URL}/courses/${id}`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) throw new Error("not found");
    const json = (await res.json()) as { data: Course & { id: string } };
    return {
      id: json.data.id,
      title: json.data.title,
      shortDescription: json.data.shortDescription,
      fullDescription: json.data.fullDescription,
      price: json.data.price,
      category: json.data.category,
      level: json.data.level,
      duration: json.data.duration,
      thumbnail: json.data.thumbnail,
      rating: json.data.rating,
      reviewCount: json.data.reviewCount,
      instructorName: json.data.instructorName,
      students: json.data.students,
    };
  } catch {
    return getCourseById(id) || null;
  }
}

async function fetchRelated(id: string, course: Course): Promise<Course[]> {
  try {
    const res = await fetch(`${API_URL}/courses/${id}/related`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) throw new Error("fail");
    const json = (await res.json()) as { data: Course[] };
    return json.data.map((item) => ({
      id: item.id,
      title: item.title,
      shortDescription: item.shortDescription,
      fullDescription: item.fullDescription,
      price: item.price,
      category: item.category,
      level: item.level,
      duration: item.duration,
      thumbnail: item.thumbnail,
      rating: item.rating,
      reviewCount: item.reviewCount,
      instructorName: item.instructorName,
      students: item.students,
    }));
  } catch {
    return getRelatedCourses(course);
  }
}

export async function generateMetadata({ params }: CourseDetailPageProps) {
  const { id } = await params;
  const course = await fetchCourse(id);
  if (!course) return { title: "Course not found" };
  return { title: course.title };
}

export default async function CourseDetailPage({
  params,
}: CourseDetailPageProps) {
  const { id } = await params;
  const course = await fetchCourse(id);

  if (!course) {
    notFound();
  }

  const related = await fetchRelated(id, course);

  return (
    <main className="flex-1">
      <div className="bg-aimers-surface">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-2 md:px-6 lg:px-8 lg:py-16">
          <div className="relative aspect-[16/10] overflow-hidden rounded-[var(--aimers-radius)] bg-aimers-white">
            <CourseImage
              src={course.thumbnail}
              alt={course.title}
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-sm font-medium uppercase tracking-wide text-aimers-gold">
              {course.category} · {course.level}
            </span>
            <h1 className="mt-2 font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-aimers-black md:text-4xl">
              {course.title}
            </h1>
            <p className="mt-4 text-aimers-muted">{course.shortDescription}</p>
            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-aimers-muted">
              <span className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-aimers-gold text-aimers-gold" />
                {course.rating} ({course.reviewCount} reviews)
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {course.duration}
              </span>
              {course.students ? (
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {course.students.toLocaleString()} students
                </span>
              ) : null}
            </div>
            <p className="mt-6 font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-aimers-black">
              ${course.price}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button size="lg">Enroll now</Button>
              <Button href="/courses" variant="secondary" size="lg">
                Back to courses
              </Button>
            </div>
            <p className="mt-4 text-sm text-aimers-muted">
              Instructor: {course.instructorName}
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 lg:px-8">
        <section>
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold">
            Overview
          </h2>
          <p className="mt-4 max-w-3xl leading-relaxed text-aimers-muted">
            {course.fullDescription || course.shortDescription}
          </p>
        </section>

        <section className="mt-12">
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold">
            Key information
          </h2>
          <dl className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Category", value: course.category },
              { label: "Level", value: course.level },
              { label: "Duration", value: course.duration },
              { label: "Price", value: `$${course.price}` },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-[var(--aimers-radius)] border border-aimers-border p-4"
              >
                <dt className="text-xs font-medium uppercase tracking-wide text-aimers-muted">
                  {item.label}
                </dt>
                <dd className="mt-1 font-semibold text-aimers-black">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {related.length > 0 ? (
          <section className="mt-16">
            <div className="flex items-end justify-between gap-4">
              <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold">
                Related courses
              </h2>
              <Link
                href={`/courses?category=${encodeURIComponent(course.category)}`}
                className="text-sm font-medium text-aimers-black underline-offset-2 hover:underline"
              >
                View more in {course.category}
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((item) => (
                <CourseCard key={item.id} course={item} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
