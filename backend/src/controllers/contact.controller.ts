import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { AppError } from "../middleware/errorHandler.js";
import { ContactMessage } from "../models/ContactMessage.js";
import { NewsletterSubscriber } from "../models/NewsletterSubscriber.js";

const contactSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  message: z.string().min(10).max(2000),
});

const newsletterSchema = z.object({
  email: z.string().email(),
});

export const submitContact = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const body = contactSchema.parse(req.body);
    await ContactMessage.create(body);
    res.status(201).json({
      success: true,
      message: "Message received. We will reply within one business day.",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new AppError(error.errors[0]?.message || "Invalid input", 400));
    }
    next(error);
  }
};

export const subscribeNewsletter = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const body = newsletterSchema.parse(req.body);
    await NewsletterSubscriber.findOneAndUpdate(
      { email: body.email },
      { email: body.email },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.status(201).json({
      success: true,
      message: "You are subscribed to Aimers updates.",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new AppError(error.errors[0]?.message || "Invalid email", 400));
    }
    next(error);
  }
};
