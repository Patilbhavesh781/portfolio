import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["blog", "article"],
      default: "blog",
      index: true,
    },
    title: {
      type: String,
      required: [true, "Blog title is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    excerpt: {
      type: String,
      required: [true, "Blog excerpt is required"],
      maxlength: 300,
    },
    author: {
      type: String,
      trim: true,
    },
    content: {
      type: String,
      required: [true, "Blog content is required"],
    },
    thumbnail: {
      type: String,
    },
    coverImage: {
      public_id: String,
      url: String,
    },
    tags: [
      {
        type: String,
        trim: true,
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
    readTime: {
      type: Number,
      default: 5,
    },
    views: {
      type: Number,
      default: 0,
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;
