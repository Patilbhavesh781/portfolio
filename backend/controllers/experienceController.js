import Experience from "../models/Experience.js";
import logger from "../utils/logger.js";
import validateObjectId from "../utils/validateObjectId.js";

// @desc    Get all experiences (public)
// @route   GET /api/experiences
// @access  Public
export const getExperiences = async (req, res, next) => {
  try {
    const experiences = await Experience.find().sort({ order: 1, startDate: -1 });

    res.json({
      success: true,
      count: experiences.length,
      data: experiences,
    });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

// @desc    Create new experience
// @route   POST /api/experiences
// @access  Private/Admin
export const createExperience = async (req, res, next) => {
  try {
    const experience = await Experience.create(req.body);

    res.status(201).json({ success: true, data: experience });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

// @desc    Update experience
// @route   PUT /api/experiences/:id
// @access  Private/Admin
export const updateExperience = async (req, res, next) => {
  try {
    validateObjectId(req.params.id);

    const experience = await Experience.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!experience) {
      return res.status(404).json({ message: "Experience not found" });
    }

    res.json({ success: true, data: experience });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

// @desc    Delete experience
// @route   DELETE /api/experiences/:id
// @access  Private/Admin
export const deleteExperience = async (req, res, next) => {
  try {
    validateObjectId(req.params.id);

    const experience = await Experience.findById(req.params.id);
    if (!experience) {
      return res.status(404).json({ message: "Experience not found" });
    }

    await experience.deleteOne();

    res.json({ success: true, message: "Experience deleted successfully" });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};
