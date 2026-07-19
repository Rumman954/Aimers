import { Router } from "express";
import rateLimit from "express-rate-limit";
import {
  register,
  login,
  googleAuth,
  me,
  demoCredentials,
} from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.js";
import { env } from "../config/env.js";

const router = Router();

const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many auth attempts. Please try again later.",
  },
});

router.post("/register", authRateLimit, register);
router.post("/login", authRateLimit, login);
router.post("/google", authRateLimit, googleAuth);
router.get("/me", protect, me);

if (env.NODE_ENV !== "production") {
  router.get("/demo", demoCredentials);
}

export default router;
