import Certification from "../models/Certification.js";
import logger from "../utils/logger.js";
import validateObjectId from "../utils/validateObjectId.js";

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
    const certification = await Certification.create(req.body);

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

    const certification = await Certification.findByIdAndUpdate(req.params.id, req.body, {
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

    await certification.deleteOne();

    res.json({ success: true, message: "Certification deleted successfully" });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};
