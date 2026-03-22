import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Project title is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "Project description is required"],
    },
    longDescription: {
      type: String,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    technologies: [
      {
        type: String,
        trim: true,
      },
    ],
    category: {
      type: String,
      enum: ["frontend", "backend", "fullstack", "mobile", "other"],
      default: "fullstack",
    },
    githubUrl: {
      type: String,
    },
    liveUrl: {
      type: String,
    },
    thumbnail: {
      public_id: String,
      url: String,
    },
    images: [
      {
        public_id: String,
        url: String,
      },
    ],
    isFeatured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "published",
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model("Project", projectSchema);

export default Project;
