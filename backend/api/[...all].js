import dotenv from "dotenv";
import app from "../app.js";
import connectDB from "../config/db.js";
import { configureCloudinary } from "../config/cloudinary.js";

dotenv.config();

let isInitialized = false;
let dbPromise = null;

const initialize = async () => {
  if (!isInitialized) {
    if (!dbPromise) {
      dbPromise = connectDB();
    }
    await dbPromise;
    configureCloudinary();
    isInitialized = true;
  }
};

export default async function handler(req, res) {
  await initialize();
  return app(req, res);
}
