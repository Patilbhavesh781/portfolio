import logger from "../utils/logger.js";
import Project from "../models/Project.js";
import Blog from "../models/Blog.js";
import ContactMessage from "../models/ContactMessage.js";
import Testimonial from "../models/Testimonial.js";
import Stats from "../models/Stats.js";
import PageView from "../models/PageView.js";

// @desc    Get portfolio stats (public)
// @route   GET /api/stats
// @access  Public
export const getStats = async (req, res, next) => {
  try {
    const [projects, blogs, articles, messages, testimonials, statsDoc] =
      await Promise.all([
        Project.countDocuments(),
        Blog.countDocuments({
          status: "published",
          $or: [{ type: "blog" }, { type: { $exists: false } }],
        }),
        Blog.countDocuments({ status: "published", type: "article" }),
        ContactMessage.countDocuments({ isRead: false }),
        Testimonial.countDocuments(),
        Stats.findOne(),
      ]);

    res.json({
      success: true,
      data: {
        projects,
        blogs,
        articles,
        messages,
        testimonials,
        visitors: statsDoc?.visitors || 0,
      },
    });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

// @desc    Track a website visitor session (public)
// @route   POST /api/stats/visit
// @access  Public
export const trackVisitor = async (req, res, next) => {
  try {
    const stats = await Stats.findOneAndUpdate(
      {},
      { $inc: { visitors: 1 }, lastUpdated: Date.now() },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(201).json({
      success: true,
      data: {
        visitors: stats.visitors,
      },
    });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

// @desc    Track one pageview with duration (public)
// @route   POST /api/stats/track
// @access  Public
export const trackPageView = async (req, res, next) => {
  try {
    const { sessionId, path, durationSec = 0 } = req.body;

    if (!sessionId || !path) {
      return res.status(400).json({
        success: false,
        message: "sessionId and path are required",
      });
    }

    const safeDuration = Number.isFinite(Number(durationSec))
      ? Math.max(0, Math.round(Number(durationSec)))
      : 0;

    await PageView.create({
      sessionId: String(sessionId),
      path: String(path),
      durationSec: safeDuration,
    });

    res.status(201).json({ success: true });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

// @desc    Get analytics overview for admin
// @route   GET /api/stats/analytics?days=7
// @access  Private/Admin
export const getAnalyticsOverview = async (req, res, next) => {
  try {
    const allowedDays = [7, 14, 30, 90];
    const daysParam = Number(req.query.days);
    const days = allowedDays.includes(daysParam) ? daysParam : 7;

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - (days - 1));
    startDate.setHours(0, 0, 0, 0);

    const [
      uniqueVisitors,
      totalPageviews,
      durationAgg,
      groupedByDay,
      publishedBlogs,
      publishedArticles,
    ] =
      await Promise.all([
        PageView.distinct("sessionId", { createdAt: { $gte: startDate } }),
        PageView.countDocuments({ createdAt: { $gte: startDate } }),
        PageView.aggregate([
          { $match: { createdAt: { $gte: startDate } } },
          { $group: { _id: "$sessionId", totalDuration: { $sum: "$durationSec" } } },
          { $group: { _id: null, avgDuration: { $avg: "$totalDuration" } } },
        ]),
        PageView.aggregate([
          { $match: { createdAt: { $gte: startDate } } },
          {
            $group: {
              _id: {
                day: {
                  $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
                },
                sessionId: "$sessionId",
              },
              pageviews: { $sum: 1 },
              duration: { $sum: "$durationSec" },
            },
          },
          {
            $group: {
              _id: "$_id.day",
              totalPageviews: { $sum: "$pageviews" },
              uniqueVisitors: { $sum: 1 },
              totalDuration: { $sum: "$duration" },
            },
          },
          { $sort: { _id: 1 } },
        ]),
        Blog.countDocuments({
          status: "published",
          $or: [{ type: "blog" }, { type: { $exists: false } }],
        }),
        Blog.countDocuments({ status: "published", type: "article" }),
      ]);

    const dayMap = new Map(groupedByDay.map((row) => [row._id, row]));
    const chart = [];
    for (let i = 0; i < days; i += 1) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const key = date.toISOString().slice(0, 10);
      const row = dayMap.get(key);
      chart.push({
        date: key,
        pageviews: row?.totalPageviews || 0,
        uniqueVisitors: row?.uniqueVisitors || 0,
      });
    }

    const avgVisitDurationSec = Math.round(durationAgg?.[0]?.avgDuration || 0);

    res.json({
      success: true,
      data: {
        rangeDays: days,
        uniqueVisitors: uniqueVisitors.length,
        totalPageviews,
        avgVisitDurationSec,
        publishedBlogs,
        publishedArticles,
        chart,
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
