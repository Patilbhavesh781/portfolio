import express from "express";
import {
  getBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
} from "../controllers/blogController.js";
import { protect, admin } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getBlogs);
router.get("/:slug", getBlogBySlug);

// Admin routes
router.post("/", protect, admin, upload.single("coverImage"), createBlog);
router.put("/:id", protect, admin, upload.single("coverImage"), updateBlog);
router.delete("/:id", protect, admin, deleteBlog);

export default router;
