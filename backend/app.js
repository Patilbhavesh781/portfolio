import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import path from "path";

import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import skillRoutes from "./routes/skillRoutes.js";
import experienceRoutes from "./routes/experienceRoutes.js";
import educationRoutes from "./routes/educationRoutes.js";
import certificationRoutes from "./routes/certificationRoutes.js";
import testimonialRoutes from "./routes/testimonialRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";
import aboutRoutes from "./routes/aboutRoutes.js";

import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";

dotenv.config();

const app = express();

// Middleware
const normalizeOrigin = (value = "") => value.trim().replace(/\/+$/, "");

const allowedOrigins = (
  process.env.CLIENT_URLS ||
  process.env.CLIENT_URL ||
  "http://localhost:5173,http://127.0.0.1:5173"
)
  .split(",")
  .map((origin) => normalizeOrigin(origin))
  .filter(Boolean);

const allowPreviewOrigins = process.env.ALLOW_PREVIEW_ORIGINS !== "false";

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser tools and same-origin requests without Origin header
      if (!origin) return callback(null, true);

      const normalizedOrigin = normalizeOrigin(origin);
      if (allowedOrigins.includes(normalizedOrigin)) {
        return callback(null, true);
      }

      // Optional convenience for deployment previews
      if (allowPreviewOrigins) {
        try {
          const { hostname } = new URL(normalizedOrigin);
          if (
            hostname.endsWith(".netlify.app") ||
            hostname.endsWith(".vercel.app")
          ) {
            return callback(null, true);
          }
        } catch (error) {
          // ignore URL parse errors and fall through to reject
        }
      }

      // Do not throw server error for CORS mismatch
      return callback(null, false);
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Static uploads
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/experiences", experienceRoutes);
app.use("/api/education", educationRoutes);
app.use("/api/certifications", certificationRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/about", aboutRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("🚀 Portfolio API is running...");
});

// Error Middleware
app.use(notFound);
app.use(errorHandler);

export default app;
