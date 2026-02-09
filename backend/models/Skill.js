import mongoose from "mongoose";

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Skill name is required"],
      trim: true,
    },
    category: {
      type: String,
      enum: ["frontend", "backend", "devops", "tools", "other"],
      default: "frontend",
    },
    level: {
      type: Number,
      min: 1,
      max: 100,
      default: 70,
    },
    icon: {
      type: String,
    },
    order: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Skill = mongoose.model("Skill", skillSchema);

export default Skill;
