import { Router } from "express";

const router = Router();

// Phase 1: list, get, create, update, delete
router.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "Course routes ready — implement in Phase 1",
    endpoints: [
      "GET /api/courses",
      "GET /api/courses/:id",
      "POST /api/courses",
      "PATCH /api/courses/:id",
      "DELETE /api/courses/:id",
    ],
  });
});

export default router;
