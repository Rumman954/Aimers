import type { CourseApi } from "@/lib/api";
import type { Course, CourseLevel } from "@/types/course";

export const CATEGORIES = [
  "Programming",
  "Data Science",
  "Design",
  "Business",
  "Exam Prep",
] as const;

export type CourseCategory = (typeof CATEGORIES)[number];

export const LEVELS: CourseLevel[] = ["Beginner", "Intermediate", "Advanced"];

export const SORT_OPTIONS = [
  { value: "popular", label: "Most popular" },
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
  { value: "rating", label: "Highest rated" },
] as const;

export type CourseSort = (typeof SORT_OPTIONS)[number]["value"];

export const MIN_RATING_OPTIONS = [
  { value: "", label: "Any rating" },
  { value: "3", label: "3+ stars" },
  { value: "4", label: "4+ stars" },
  { value: "4.5", label: "4.5+ stars" },
] as const;

export const COURSES_PAGE_LIMIT = 8;

export function mapCourseApi(item: CourseApi): Course {
  return {
    id: item.id || item._id || "",
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

export type CoursesQueryParams = {
  search?: string;
  category?: string;
  level?: string;
  minRating?: string;
  sort?: CourseSort;
  page?: number;
  limit?: number;
};

export function buildCoursesQueryString(params: CoursesQueryParams): string {
  const sp = new URLSearchParams();
  if (params.search?.trim()) sp.set("search", params.search.trim());
  if (params.category) sp.set("category", params.category);
  if (params.level) sp.set("level", params.level);
  if (params.minRating) sp.set("minRating", params.minRating);
  if (params.sort) sp.set("sort", params.sort);
  if (params.page && params.page > 1) sp.set("page", String(params.page));
  sp.set("limit", String(params.limit ?? COURSES_PAGE_LIMIT));
  return sp.toString();
}
