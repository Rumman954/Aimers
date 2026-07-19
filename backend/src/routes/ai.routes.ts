import { Router } from "express";
import { protect } from "../middleware/auth.js";
import { aiRateLimit, generateCourse } from "../controllers/ai.controller.js";

const router = Router();

router.post("/course-content", protect, aiRateLimit, generateCourse);

export default router;
