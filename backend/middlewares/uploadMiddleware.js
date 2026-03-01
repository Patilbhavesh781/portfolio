import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure temp upload directory exists
const isServerless =
  process.env.VERCEL === "1" || !!process.env.AWS_LAMBDA_FUNCTION_NAME;
const uploadPath = isServerless
  ? path.join("/tmp", "uploads", "temp")
  : path.join("uploads", "temp");

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Storage configuration
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadPath);
  },
  filename(req, file, cb) {
    cb(
      null,
      `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(
        file.originalname
      )}`
    );
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|webp|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Images only! (jpeg, jpg, png, webp, gif)"), false);
  }
};

// Upload middleware
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

export default upload;
