import Stats from "../models/Stats.js";
import logger from "../utils/logger.js";

// @desc    Get portfolio stats (public)
// @route   GET /api/stats
// @access  Public
export const getStats = async (req, res, next) => {
  try {
    let stats = await Stats.findOne();

    if (!stats) {
      stats = await Stats.create({});
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
