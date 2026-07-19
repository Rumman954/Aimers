import type { Response, NextFunction } from "express";
import { z } from "zod";
import { Course } from "../models/Course.js";
import { Review } from "../models/Review.js";
import { Interaction } from "../models/Interaction.js";
import { AppError } from "../middleware/errorHandler.js";
import { escapeRegex, slugify } from "../utils/helpers.js";
import type { AuthRequest } from "../middleware/auth.js";

const createCourseSchema = z.object({
  title: z.string().min(3).max(120),
  shortDescription: z.string().min(10).max(300),
  fullDescription: z.string().min(20),
  price: z.coerce.number().min(0),
  category: z.string().min(2),
  level: z.enum(["Beginner", "Intermediate", "Advanced"]),
  duration: z.string().min(1),
  thumbnail: z.string().url().or(z.string().min(1)),
  images: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(["draft", "published"]).optional(),
});

const listCoursesSchema = z.object({
  search: z.string().max(120).optional().default(""),
  category: z.string().max(80).optional(),
  level: z.enum(["Beginner", "Intermediate", "Advanced"]).optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  minRating: z.coerce.number().min(0).max(5).optional(),
  sort: z
    .enum(["newest", "price_asc", "price_desc", "rating", "popular"])
    .optional()
    .default("newest"),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(48).optional().default(12),
});

function mapCourse(course: InstanceType<typeof Course>) {
  return {
    id: course.slug,
    _id: course._id.toString(),
    title: course.title,
    shortDescription: course.shortDescription,
    fullDescription: course.fullDescription,
    price: course.price,
    category: course.category,
    level: course.level,
    duration: course.duration,
    thumbnail: course.thumbnail,
    images: course.images,
    rating: course.rating,
    reviewCount: course.reviewCount,
    instructorName: course.instructorName,
    instructorId: course.instructor.toString(),
    students: course.students,
    tags: course.tags,
    status: course.status,
    createdAt: course.createdAt,
  };
}

export const listCourses = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = listCoursesSchema.parse(req.query);
    const {
      search,
      category,
      level,
      minPrice,
      maxPrice,
      minRating,
      sort,
      page,
      limit,
    } = query;

    const filter: Record<string, unknown> = { status: "published" };

    if (search.trim()) {
      const safe = escapeRegex(search.trim());
      filter.$or = [
        { title: { $regex: safe, $options: "i" } },
        { shortDescription: { $regex: safe, $options: "i" } },
        { category: { $regex: safe, $options: "i" } },
        { tags: { $regex: safe, $options: "i" } },
      ];
    }
    if (category) filter.category = category;
    if (level) filter.level = level;
    if (minPrice != null || maxPrice != null) {
      filter.price = {
        ...(minPrice != null ? { $gte: minPrice } : {}),
        ...(maxPrice != null ? { $lte: maxPrice } : {}),
      };
    }
    if (minRating != null) filter.rating = { $gte: minRating };

    const sortMap: Record<string, Record<string, 1 | -1>> = {
      newest: { createdAt: -1 },
      price_asc: { price: 1 },
      price_desc: { price: -1 },
      rating: { rating: -1 },
      popular: { students: -1 },
    };

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Course.find(filter)
        .sort(sortMap[sort] || sortMap.newest)
        .skip(skip)
        .limit(limit),
      Course.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: items.map(mapCourse),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new AppError(error.errors[0]?.message || "Invalid query", 400));
    }
    next(error);
  }
};

export const getCourse = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const course =
      (await Course.findOne({ slug: id })) ||
      (await Course.findById(id).catch(() => null));

    if (!course || course.status !== "published") {
      throw new AppError("Course not found", 404);
    }

    if (req.user) {
      await Interaction.create({
        user: req.user._id,
        course: course._id,
        type: "view",
      }).catch(() => undefined);
    }

    res.json({ success: true, data: mapCourse(course) });
  } catch (error) {
    next(error);
  }
};

