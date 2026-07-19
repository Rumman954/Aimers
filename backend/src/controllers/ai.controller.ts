import type { Response, NextFunction } from "express";
import { z } from "zod";
import rateLimit from "express-rate-limit";
import { AppError } from "../middleware/errorHandler.js";
import type { AuthRequest } from "../middleware/auth.js";
import {
  generateCourseContent,
  generateRecommendations,
} from "../services/ai.service.js";
import { Course } from "../models/Course.js";
import { Enrollment } from "../models/Enrollment.js";
import { Interaction } from "../models/Interaction.js";

export const aiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 40,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many AI requests. Please try again later.",
  },
});

const generateSchema = z.object({
  topic: z.string().min(3).max(120),
  audience: z.string().min(3).max(120),
  level: z.enum(["Beginner", "Intermediate", "Advanced"]),
  moduleCount: z.coerce.number().int().min(3).max(12).default(5),
  tone: z.string().min(2).max(40).default("clear and motivating"),
  length: z.enum(["short", "medium", "long"]).default("medium"),
  regenerate: z.boolean().optional().default(false),
});

const recommendSchema = z.object({
  interests: z.array(z.string()).optional(),
  skills: z.array(z.string()).optional(),
  level: z.enum(["Beginner", "Intermediate", "Advanced"]).optional(),
  maxBudget: z.coerce.number().min(0).optional(),
  preferredDuration: z.string().optional(),
  category: z.string().optional(),
});

const feedbackSchema = z.object({
  courseId: z.string().min(1),
  action: z.enum(["like", "dislike"]),
});

export const generateCourse = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) throw new AppError("Authentication required", 401);

    const body = generateSchema.parse(req.body);
    const result = await generateCourseContent(body);

    res.json({
      success: true,
      provider: result.provider,
      offline: result.provider === "offline",
      message:
        result.provider === "offline"
          ? "Generated with Aimers offline template. Add OPENAI_API_KEY or GEMINI_API_KEY for live LLM output."
          : `Generated with ${result.provider}`,
      data: result.content,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new AppError(error.errors[0]?.message || "Invalid input", 400));
    }
    next(
      error instanceof Error
        ? new AppError(error.message || "AI generation failed", 502)
        : error
    );
  }
};

