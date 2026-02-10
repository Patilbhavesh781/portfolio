import Blog from "../models/Blog.js";
import cloudinary from "../config/cloudinary.js";
import logger from "../utils/logger.js";
import validateObjectId from "../utils/validateObjectId.js";
import slugify from "slugify";
import mongoose from "mongoose";
import fs from "fs";

const createUniqueSlug = async (value, excludeId = null) => {
  const base =
    slugify(value || "blog", { lower: true, strict: true, trim: true }) ||
    "blog";
  let slug = base;
  let counter = 2;

  while (
    await Blog.findOne({
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

// @desc    Get all blogs (public)
// @route   GET /api/blogs
// @access  Public
export const getBlogs = async (req, res, next) => {
  try {
    const { featured, status, tag } = req.query;

    const filter = {};
    if (featured) filter.isFeatured = featured === "true";
    if (status) filter.status = status;
    if (tag) filter.tags = { $in: [tag] };

    const blogs = await Blog.find(filter).sort({ publishedAt: -1, createdAt: -1 });

    res.json({
      success: true,
      count: blogs.length,
      data: blogs,
    });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

// @desc    Get single blog by slug
// @route   GET /api/blogs/:slug
// @access  Public
export const getBlogBySlug = async (req, res, next) => {
  try {
    const idOrSlug = req.params.slug;
    const blog = mongoose.Types.ObjectId.isValid(idOrSlug)
      ? await Blog.findById(idOrSlug)
      : await Blog.findOne({ slug: idOrSlug });

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Increment view count
    blog.views += 1;
    await blog.save();

    res.json({ success: true, data: blog });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

// @desc    Create new blog
// @route   POST /api/blogs
// @access  Private/Admin
export const createBlog = async (req, res, next) => {
  try {
    const blogData = { ...req.body };
    const slugSource = blogData.slug || blogData.title;
    blogData.slug = await createUniqueSlug(slugSource);

    if (typeof blogData.tags === "string") {
      blogData.tags = blogData.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
    }

    if (req.file) {
      blogData.coverImage = await uploadToCloudinary(
        req.file.path,
        "portfolio/blogs"
      );
    } else if (blogData.coverImageUrl || blogData.thumbnail) {
      const url = blogData.coverImageUrl || blogData.thumbnail;
      blogData.coverImage = { url };
    }

    const blog = await Blog.create(blogData);

    res.status(201).json({ success: true, data: blog });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

// @desc    Update blog
// @route   PUT /api/blogs/:id
// @access  Private/Admin
export const updateBlog = async (req, res, next) => {
  try {
    validateObjectId(req.params.id);

    const updateData = { ...req.body };
    if (updateData.slug || updateData.title) {
      const slugSource = updateData.slug || updateData.title;
      updateData.slug = await createUniqueSlug(slugSource, req.params.id);
    }

    if (typeof updateData.tags === "string") {
      updateData.tags = updateData.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
    }

    if (req.file) {
      updateData.coverImage = await uploadToCloudinary(
        req.file.path,
        "portfolio/blogs"
      );
    } else if (updateData.coverImageUrl || updateData.thumbnail) {
      const url = updateData.coverImageUrl || updateData.thumbnail;
      updateData.coverImage = { url };
    }

    const blog = await Blog.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.json({ success: true, data: blog });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

// @desc    Delete blog
// @route   DELETE /api/blogs/:id
// @access  Private/Admin
export const deleteBlog = async (req, res, next) => {
  try {
    validateObjectId(req.params.id);

    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Delete cover image from Cloudinary if exists
    if (blog.coverImage && blog.coverImage.public_id) {
      await cloudinary.uploader.destroy(blog.coverImage.public_id);
    }

    await blog.deleteOne();

    res.json({ success: true, message: "Blog deleted successfully" });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};
