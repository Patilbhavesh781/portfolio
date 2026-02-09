import Blog from "../models/Blog.js";
import cloudinary from "../config/cloudinary.js";
import logger from "../utils/logger.js";
import validateObjectId from "../utils/validateObjectId.js";

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
    const blog = await Blog.findOne({ slug: req.params.slug });

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
    const blogData = req.body;

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

    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
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
