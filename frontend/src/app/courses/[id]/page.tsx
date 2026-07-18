import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, Star, Users } from "lucide-react";
import { CourseCard } from "@/components/courses/course-card";
import { Button } from "@/components/ui/button";
import {
  getCourseById,
  getRelatedCourses,
} from "@/data/courses";

type CourseDetailPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: CourseDetailPageProps) {
  const { id } = await params;
  const course = getCourseById(id);
  if (!course) return { title: "Course not found" };
  return { title: course.title };
}

export default async function CourseDetailPage({
  params,
}: CourseDetailPageProps) {
  const { id } = await params;
  const course = getCourseById(id);

  if (!course) {
    notFound();
  }

  const related = getRelatedCourses(course);

  return (
    <main className="flex-1">
      <div className="bg-aimers-surface">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-2 md:px-6 lg:px-8 lg:py-16">
          <div className="relative aspect-[16/10] overflow-hidden rounded-[var(--aimers-radius)] bg-aimers-white">
            <Image
              src={course.thumbnail}
              alt={course.title}
              fill
              className="object-cover"
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
              {course.students && (
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {course.students.toLocaleString()} students
                </span>
              )}
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
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-bold text-aimers-black">
              Overview
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-aimers-muted">
              {course.fullDescription ?? course.shortDescription}
            </p>
          </div>
          <aside className="rounded-[var(--aimers-radius)] border border-aimers-border p-6">
            <h2 className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold text-aimers-black">
              Course specs
            </h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-aimers-muted">Instructor</dt>
                <dd className="font-medium text-aimers-black">
                  {course.instructorName}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-aimers-muted">Level</dt>
                <dd className="font-medium text-aimers-black">{course.level}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-aimers-muted">Duration</dt>
                <dd className="font-medium text-aimers-black">
                  {course.duration}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-aimers-muted">Category</dt>
                <dd className="font-medium text-aimers-black">
                  {course.category}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-aimers-muted">Price</dt>
                <dd className="font-medium text-aimers-black">
                  ${course.price}
                </dd>
              </div>
            </dl>
          </aside>
        </div>

        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-bold text-aimers-black">
              Related courses
            </h2>
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((relatedCourse) => (
                <CourseCard key={relatedCourse.id} course={relatedCourse} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
