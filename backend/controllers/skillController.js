import Skill from "../models/Skill.js";
import logger from "../utils/logger.js";
import validateObjectId from "../utils/validateObjectId.js";

// @desc    Get all skills (public)
// @route   GET /api/skills
// @access  Public
export const getSkills = async (req, res, next) => {
  try {
    const { category, featured } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (featured) filter.isFeatured = featured === "true";

    const skills = await Skill.find(filter).sort({ order: 1, createdAt: -1 });

    res.json({
      success: true,
      count: skills.length,
      data: skills,
    });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

// @desc    Create new skill
// @route   POST /api/skills
// @access  Private/Admin
export const createSkill = async (req, res, next) => {
  try {
    const skill = await Skill.create(req.body);

    res.status(201).json({ success: true, data: skill });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

// @desc    Update skill
// @route   PUT /api/skills/:id
// @access  Private/Admin
export const updateSkill = async (req, res, next) => {
  try {
    validateObjectId(req.params.id);

    const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!skill) {
      return res.status(404).json({ message: "Skill not found" });
    }

    res.json({ success: true, data: skill });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

// @desc    Delete skill
// @route   DELETE /api/skills/:id
// @access  Private/Admin
export const deleteSkill = async (req, res, next) => {
  try {
    validateObjectId(req.params.id);

    const skill = await Skill.findById(req.params.id);
    if (!skill) {
      return res.status(404).json({ message: "Skill not found" });
    }

    await skill.deleteOne();

    res.json({ success: true, message: "Skill deleted successfully" });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};
