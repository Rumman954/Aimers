import { CourseCard } from "@/components/courses/course-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { courses as staticCourses } from "@/data/courses";
import type { Course } from "@/types/course";

export const metadata = {
  title: "Courses",
};

type CoursesPageProps = {
  searchParams: Promise<{ category?: string }>;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function fetchCourses(category?: string): Promise<Course[]> {
  try {
    const params = new URLSearchParams({ limit: "48", sort: "popular" });
    if (category) params.set("category", category);

    const res = await fetch(`${API_URL}/courses?${params.toString()}`, {
      next: { revalidate: 30 },
    });

    if (!res.ok) throw new Error("API unavailable");

    const json = (await res.json()) as {
      data: Array<{
        id: string;
        title: string;
        shortDescription: string;
        fullDescription?: string;
        price: number;
        category: string;
        level: Course["level"];
        duration: string;
        thumbnail: string;
        rating: number;
        reviewCount: number;
        instructorName: string;
        students?: number;
      }>;
    };

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
    if (!category) return staticCourses;
    return staticCourses.filter(
      (c) => c.category.toLowerCase() === category.toLowerCase()
    );
  }
}

export default async function CoursesPage({ searchParams }: CoursesPageProps) {
  const { category } = await searchParams;
  const filtered = await fetchCourses(category);

  return (
    <main className="mx-auto max-w-7xl flex-1 px-4 py-16 md:px-6 lg:px-8">
      <SectionHeading
        align="left"
        title={category ? `${category} courses` : "Explore courses"}
        subtitle={
          category
            ? `Showing ${filtered.length} course${filtered.length === 1 ? "" : "s"} in ${category}.`
            : "Browse Aimers courses from the live catalog. Advanced search and filters expand in Phase 3."
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
