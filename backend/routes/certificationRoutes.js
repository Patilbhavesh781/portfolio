import express from "express";
import {
  getCertifications,
  createCertification,
  updateCertification,
  deleteCertification,
} from "../controllers/certificationController.js";
import { protect, admin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getCertifications);

// Admin routes
router.post("/", protect, admin, createCertification);
router.put("/:id", protect, admin, updateCertification);
router.delete("/:id", protect, admin, deleteCertification);

export default router;
