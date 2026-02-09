const ContactInfo = () => {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-xl shadow h-full">
      <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
        Contact Information
      </h3>

      <ul className="space-y-4 text-gray-700 dark:text-gray-300">
        <li>
          <strong>Email:</strong>{" "}
          <a
            href="mailto:yourname@example.com"
            className="text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            yourname@example.com
          </a>
        </li>

        <li>
          <strong>Phone:</strong>{" "}
          <a
            href="tel:+1234567890"
            className="text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            +1 (234) 567-890
          </a>
        </li>

        <li>
          <strong>Location:</strong> Your City, Your Country
        </li>

        <li>
          <strong>Social:</strong>
          <div className="flex items-center gap-4 mt-2">
            <a
              href="https://github.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com/in/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              LinkedIn
            </a>
            <a
              href="https://twitter.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Twitter
            </a>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default ContactInfo;
