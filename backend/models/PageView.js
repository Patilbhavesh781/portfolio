import mongoose from "mongoose";

const pageViewSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      index: true,
    },
    path: {
      type: String,
      required: true,
      trim: true,
    },
    durationSec: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

pageViewSchema.index({ createdAt: 1 });
pageViewSchema.index({ path: 1, createdAt: 1 });

const PageView = mongoose.model("PageView", pageViewSchema);

export default PageView;
