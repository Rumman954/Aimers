import { CourseCard } from "@/components/courses/course-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { courses } from "@/data/courses";

export const metadata = {
  title: "Courses",
};

type CoursesPageProps = {
  searchParams: Promise<{ category?: string }>;
};

export default async function CoursesPage({ searchParams }: CoursesPageProps) {
  const { category } = await searchParams;
  const filtered = category
    ? courses.filter(
        (c) => c.category.toLowerCase() === category.toLowerCase()
      )
    : courses;

  return (
    <main className="mx-auto max-w-7xl flex-1 px-4 py-16 md:px-6 lg:px-8">
      <SectionHeading
        align="left"
        title={category ? `${category} courses` : "Explore courses"}
        subtitle={
          category
            ? `Showing ${filtered.length} course${filtered.length === 1 ? "" : "s"} in ${category}. Advanced filters arrive in Phase 3.`
            : "Browse all Aimers courses. Search, filters, and sorting ship in Phase 3."
        }
      />

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <p className="text-aimers-muted">
          No courses found in this category yet.{" "}
          <a href="/courses" className="font-medium text-aimers-black underline">
            View all courses
          </a>
        </p>
      )}
    </main>
  );
}
