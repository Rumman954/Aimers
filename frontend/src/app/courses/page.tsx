import { Suspense } from "react";
import { CoursesExplore } from "@/components/courses/courses-explore";
import { CourseCardSkeleton } from "@/components/courses/course-card-skeleton";
import { SectionHeading } from "@/components/ui/section-heading";
import { COURSES_PAGE_LIMIT } from "@/lib/courses";

export const metadata = {
  title: "Courses",
};

type CoursesPageProps = {
  searchParams: Promise<{ category?: string }>;
};

function CoursesExploreFallback() {
  return (
    <main className="mx-auto max-w-7xl flex-1 px-4 py-16 md:px-6 lg:px-8">
      <SectionHeading
        align="left"
        title="Explore courses"
        subtitle="Search, filter, and browse the live Aimers catalog."
      />
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: COURSES_PAGE_LIMIT }).map((_, index) => (
          <CourseCardSkeleton key={`fallback-${index}`} />
        ))}
      </div>
    </main>
  );
}

export default async function CoursesPage({ searchParams }: CoursesPageProps) {
  const { category } = await searchParams;

  return (
    <Suspense fallback={<CoursesExploreFallback />}>
      <CoursesExplore initialCategory={category} />
    </Suspense>
  );
}
