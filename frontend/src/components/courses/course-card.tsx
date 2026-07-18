"use client";

import Link from "next/link";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Course } from "@/types/course";
import { CourseImage } from "@/components/courses/course-image";

type CourseCardProps = {
  course: Course;
  className?: string;
};

export function CourseCard({ course, className }: CourseCardProps) {
  return (
    <article
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-[var(--aimers-radius)] border border-aimers-border bg-aimers-white transition-shadow hover:shadow-md",
        className
      )}
    >
      <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-aimers-surface">
        <CourseImage
          src={course.thumbnail}
          alt={course.title}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
      </div>

      <div className="flex flex-1 flex-col p-4 md:p-5">
        <span className="text-xs font-medium uppercase tracking-wide text-aimers-gold">
          {course.level}
        </span>
        <h3 className="mt-1 font-[family-name:var(--font-space-grotesk)] text-base font-semibold leading-snug text-aimers-black md:text-lg">
          {course.title}
        </h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm text-aimers-muted">
          {course.shortDescription}
        </p>

        <div className="mt-4 flex items-center justify-between gap-2 border-t border-aimers-border pt-4">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-aimers-black">
              ${course.price}
            </span>
            <div className="flex items-center gap-1 text-xs text-aimers-muted">
              <Star className="h-3.5 w-3.5 fill-aimers-gold text-aimers-gold" />
              <span>{course.rating}</span>
              <span>({course.reviewCount})</span>
            </div>
          </div>
        </div>

        <Link
          href={`/courses/${course.id}`}
          className="mt-4 inline-flex w-full items-center justify-center rounded-[var(--aimers-radius)] border border-aimers-black px-4 py-2 text-sm font-semibold text-aimers-black transition hover:bg-aimers-black hover:text-aimers-white"
        >
          View Details
        </Link>
      </div>
    </article>
  );
}
