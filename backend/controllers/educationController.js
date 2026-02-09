import Education from "../models/Education.js";
import logger from "../utils/logger.js";
import validateObjectId from "../utils/validateObjectId.js";

// @desc    Get all education records (public)
// @route   GET /api/education
// @access  Public
export const getEducation = async (req, res, next) => {
  try {
    const education = await Education.find().sort({ order: 1, startYear: -1 });

    res.json({
      success: true,
      count: education.length,
      data: education,
    });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

// @desc    Create new education record
// @route   POST /api/education
// @access  Private/Admin
export const createEducation = async (req, res, next) => {
  try {
    const education = await Education.create(req.body);

    res.status(201).json({ success: true, data: education });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

// @desc    Update education record
// @route   PUT /api/education/:id
// @access  Private/Admin
export const updateEducation = async (req, res, next) => {
  try {
    validateObjectId(req.params.id);

    const education = await Education.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!education) {
      return res.status(404).json({ message: "Education record not found" });
    }

    res.json({ success: true, data: education });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

// @desc    Delete education record
// @route   DELETE /api/education/:id
// @access  Private/Admin
export const deleteEducation = async (req, res, next) => {
  try {
    validateObjectId(req.params.id);

    const education = await Education.findById(req.params.id);
    if (!education) {
      return res.status(404).json({ message: "Education record not found" });
    }

    await education.deleteOne();

    res.json({ success: true, message: "Education record deleted successfully" });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};
