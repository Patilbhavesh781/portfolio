import express from "express";
import {
  getStats,
  getAnalyticsOverview,
  trackPageView,
  trackVisitor,
  updateStats,
} from "../controllers/statsController.js";
import { protect, admin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public route
router.get("/", getStats);
router.post("/visit", trackVisitor);
router.post("/track", trackPageView);
router.get("/analytics", protect, admin, getAnalyticsOverview);

// Admin route
router.put("/", protect, admin, updateStats);

export default router;
