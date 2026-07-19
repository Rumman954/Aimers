import { Router } from "express";
import { protect } from "../middleware/auth.js";
import {
  aiRateLimit,
  generateCourse,
  recommendCourses,
  recommendationFeedback,
} from "../controllers/ai.controller.js";

const router = Router();

router.post("/course-content", protect, aiRateLimit, generateCourse);
router.post("/recommend", protect, aiRateLimit, recommendCourses);
router.post("/recommend/feedback", protect, aiRateLimit, recommendationFeedback);

export default router;
