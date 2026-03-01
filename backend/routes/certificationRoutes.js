import express from "express";
import {
  getCertifications,
  createCertification,
  updateCertification,
  deleteCertification,
} from "../controllers/certificationController.js";
import { protect, admin } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getCertifications);

// Admin routes
router.post("/", protect, admin, upload.single("logo"), createCertification);
router.put("/:id", protect, admin, upload.single("logo"), updateCertification);
router.delete("/:id", protect, admin, deleteCertification);

export default router;
