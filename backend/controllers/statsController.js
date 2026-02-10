import logger from "../utils/logger.js";
import Project from "../models/Project.js";
import Blog from "../models/Blog.js";
import ContactMessage from "../models/ContactMessage.js";
import Testimonial from "../models/Testimonial.js";

// @desc    Get portfolio stats (public)
// @route   GET /api/stats
// @access  Public
export const getStats = async (req, res, next) => {
  try {
    const [projects, blogs, messages, testimonials] = await Promise.all([
      Project.countDocuments(),
      Blog.countDocuments({ status: "published" }),
      ContactMessage.countDocuments({ isRead: false }),
      Testimonial.countDocuments(),
    ]);

    res.json({
      success: true,
      data: {
        projects,
        blogs,
        messages,
        testimonials,
      },
    });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

// @desc    Update portfolio stats (admin)
// @route   PUT /api/stats
// @access  Private/Admin
export const updateStats = async (req, res, next) => {
  try {
    let stats = await Stats.findOne();

    if (!stats) {
      stats = await Stats.create(req.body);
    } else {
      stats = await Stats.findOneAndUpdate({}, req.body, {
        new: true,
        runValidators: true,
      });
    }

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};
