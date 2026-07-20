import { Router } from "express";
import rateLimit from "express-rate-limit";
import {
  submitContact,
  subscribeNewsletter,
} from "../controllers/contact.controller.js";

const router = Router();

const contactRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});

router.post("/contact", contactRateLimit, submitContact);
router.post("/newsletter", contactRateLimit, subscribeNewsletter);

export default router;
