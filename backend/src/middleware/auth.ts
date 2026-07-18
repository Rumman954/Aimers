import type { NextFunction, Request, Response } from "express";
import { AppError } from "./errorHandler.js";
import { verifyToken, type JwtPayload } from "../utils/jwt.js";
import { User, type IUser, type UserRole } from "../models/User.js";

export type AuthRequest = Request & {
  user?: IUser;
  auth?: JwtPayload;
};

export const protect = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) => {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      throw new AppError("Authentication required", 401);
    }

    const token = header.slice(7);
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.sub);

    if (!user) {
      throw new AppError("User no longer exists", 401);
    }

    req.user = user;
    req.auth = decoded;
    next();
  } catch (error) {
    if (error instanceof AppError) return next(error);
    next(new AppError("Invalid or expired token", 401));
  }
};

export const restrictTo =
  (...roles: UserRole[]) =>
  (req: AuthRequest, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError("You do not have permission for this action", 403));
    }
    next();
  };
