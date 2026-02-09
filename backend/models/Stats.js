import mongoose from "mongoose";

const statsSchema = new mongoose.Schema(
  {
    projectsCompleted: {
      type: Number,
      default: 0,
    },
    yearsOfExperience: {
      type: Number,
      default: 0,
    },
    happyClients: {
      type: Number,
      default: 0,
    },
    certificationsCount: {
      type: Number,
      default: 0,
    },
    blogsWritten: {
      type: Number,
      default: 0,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Stats = mongoose.model("Stats", statsSchema);

export default Stats;
