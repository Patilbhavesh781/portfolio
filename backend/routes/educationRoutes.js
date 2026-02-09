import express from "express";
import {
  getEducation,
  createEducation,
  updateEducation,
  deleteEducation,
} from "../controllers/educationController.js";
import { protect, admin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getEducation);

// Admin routes
router.post("/", protect, admin, createEducation);
router.put("/:id", protect, admin, updateEducation);
router.delete("/:id", protect, admin, deleteEducation);

export default router;
