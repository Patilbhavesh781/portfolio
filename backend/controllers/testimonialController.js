import Testimonial from "../models/Testimonial.js";
import logger from "../utils/logger.js";
import validateObjectId from "../utils/validateObjectId.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

const uploadToCloudinary = async (filePath, folder) => {
  const result = await cloudinary.uploader.upload(filePath, { folder });
  fs.unlink(filePath, () => {});
  return { public_id: result.public_id, url: result.secure_url };
};

// @desc    Get all testimonials (public)
// @route   GET /api/testimonials
// @access  Public
export const getTestimonials = async (req, res, next) => {
  try {
    const { featured, approved } = req.query;

    const filter = {};
    if (featured) filter.isFeatured = featured === "true";
    if (approved) filter.isApproved = approved === "true";

    const testimonials = await Testimonial.find(filter).sort({ order: 1, createdAt: -1 });

    res.json({
      success: true,
      count: testimonials.length,
      data: testimonials,
    });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

// @desc    Create new testimonial
// @route   POST /api/testimonials
// @access  Private/Admin
export const createTestimonial = async (req, res, next) => {
  try {
    const data = { ...req.body };

    if (req.file) {
      data.avatar = await uploadToCloudinary(
        req.file.path,
        "portfolio/testimonials"
      );
    } else if (data.avatarUrl) {
      data.avatar = { url: data.avatarUrl };
    }

    const testimonial = await Testimonial.create(data);

    res.status(201).json({ success: true, data: testimonial });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

// @desc    Update testimonial
// @route   PUT /api/testimonials/:id
// @access  Private/Admin
export const updateTestimonial = async (req, res, next) => {
  try {
    validateObjectId(req.params.id);

    const data = { ...req.body };

    if (req.file) {
      data.avatar = await uploadToCloudinary(
        req.file.path,
        "portfolio/testimonials"
      );
    } else if (data.avatarUrl) {
      data.avatar = { url: data.avatarUrl };
    }

    const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true,
    });

    if (!testimonial) {
      return res.status(404).json({ message: "Testimonial not found" });
    }

    res.json({ success: true, data: testimonial });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

// @desc    Delete testimonial
// @route   DELETE /api/testimonials/:id
// @access  Private/Admin
export const deleteTestimonial = async (req, res, next) => {
  try {
    validateObjectId(req.params.id);

    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ message: "Testimonial not found" });
    }

    await testimonial.deleteOne();

    res.json({ success: true, message: "Testimonial deleted successfully" });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};
