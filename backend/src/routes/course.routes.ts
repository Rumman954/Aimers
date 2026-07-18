import { Router } from "express";
import {
  listCourses,
  getCourse,
  getRelatedCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  listMyCourses,
  listReviews,
  createReview,
} from "../controllers/course.controller.js";
import { protect, restrictTo } from "../middleware/auth.js";

const router = Router();

router.get("/", listCourses);
router.get("/mine/list", protect, listMyCourses);
router.get("/:id", getCourse);
router.get("/:id/related", getRelatedCourses);
router.get("/:id/reviews", listReviews);

router.post(
  "/",
  protect,
  restrictTo("instructor", "admin"),
  createCourse
);
router.patch("/:id", protect, updateCourse);
router.delete("/:id", protect, deleteCourse);
router.post("/:id/reviews", protect, createReview);

export default router;