export const recommendCourses = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) throw new AppError("Authentication required", 401);
    const body = recommendSchema.parse(req.body);

    const prefs = req.user.preferences || {
      interests: [],
      likedCourseSlugs: [],
      dislikedCourseSlugs: [],
    };

    const interests = [
      ...(body.interests || []),
      ...(prefs.interests || []),
    ].filter(Boolean);

    const filter: Record<string, unknown> = { status: "published" };
    if (body.category) filter.category = body.category;
    if (body.level || prefs.level) filter.level = body.level || prefs.level;
    if (body.maxBudget != null || prefs.maxBudget != null) {
      filter.price = {
        $lte: body.maxBudget ?? prefs.maxBudget,
      };
    }

    const disliked = new Set(prefs.dislikedCourseSlugs || []);
    const courses = await Course.find(filter).sort({ rating: -1 }).limit(40);

    const [enrollments, views] = await Promise.all([
      Enrollment.find({ user: req.user._id }).populate("course"),
      Interaction.find({ user: req.user._id, type: "view" })
        .sort({ createdAt: -1 })
        .limit(20)
        .populate("course"),
    ]);

    const enrolledSlugs = enrollments
      .map((e) => {
        const c = e.course as unknown as { slug?: string } | null;
        return c?.slug;
      })
      .filter(Boolean) as string[];

    const recentViews = views
      .map((v) => {
        const c = v.course as unknown as { slug?: string } | null;
        return c?.slug;
      })
      .filter(Boolean) as string[];

    const candidates = courses
      .filter((c) => !disliked.has(c.slug) && !enrolledSlugs.includes(c.slug))
      .map((c) => ({
        id: c.slug,
        title: c.title,
        shortDescription: c.shortDescription,
        category: c.category,
        level: c.level,
        price: c.price,
        duration: c.duration,
        rating: c.rating,
        tags: c.tags || [],
        students: c.students,
      }));

    // Persist refinement preferences for continuous improvement
    if (!req.user.preferences) {
      req.user.preferences = {
        interests: [],
        likedCourseSlugs: [],
        dislikedCourseSlugs: [],
      };
    }
    if (body.interests?.length) {
      const merged = Array.from(
        new Set([...(prefs.interests || []), ...body.interests])
      ).slice(0, 20);
      req.user.preferences.interests = merged;
    }
    if (body.level) req.user.preferences.level = body.level;
    if (body.maxBudget != null) req.user.preferences.maxBudget = body.maxBudget;
    await req.user.save();

    const { result, provider } = await generateRecommendations({
      interests: Array.from(new Set(interests)),
      level: body.level || prefs.level,
      maxBudget: body.maxBudget ?? prefs.maxBudget,
      skills: body.skills || [],
      preferredDuration: body.preferredDuration,
      likedCourseSlugs: prefs.likedCourseSlugs || [],
      dislikedCourseSlugs: prefs.dislikedCourseSlugs || [],
      recentViews,
      enrolled: enrolledSlugs,
      candidates,
    });

    const byId = new Map(candidates.map((c) => [c.id, c]));
    const enriched = result.recommendations
      .map((item) => {
        const course = byId.get(item.courseId);
        if (!course) return null;
        return {
          ...item,
          course,
        };
      })
      .filter(Boolean);

    res.json({
      success: true,
      provider,
      offline: provider === "offline",
      message:
        provider === "offline"
          ? "Ranked with Aimers Pathfinder offline engine. Add an AI key for LLM reasoning."
          : `Ranked with ${provider}`,
      data: {
        ...result,
        recommendations: enriched,
      },
      context: {
        interests: Array.from(new Set(interests)),
        level: body.level || prefs.level || null,
        maxBudget: body.maxBudget ?? prefs.maxBudget ?? null,
        enrolledCount: enrolledSlugs.length,
        viewedCount: recentViews.length,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new AppError(error.errors[0]?.message || "Invalid input", 400));
    }
    next(
      error instanceof Error
        ? new AppError(error.message || "Recommendation failed", 502)
        : error
    );
  }
};

export const recommendationFeedback = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) throw new AppError("Authentication required", 401);
    const body = feedbackSchema.parse(req.body);

    if (!req.user.preferences) {
      req.user.preferences = {
        interests: [],
        likedCourseSlugs: [],
        dislikedCourseSlugs: [],
      };
    }

    const prefs = req.user.preferences;
    const liked = new Set(prefs.likedCourseSlugs || []);
    const disliked = new Set(prefs.dislikedCourseSlugs || []);

    if (body.action === "like") {
      liked.add(body.courseId);
      disliked.delete(body.courseId);
      const course = await Course.findOne({ slug: body.courseId });
      if (
        course?.category &&
        !(prefs.interests || []).includes(course.category)
      ) {
        prefs.interests = [...(prefs.interests || []), course.category].slice(
          0,
          20
        );
      }
    } else {
      disliked.add(body.courseId);
      liked.delete(body.courseId);
    }

    req.user.preferences.likedCourseSlugs = Array.from(liked).slice(0, 50);
    req.user.preferences.dislikedCourseSlugs = Array.from(disliked).slice(0, 50);
    req.user.preferences.interests = prefs.interests || [];
    await req.user.save();

    res.json({
      success: true,
      message:
        body.action === "like"
          ? "Saved. Future recommendations will prefer similar courses."
          : "Saved. We'll show fewer courses like this.",
      preferences: req.user.preferences,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new AppError(error.errors[0]?.message || "Invalid input", 400));
    }
    next(error);
  }
};
