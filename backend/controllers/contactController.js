import ContactMessage from "../models/ContactMessage.js";
import sendEmail from "../utils/sendEmail.js";
import logger from "../utils/logger.js";
import validateObjectId from "../utils/validateObjectId.js";

// @desc    Send contact message (public)
// @route   POST /api/contact
// @access  Public
export const sendContactMessage = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    await ContactMessage.create({
      name,
      email,
      subject,
      message,
      ipAddress: req.ip,
    });

    // Send email notification to admin (optional)
    const adminRecipient =
      process.env.ADMIN_EMAIL ||
      process.env.MAIL_TO ||
      process.env.MAIL_USER ||
      process.env.EMAIL_USER;

    const hasMailerConfig =
      (process.env.MAIL_HOST || process.env.EMAIL_HOST) &&
      (process.env.MAIL_USER || process.env.EMAIL_USER) &&
      (process.env.MAIL_PASS || process.env.EMAIL_PASS);

    if (adminRecipient && hasMailerConfig) {
      try {
        await sendEmail({
          to: adminRecipient,
          subject: `New Contact Message: ${subject || "No Subject"}`,
          html: `
            <h3>New Contact Message</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject || "N/A"}</p>
            <p><strong>Message:</strong></p>
            <p>${String(message || "").replace(/\n/g, "<br>")}</p>
          `,
        });
      } catch (emailError) {
        logger.error(`Contact saved but email notification failed: ${emailError.message}`);
      }
    } else {
      logger.warn("Contact saved without email notification. Missing ADMIN_EMAIL/MAIL_TO or mail credentials.");
    }

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
    });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

// @desc    Get all contact messages (admin)
// @route   GET /api/contact
// @access  Private/Admin
export const getContactMessages = async (req, res, next) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      count: messages.length,
      data: messages,
    });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

// @desc    Mark contact message as read
// @route   PUT /api/contact/:id/read
// @access  Private/Admin
export const markMessageAsRead = async (req, res, next) => {
  try {
    validateObjectId(req.params.id);

    const message = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    res.json({ success: true, data: message });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

// @desc    Delete contact message
// @route   DELETE /api/contact/:id
// @access  Private/Admin
export const deleteContactMessage = async (req, res, next) => {
  try {
    validateObjectId(req.params.id);

    const message = await ContactMessage.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    await message.deleteOne();

    res.json({ success: true, message: "Message deleted successfully" });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};
