import express from "express";
import {
  getStats,
  updateStats,
} from "../controllers/statsController.js";
import { protect, admin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public route
router.get("/", getStats);

// Admin route
router.put("/", protect, admin, updateStats);

export default router;
