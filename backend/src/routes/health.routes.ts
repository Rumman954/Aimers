import { Router } from "express";

const router = Router();

router.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "Aimers API is healthy",
    brand: "Aimers",
  });
});

export default router;
