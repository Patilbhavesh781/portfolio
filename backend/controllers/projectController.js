import Project from "../models/Project.js";
import cloudinary from "../config/cloudinary.js";
import logger from "../utils/logger.js";
import validateObjectId from "../utils/validateObjectId.js";

// @desc    Get all projects (public)
// @route   GET /api/projects
// @access  Public
export const getProjects = async (req, res, next) => {
  try {
    const { featured, category, status } = req.query;

    const filter = {};
    if (featured) filter.isFeatured = featured === "true";
    if (category) filter.category = category;
    if (status) filter.status = status;

    const projects = await Project.find(filter).sort({ order: 1, createdAt: -1 });

    res.json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

// @desc    Get single project by slug
// @route   GET /api/projects/:slug
// @access  Public
export const getProjectBySlug = async (req, res, next) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json({ success: true, data: project });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

// @desc    Create new project
// @route   POST /api/projects
// @access  Private/Admin
export const createProject = async (req, res, next) => {
  try {
    const projectData = req.body;

    const project = await Project.create(projectData);

    res.status(201).json({ success: true, data: project });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private/Admin
export const updateProject = async (req, res, next) => {
  try {
    validateObjectId(req.params.id);

    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json({ success: true, data: project });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
export const deleteProject = async (req, res, next) => {
  try {
    validateObjectId(req.params.id);

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Delete images from Cloudinary if exist
    if (project.images && project.images.length > 0) {
      for (const image of project.images) {
        if (image.public_id) {
          await cloudinary.uploader.destroy(image.public_id);
        }
      }
    }

    await project.deleteOne();

    res.json({ success: true, message: "Project deleted successfully" });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};
