import Certification from "../models/Certification.js";
import logger from "../utils/logger.js";
import validateObjectId from "../utils/validateObjectId.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

const uploadToCloudinary = async (filePath, folder) => {
  const result = await cloudinary.uploader.upload(filePath, { folder });
  fs.unlink(filePath, () => {});
  return { public_id: result.public_id, url: result.secure_url };
};

// @desc    Get all certifications (public)
// @route   GET /api/certifications
// @access  Public
export const getCertifications = async (req, res, next) => {
  try {
    const certifications = await Certification.find().sort({ order: 1, issueDate: -1 });

    res.json({
      success: true,
      count: certifications.length,
      data: certifications,
    });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

// @desc    Create new certification
// @route   POST /api/certifications
// @access  Private/Admin
export const createCertification = async (req, res, next) => {
  try {
    const data = { ...req.body };

    if (req.file) {
      data.logo = await uploadToCloudinary(
        req.file.path,
        "portfolio/certifications"
      );
    } else if (data.logoUrl) {
      data.logo = { url: data.logoUrl };
    }

    const certification = await Certification.create(data);

    res.status(201).json({ success: true, data: certification });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

// @desc    Update certification
// @route   PUT /api/certifications/:id
// @access  Private/Admin
export const updateCertification = async (req, res, next) => {
  try {
    validateObjectId(req.params.id);

    const data = { ...req.body };

    if (req.file) {
      data.logo = await uploadToCloudinary(
        req.file.path,
        "portfolio/certifications"
      );
    } else if (data.logoUrl) {
      data.logo = { url: data.logoUrl };
    }

    const certification = await Certification.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true,
    });

    if (!certification) {
      return res.status(404).json({ message: "Certification not found" });
    }

    res.json({ success: true, data: certification });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

// @desc    Delete certification
// @route   DELETE /api/certifications/:id
// @access  Private/Admin
export const deleteCertification = async (req, res, next) => {
  try {
    validateObjectId(req.params.id);

    const certification = await Certification.findById(req.params.id);
    if (!certification) {
      return res.status(404).json({ message: "Certification not found" });
    }

    if (certification.logo?.public_id) {
      await cloudinary.uploader.destroy(certification.logo.public_id);
    }

    await certification.deleteOne();

    res.json({ success: true, message: "Certification deleted successfully" });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};
