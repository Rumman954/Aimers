export type CourseLevel = "Beginner" | "Intermediate" | "Advanced";

export interface Course {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription?: string;
  price: number;
  category: string;
  level: CourseLevel;
  duration: string;
  thumbnail: string;
  rating: number;
  reviewCount: number;
  instructorName: string;
  students?: number;
}
