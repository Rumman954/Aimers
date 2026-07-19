import type { Response, NextFunction } from "express";
import { z } from "zod";
import rateLimit from "express-rate-limit";
import { AppError } from "../middleware/errorHandler.js";
import type { AuthRequest } from "../middleware/auth.js";
import { generateCourseContent } from "../services/ai.service.js";

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
