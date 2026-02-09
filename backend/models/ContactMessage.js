import mongoose from "mongoose";

const contactMessageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Sender name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Sender email is required"],
      lowercase: true,
      trim: true,
    },
    subject: {
      type: String,
      trim: true,
    },
    message: {
      type: String,
      required: [true, "Message content is required"],
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    ipAddress: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const ContactMessage = mongoose.model("ContactMessage", contactMessageSchema);

export default ContactMessage;
