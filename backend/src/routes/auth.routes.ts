import { Router } from "express";
import {
  register,
  login,
  googleAuth,
  me,
  demoCredentials,
} from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/google", googleAuth);
router.get("/me", protect, me);
router.get("/demo", demoCredentials);

export default router;