export const getRelatedCourses = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const course =
      (await Course.findOne({ slug: req.params.id })) ||
      (await Course.findById(req.params.id).catch(() => null));

    if (!course) throw new AppError("Course not found", 404);

    const related = await Course.find({
      status: "published",
      category: course.category,
      _id: { $ne: course._id },
    })
      .sort({ rating: -1 })
      .limit(4);

    res.json({ success: true, data: related.map(mapCourse) });
  } catch (error) {
    next(error);
  }
};

export const createCourse = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) throw new AppError("Authentication required", 401);

    const body = createCourseSchema.parse(req.body);
    let slug = slugify(body.title);
    const existing = await Course.findOne({ slug });
    if (existing) slug = `${slug}-${Date.now().toString(36)}`;

    const course = await Course.create({
      ...body,
      slug,
      images: body.images || [body.thumbnail],
      tags: body.tags || [],
      instructor: req.user._id,
      instructorName: req.user.name,
      status: body.status || "published",
    });

    res.status(201).json({ success: true, data: mapCourse(course) });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new AppError(error.errors[0]?.message || "Invalid input", 400));
    }
    next(error);
  }
};

export const updateCourse = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) throw new AppError("Authentication required", 401);

    const course =
      (await Course.findOne({ slug: req.params.id })) ||
      (await Course.findById(req.params.id).catch(() => null));

    if (!course) throw new AppError("Course not found", 404);

    const isOwner = course.instructor.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "admin") {
      throw new AppError("You can only update your own courses", 403);
    }

    const body = createCourseSchema.partial().parse(req.body);
    Object.assign(course, body);
    await course.save();

    res.json({ success: true, data: mapCourse(course) });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new AppError(error.errors[0]?.message || "Invalid input", 400));
    }
    next(error);
  }
};

export const deleteCourse = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) throw new AppError("Authentication required", 401);

    const course =
      (await Course.findOne({ slug: req.params.id })) ||
      (await Course.findById(req.params.id).catch(() => null));

    if (!course) throw new AppError("Course not found", 404);

    const isOwner = course.instructor.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "admin") {
      throw new AppError("You can only delete your own courses", 403);
    }

    await course.deleteOne();
    await Review.deleteMany({ course: course._id });

    res.json({ success: true, message: "Course deleted" });
  } catch (error) {
    next(error);
  }
};

export const listMyCourses = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) throw new AppError("Authentication required", 401);

    const courses = await Course.find({ instructor: req.user._id }).sort({
      createdAt: -1,
    });

    res.json({ success: true, data: courses.map(mapCourse) });
  } catch (error) {
    next(error);
  }
};

export const listReviews = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const course =
      (await Course.findOne({ slug: req.params.id })) ||
      (await Course.findById(req.params.id).catch(() => null));

    if (!course) throw new AppError("Course not found", 404);

    const reviews = await Review.find({ course: course._id })
      .populate("user", "name avatar")
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({ success: true, data: reviews });
  } catch (error) {
    next(error);
  }
};

export const createReview = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) throw new AppError("Authentication required", 401);

    const schema = z.object({
      rating: z.coerce.number().min(1).max(5),
      comment: z.string().min(5).max(1000),
    });
    const body = schema.parse(req.body);

    const course =
      (await Course.findOne({ slug: req.params.id })) ||
      (await Course.findById(req.params.id).catch(() => null));

    if (!course) throw new AppError("Course not found", 404);

    const review = await Review.create({
      course: course._id,
      user: req.user._id,
      rating: body.rating,
      comment: body.comment,
    });

    const stats = await Review.aggregate([
      { $match: { course: course._id } },
      {
        $group: {
          _id: "$course",
          avg: { $avg: "$rating" },
          count: { $sum: 1 },
        },
      },
    ]);

    if (stats[0]) {
      course.rating = Math.round(stats[0].avg * 10) / 10;
      course.reviewCount = stats[0].count;
      await course.save();
    }

    res.status(201).json({ success: true, data: review });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new AppError(error.errors[0]?.message || "Invalid input", 400));
    }
    if ((error as { code?: number }).code === 11000) {
      return next(new AppError("You already reviewed this course", 409));
    }
    next(error);
  }
};
