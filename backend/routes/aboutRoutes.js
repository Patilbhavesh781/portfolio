import express from "express";
import { getAbout, updateAbout } from "../controllers/aboutController.js";
import { protect, admin } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

// Public route
router.get("/", getAbout);

// Admin route
router.put("/", protect, admin, upload.single("profileImage"), updateAbout);

export default router;
