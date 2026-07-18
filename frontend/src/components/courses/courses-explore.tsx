"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Search, X } from "lucide-react";
import { CourseCard } from "@/components/courses/course-card";
import { CourseCardSkeleton } from "@/components/courses/course-card-skeleton";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { api, type CourseListResponse } from "@/lib/api";
import {
  buildCoursesQueryString,
  CATEGORIES,
  COURSES_PAGE_LIMIT,
  LEVELS,
  mapCourseApi,
  MIN_RATING_OPTIONS,
  SORT_OPTIONS,
  type CourseSort,
} from "@/lib/courses";
import { cn } from "@/lib/utils";

type CoursesExploreProps = {
  initialCategory?: string;
};

const fieldClassName =
  "w-full rounded-[var(--aimers-radius)] border border-aimers-border bg-aimers-white px-4 py-2.5 text-sm text-aimers-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aimers-gold focus-visible:ring-offset-2";

function parseSort(value: string | null): CourseSort {
  const match = SORT_OPTIONS.find((option) => option.value === value);
  return match?.value ?? "popular";
}

export function CoursesExplore({ initialCategory }: CoursesExploreProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(
    () => searchParams.get("search") || ""
  );
  const [debouncedSearch, setDebouncedSearch] = useState(
    () => searchParams.get("search") || ""
  );
  const [category, setCategory] = useState(
    () => searchParams.get("category") || initialCategory || ""
  );
  const [level, setLevel] = useState(() => searchParams.get("level") || "");
  const [minRating, setMinRating] = useState(
    () => searchParams.get("minRating") || ""
  );
  const [sort, setSort] = useState<CourseSort>(() =>
    parseSort(searchParams.get("sort"))
  );
  const [page, setPage] = useState(() =>
    Math.max(1, Number(searchParams.get("page") || "1") || 1)
  );
  const skipPageReset = useRef(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search), 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (skipPageReset.current) {
      skipPageReset.current = false;
      return;
    }
    setPage(1);
  }, [debouncedSearch, category, level, minRating, sort]);

  useEffect(() => {
    const qs = buildCoursesQueryString({
      search: debouncedSearch,
      category,
      level,
      minRating,
      sort,
      page,
      limit: COURSES_PAGE_LIMIT,
    });
    const nextUrl = qs ? `/courses?${qs}` : "/courses";
    router.replace(nextUrl, { scroll: false });
  }, [debouncedSearch, category, level, minRating, sort, page, router]);

  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: [
      "courses",
      debouncedSearch,
      category,
      level,
      minRating,
      sort,
      page,
    ],
    queryFn: async () => {
      const qs = buildCoursesQueryString({
        search: debouncedSearch,
        category,
        level,
        minRating,
        sort,
        page,
        limit: COURSES_PAGE_LIMIT,
      });
      const res = await api<CourseListResponse>(`/courses?${qs}`);
      return {
        courses: res.data.map(mapCourseApi),
        pagination: res.pagination,
      };
    },
  });

  const hasActiveFilters = Boolean(
    debouncedSearch || category || level || minRating || sort !== "popular"
  );

  const clearFilters = useCallback(() => {
    setSearch("");
    setDebouncedSearch("");
    setCategory("");
    setLevel("");
    setMinRating("");
    setSort("popular");
    setPage(1);
  }, []);

  const courses = data?.courses ?? [];
  const pagination = data?.pagination;
  const showSkeletons = isLoading || (isFetching && courses.length === 0);
  const total = pagination?.total ?? 0;
  const totalPages = pagination?.pages ?? 1;

  const pageNumbers = useMemo(() => {
    if (totalPages <= 1) return [];
    const pages: number[] = [];
    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, page + 2);
    for (let i = start; i <= end; i += 1) pages.push(i);
    return pages;
  }, [page, totalPages]);

  return (
    <main className="mx-auto max-w-7xl flex-1 px-4 py-16 md:px-6 lg:px-8">
      <SectionHeading
        align="left"
        title={category ? `${category} courses` : "Explore courses"}
        subtitle="Search, filter, and browse the live Aimers catalog."
      />

      <div className="mt-8 space-y-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-aimers-muted" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses…"
            aria-label="Search courses"
            className={cn(fieldClassName, "pl-11")}
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label htmlFor="filter-category" className="sr-only">
              Category
            </label>
            <select
              id="filter-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={fieldClassName}
            >
              <option value="">All categories</option>
              {CATEGORIES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="filter-level" className="sr-only">
              Level
            </label>
            <select
              id="filter-level"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className={fieldClassName}
            >
              <option value="">All levels</option>
              {LEVELS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="filter-rating" className="sr-only">
              Minimum rating
            </label>
            <select
              id="filter-rating"
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
              className={fieldClassName}
            >
              {MIN_RATING_OPTIONS.map((item) => (
                <option key={item.label} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="filter-sort" className="sr-only">
              Sort by
            </label>
            <select
              id="filter-sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as CourseSort)}
              className={fieldClassName}
            >
              {SORT_OPTIONS.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-aimers-muted">
            {showSkeletons
              ? "Loading results…"
              : `${total} course${total === 1 ? "" : "s"} found`}
          </p>
          {hasActiveFilters ? (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-aimers-black underline-offset-2 hover:underline"
            >
              <X className="h-4 w-4" />
              Clear filters
            </button>
          ) : null}
        </div>
      </div>

      {error ? (
        <p className="mt-8 rounded-[var(--aimers-radius)] bg-red-50 px-4 py-3 text-sm text-red-700">
          Could not load courses. Make sure the backend is running.
        </p>
      ) : null}

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {showSkeletons
          ? Array.from({ length: COURSES_PAGE_LIMIT }).map((_, index) => (
              <CourseCardSkeleton key={`skeleton-${index}`} />
            ))
          : courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
      </div>

      {!showSkeletons && !error && courses.length === 0 ? (
        <div className="mt-8 rounded-[var(--aimers-radius)] border border-aimers-border bg-aimers-surface px-6 py-10 text-center">
          <p className="font-[family-name:var(--font-space-grotesk)] text-lg font-semibold text-aimers-black">
            No courses match your filters
          </p>
          <p className="mt-2 text-sm text-aimers-muted">
            Try adjusting search or filters to see more results.
          </p>
          {hasActiveFilters ? (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="mt-4"
              onClick={clearFilters}
            >
              Clear filters
            </Button>
          ) : null}
        </div>
      ) : null}

      {totalPages > 1 && !showSkeletons ? (
        <nav
          className="mt-10 flex flex-wrap items-center justify-center gap-2"
          aria-label="Course pagination"
        >
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
          >
            Previous
          </Button>
          {pageNumbers.map((pageNumber) => (
            <button
              key={pageNumber}
              type="button"
              onClick={() => setPage(pageNumber)}
              aria-current={pageNumber === page ? "page" : undefined}
              className={cn(
                "inline-flex h-9 min-w-9 items-center justify-center rounded-[var(--aimers-radius)] px-3 text-sm font-semibold transition-colors",
                pageNumber === page
                  ? "bg-aimers-black text-aimers-white"
                  : "border border-aimers-border text-aimers-black hover:bg-aimers-surface"
              )}
            >
              {pageNumber}
            </button>
          ))}
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={page >= totalPages}
            onClick={() =>
              setPage((current) => Math.min(totalPages, current + 1))
            }
          >
            Next
          </Button>
        </nav>
      ) : null}
    </main>
  );
}
