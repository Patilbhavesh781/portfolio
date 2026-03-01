import winston from "winston";
import path from "path";
import fs from "fs";

const isServerless =
  process.env.VERCEL === "1" || !!process.env.AWS_LAMBDA_FUNCTION_NAME;

let fileTransports = [];
if (!isServerless) {
  try {
    const logsDir = path.join("logs");
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }

    fileTransports = [
      new winston.transports.File({
        filename: path.join(logsDir, "error.log"),
        level: "error",
      }),
      new winston.transports.File({
        filename: path.join(logsDir, "combined.log"),
      }),
    ];
  } catch (error) {
    fileTransports = [];
  }
}

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [...fileTransports],
});

// Log to console in development and serverless
if (process.env.NODE_ENV !== "production" || isServerless) {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

export default logger;
