import express from "express";
import {
  getProjects,
  getProjectBySlug,
  createProject,
  updateProject,
  deleteProject,
} from "../controllers/projectController.js";
import { protect, admin } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getProjects);
router.get("/:slug", getProjectBySlug);

// Admin routes
router.post("/", protect, admin, upload.array("images", 5), createProject);
router.put("/:id", protect, admin, upload.array("images", 5), updateProject);
router.delete("/:id", protect, admin, deleteProject);

export default router;
