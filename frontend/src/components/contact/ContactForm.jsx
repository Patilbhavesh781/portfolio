import { useState } from "react";
import Button from "../common/Button";
import Loader from "../common/Loader";
import { sendContactMessage } from "../../services/contactService";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await sendContactMessage(formData);
      setSuccess("Your message has been sent successfully!");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setError("Failed to send message. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow">
      <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
        Send Me a Message
      </h3>

      {success && (
        <p className="mb-4 text-green-600 dark:text-green-400 font-medium">
          {success}
        </p>
      )}
      {error && (
        <p className="mb-4 text-red-600 dark:text-red-400 font-medium">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Your name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Subject
          </label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Subject"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Message
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows="5"
            required
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            placeholder="Write your message here..."
          />
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? <Loader size="sm" /> : "Send Message"}
        </Button>
      </form>
    </div>
  );
};

export default ContactForm;
