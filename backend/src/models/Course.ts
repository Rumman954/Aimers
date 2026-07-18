import mongoose, { Schema, type Document, type Model, type Types } from "mongoose";

export type CourseLevel = "Beginner" | "Intermediate" | "Advanced";
export type CourseStatus = "draft" | "published";

export interface ICourse extends Document {
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  price: number;
  category: string;
  level: CourseLevel;
  duration: string;
  thumbnail: string;
  images: string[];
  rating: number;
  reviewCount: number;
  instructor: Types.ObjectId;
  instructorName: string;
  tags: string[];
  students: number;
  status: CourseStatus;
  createdAt: Date;
  updatedAt: Date;
}

const courseSchema = new Schema<ICourse>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    shortDescription: { type: String, required: true },
    fullDescription: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, index: true },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      required: true,
    },
    duration: { type: String, required: true },
    thumbnail: { type: String, required: true },
    images: { type: [String], default: [] },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    instructor: { type: Schema.Types.ObjectId, ref: "User", required: true },
    instructorName: { type: String, required: true },
    tags: { type: [String], default: [] },
    students: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "published",
    },
  },
  { timestamps: true }
);

courseSchema.index({ title: "text", shortDescription: "text", category: "text" });

export const Course: Model<ICourse> =
  mongoose.models.Course || mongoose.model<ICourse>("Course", courseSchema);
