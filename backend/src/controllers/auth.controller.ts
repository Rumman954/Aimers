import type { Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { OAuth2Client } from "google-auth-library";
import { User } from "../models/User.js";
import { AppError } from "../middleware/errorHandler.js";
import { signToken } from "../utils/jwt.js";
import { env } from "../config/env.js";
import type { AuthRequest } from "../middleware/auth.js";

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(100)
  .regex(/[A-Za-z]/, "Password must include a letter")
  .regex(/[0-9]/, "Password must include a number");

const registerSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  password: passwordSchema,
  role: z.enum(["student", "instructor"]).optional().default("student"),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const googleSchema = z.object({
  credential: z.string().min(10),
});

function authResponse(user: InstanceType<typeof User>) {
  const token = signToken({
    sub: user._id.toString(),
    email: user.email,
    role: user.role,
  });

  return {
    success: true,
    token,
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    },
  };
}

export const register = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const body = registerSchema.parse(req.body);
    const exists = await User.findOne({ email: body.email.toLowerCase() });
    if (exists) {
      throw new AppError("Email is already registered", 409);
    }

    const passwordHash = await bcrypt.hash(body.password, 12);
    const user = await User.create({
      name: body.name,
      email: body.email.toLowerCase(),
      passwordHash,
      role: body.role,
    });

    res.status(201).json(authResponse(user));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new AppError(error.errors[0]?.message || "Invalid input", 400));
    }
    next(error);
  }
};

export const login = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const body = loginSchema.parse(req.body);
    const user = await User.findOne({ email: body.email.toLowerCase() });

    if (!user?.passwordHash) {
      throw new AppError("Invalid email or password", 401);
    }

    const match = await bcrypt.compare(body.password, user.passwordHash);
    if (!match) {
      throw new AppError("Invalid email or password", 401);
    }

    res.json(authResponse(user));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new AppError(error.errors[0]?.message || "Invalid input", 400));
    }
    next(error);
  }
};

export const googleAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!env.GOOGLE_CLIENT_ID) {
      throw new AppError(
        "Google login is not configured. Set GOOGLE_CLIENT_ID in the backend .env.",
        503
      );
    }

    const { credential } = googleSchema.parse(req.body);
    const client = new OAuth2Client(env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    if (!payload?.email) {
      throw new AppError("Google account email is required", 400);
    }

    let user = await User.findOne({
      $or: [{ googleId: payload.sub }, { email: payload.email.toLowerCase() }],
    });

    if (!user) {
      user = await User.create({
        name: payload.name || payload.email.split("@")[0],
        email: payload.email.toLowerCase(),
        googleId: payload.sub,
        avatar: payload.picture,
        role: "student",
      });
    } else if (!user.googleId) {
      user.googleId = payload.sub;
      if (payload.picture) user.avatar = payload.picture;
      await user.save();
    }

    res.json(authResponse(user));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new AppError(error.errors[0]?.message || "Invalid input", 400));
    }
    next(error);
  }
};

export const me = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError("Authentication required", 401);
    }

    res.json({
      success: true,
      user: {
        id: req.user._id.toString(),
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        avatar: req.user.avatar,
        preferences: req.user.preferences,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const demoCredentials = (_req: AuthRequest, res: Response) => {
  res.json({
    success: true,
    email: env.DEMO_EMAIL,
    password: env.DEMO_PASSWORD,
  });
};
