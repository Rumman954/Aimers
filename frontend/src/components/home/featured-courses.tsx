"use client";

import { useEffect, useState } from "react";
import { CourseCard } from "@/components/courses/course-card";
import { CourseCardSkeleton } from "@/components/courses/course-card-skeleton";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { getFeaturedCourses } from "@/data/courses";

export function FeaturedCourses() {
  const [loading, setLoading] = useState(true);
  const featured = getFeaturedCourses(4);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="bg-aimers-white py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <SectionHeading
          title="Featured courses"
          subtitle="Start with our most popular programs — taught by practitioners and updated for today's job market."
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <CourseCardSkeleton key={i} />
              ))
            : featured.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
        </div>
        <div className="mt-10 text-center">
          <Button href="/courses" variant="secondary">
            View all courses
          </Button>
        </div>
      </div>
    </section>
  );
}
