import Project from "../models/Project.js";
import cloudinary from "../config/cloudinary.js";
import logger from "../utils/logger.js";
import validateObjectId from "../utils/validateObjectId.js";
import slugify from "slugify";
import mongoose from "mongoose";
import fs from "fs";

const createUniqueSlug = async (value, excludeId = null) => {
  const base =
    slugify(value || "project", { lower: true, strict: true, trim: true }) ||
    "project";
  let slug = base;
  let counter = 2;

  // Ensure uniqueness by appending a counter when needed
  while (
    await Project.findOne({
      slug,
      ...(excludeId ? { _id: { $ne: excludeId } } : {}),
    })
  ) {
    slug = `${base}-${counter}`;
    counter += 1;
  }

  return slug;
};

const uploadToCloudinary = async (filePath, folder) => {
  const result = await cloudinary.uploader.upload(filePath, { folder });
  fs.unlink(filePath, () => {});
  return { public_id: result.public_id, url: result.secure_url };
};

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
    const idOrSlug = req.params.slug;
    const project = mongoose.Types.ObjectId.isValid(idOrSlug)
      ? await Project.findById(idOrSlug)
      : await Project.findOne({ slug: idOrSlug });

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
    const projectData = { ...req.body };
    const slugSource = projectData.slug || projectData.title;
    projectData.slug = await createUniqueSlug(slugSource);

    if (typeof projectData.technologies === "string") {
      projectData.technologies = projectData.technologies
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
    }

    const images = [];
    const imageUrls = projectData.imageUrls || projectData.imagesUrl || "";
    if (imageUrls) {
      const urls = Array.isArray(imageUrls) ? imageUrls : imageUrls.split(",");
      urls
        .map((u) => u.trim())
        .filter(Boolean)
        .forEach((url) => images.push({ url }));
    }

    if (req.files?.images?.length) {
      for (const file of req.files.images) {
        const uploaded = await uploadToCloudinary(
          file.path,
          "portfolio/projects"
        );
        images.push(uploaded);
      }
    }

    if (images.length > 0) {
      projectData.images = images;
    }

    if (req.files?.thumbnail?.length) {
      const uploadedThumb = await uploadToCloudinary(
        req.files.thumbnail[0].path,
        "portfolio/projects"
      );
      projectData.thumbnail = uploadedThumb;
    } else if (projectData.thumbnailUrl || projectData.thumbnail) {
      const url = projectData.thumbnailUrl || projectData.thumbnail;
      projectData.thumbnail = { url };
    }

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

    const updateData = { ...req.body };
    if (updateData.slug || updateData.title) {
      const slugSource = updateData.slug || updateData.title;
      updateData.slug = await createUniqueSlug(slugSource, req.params.id);
    }

    if (typeof updateData.technologies === "string") {
      updateData.technologies = updateData.technologies
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
    }

    const existing = await Project.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ message: "Project not found" });
    }

    const images = [...(existing.images || [])];
    const imageUrls = updateData.imageUrls || updateData.imagesUrl || "";
    if (imageUrls) {
      const urls = Array.isArray(imageUrls) ? imageUrls : imageUrls.split(",");
      urls
        .map((u) => u.trim())
        .filter(Boolean)
        .forEach((url) => images.push({ url }));
    }

    if (req.files?.images?.length) {
      for (const file of req.files.images) {
        const uploaded = await uploadToCloudinary(
          file.path,
          "portfolio/projects"
        );
        images.push(uploaded);
      }
    }

    if (images.length > 0) {
      updateData.images = images;
    }

    if (req.files?.thumbnail?.length) {
      const uploadedThumb = await uploadToCloudinary(
        req.files.thumbnail[0].path,
        "portfolio/projects"
      );
      updateData.thumbnail = uploadedThumb;
    } else if (updateData.thumbnailUrl || updateData.thumbnail) {
      const url = updateData.thumbnailUrl || updateData.thumbnail;
      updateData.thumbnail = { url };
    }

    const project = await Project.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

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
    if (project.thumbnail?.public_id) {
      await cloudinary.uploader.destroy(project.thumbnail.public_id);
    }

    await project.deleteOne();

    res.json({ success: true, message: "Project deleted successfully" });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};
