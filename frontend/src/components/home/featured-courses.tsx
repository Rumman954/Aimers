"use client";

import { useQuery } from "@tanstack/react-query";
import { CourseCard } from "@/components/courses/course-card";
import { CourseCardSkeleton } from "@/components/courses/course-card-skeleton";
import { SectionHeading } from "@/components/ui/section-heading";
import { api, type CourseListResponse } from "@/lib/api";
import { getFeaturedCourses } from "@/data/courses";
import type { Course } from "@/types/course";

function toCourse(item: CourseListResponse["data"][number]): Course {
  return {
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
  };
}

export function FeaturedCourses() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["featured-courses"],
    queryFn: async () => {
      const res = await api<CourseListResponse>(
        "/courses?limit=4&sort=popular",
        { auth: false }
      );
      return res.data.map(toCourse);
    },
    staleTime: 60_000,
    retry: 1,
  });

  const courses = data?.length ? data : isError ? getFeaturedCourses(4) : [];
  const showSkeleton = isLoading && !data;

  return (
    <section className="bg-aimers-surface py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <SectionHeading
          title="Featured courses"
          subtitle="Hand-picked paths to build skills that matter — start with these learner favorites."
        />

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {showSkeleton
            ? Array.from({ length: 4 }).map((_, i) => (
                <CourseCardSkeleton key={i} />
              ))
            : courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
        </div>
      </div>
    </section>
  );
}
