import express from "express";
import {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "../controllers/testimonialController.js";
import { protect, admin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getTestimonials);

// Admin routes
router.post("/", protect, admin, createTestimonial);
router.put("/:id", protect, admin, updateTestimonial);
router.delete("/:id", protect, admin, deleteTestimonial);

export default router;
