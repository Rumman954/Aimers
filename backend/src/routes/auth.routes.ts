import { Router } from "express";

const router = Router();

// Phase 1: register, login, google, me
router.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "Auth routes ready — implement in Phase 1",
    endpoints: [
      "POST /api/auth/register",
      "POST /api/auth/login",
      "POST /api/auth/google",
      "GET /api/auth/me",
    ],
  });
});

export default router;
