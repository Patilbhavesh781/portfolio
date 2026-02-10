import mongoose from "mongoose";

const aboutSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    shortBio: {
      type: String,
      trim: true,
    },
    longBio: {
      type: String,
      required: [true, "Long bio is required"],
    },
    profileImage: {
      type: String,
    },
    resumeUrl: {
      type: String,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    social: {
      github: { type: String },
      linkedin: { type: String },
      twitter: { type: String },
      website: { type: String },
    },
  },
  {
    timestamps: true,
  }
);

const About = mongoose.model("About", aboutSchema);

export default About;
