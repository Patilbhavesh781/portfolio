import nodemailer from "nodemailer";
import logger from "./logger.js";

const resolveMailerConfig = () => {
  const host = process.env.MAIL_HOST || process.env.EMAIL_HOST || "";
  const user = process.env.MAIL_USER || process.env.EMAIL_USER || "";
  const pass = process.env.MAIL_PASS || process.env.EMAIL_PASS || "";
  const secure = (process.env.MAIL_SECURE || "false") === "true";

  const parsedPort = Number(process.env.MAIL_PORT || process.env.EMAIL_PORT);
  const port = Number.isFinite(parsedPort) && parsedPort > 0 ? parsedPort : secure ? 465 : 587;

  const fromAddress = process.env.MAIL_FROM || user;

  return { host, port, secure, user, pass, fromAddress };
};

let cachedTransporter = null;

const getTransporter = () => {
  if (cachedTransporter) {
    return cachedTransporter;
  }

  const { host, port, secure, user, pass } = resolveMailerConfig();
  cachedTransporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });

  return cachedTransporter;
};

const sendEmail = async ({ to, subject, text, html }) => {
  const { host, user, pass, fromAddress } = resolveMailerConfig();

  if (!to) {
    throw new Error("Recipient email is required");
  }

  if (!host || !user || !pass || !fromAddress) {
    throw new Error("Mailer is not configured. Check MAIL_HOST/MAIL_USER/MAIL_PASS/MAIL_FROM.");
  }

  try {
    await getTransporter().sendMail({
      from: `"Portfolio Contact" <${fromAddress}>`,
      to,
      subject,
      text,
      html,
    });
    logger.info(`Email sent to ${to}`);
  } catch (error) {
    logger.error(`Email sending failed: ${error.message}`);
    throw new Error("Email could not be sent");
  }
};

export default sendEmail;
