import express from "express";
import {
  getExperiences,
  createExperience,
  updateExperience,
  deleteExperience,
} from "../controllers/experienceController.js";
import { protect, admin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getExperiences);

// Admin routes
router.post("/", protect, admin, createExperience);
router.put("/:id", protect, admin, updateExperience);
router.delete("/:id", protect, admin, deleteExperience);

export default router;
