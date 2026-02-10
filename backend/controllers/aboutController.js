import About from "../models/About.js";
import logger from "../utils/logger.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

const uploadToCloudinary = async (filePath, folder) => {
  const result = await cloudinary.uploader.upload(filePath, { folder });
  fs.unlink(filePath, () => {});
  return result.secure_url;
};

// @desc    Get about profile (public)
// @route   GET /api/about
// @access  Public
export const getAbout = async (req, res, next) => {
  try {
    let about = await About.findOne();

    if (!about) {
      about = await About.create({
        fullName: "Bhavesh Patil",
        title: "Full Stack Developer",
        longBio:
          "I build scalable, secure, and high-performance web applications with React, Node.js, and MongoDB.",
        profileImage: "/assets/images/profile.png",
        resumeUrl: "",
        email: "",
        phone: "",
        location: "",
        social: {
          github: "",
          linkedin: "",
          twitter: "",
          website: "",
        },
      });
    }

    res.json({ success: true, data: about });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

// @desc    Update about profile (admin)
// @route   PUT /api/about
// @access  Private/Admin
export const updateAbout = async (req, res, next) => {
  try {
    const data = { ...req.body };

    if (req.file) {
      data.profileImage = await uploadToCloudinary(
        req.file.path,
        "portfolio/about"
      );
    } else if (data.profileImageUrl && !data.profileImage) {
      data.profileImage = data.profileImageUrl;
    }

    const social =
      data.social ||
      (data["social[github]"] ||
      data["social[linkedin]"] ||
      data["social[twitter]"] ||
      data["social[website]"]
        ? {
            github: data["social[github]"],
            linkedin: data["social[linkedin]"],
            twitter: data["social[twitter]"],
            website: data["social[website]"],
          }
        : undefined);

    if (social) {
      data.social = social;
    }

    let about = await About.findOne();

    if (!about) {
      about = await About.create(data);
    } else {
      about = await About.findOneAndUpdate({}, data, {
        new: true,
        runValidators: true,
      });
    }

    res.json({ success: true, data: about });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};
