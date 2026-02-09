import express from "express";
import {
  sendContactMessage,
  getContactMessages,
  markMessageAsRead,
  deleteContactMessage,
} from "../controllers/contactController.js";
import { protect, admin } from "../middlewares/authMiddleware.js";
import rateLimiter from "../middlewares/rateLimiter.js";

const router = express.Router();

// Public route (rate-limited)
router.post("/", rateLimiter, sendContactMessage);

// Admin routes
router.get("/", protect, admin, getContactMessages);
router.put("/:id/read", protect, admin, markMessageAsRead);
router.delete("/:id", protect, admin, deleteContactMessage);

export default router;
