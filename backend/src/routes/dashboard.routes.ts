import { Router } from "express";
import { protect } from "../middleware/auth.js";
import {
  enrollInCourse,
  getDashboardStats,
  getMyEnrollments,
} from "../controllers/dashboard.controller.js";

const router = Router();

router.get("/stats", protect, getDashboardStats);
router.get("/enrollments", protect, getMyEnrollments);
router.post("/enroll/:id", protect, enrollInCourse);

export default router;
