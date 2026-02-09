import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Projects", path: "/projects" },
    { name: "Blog", path: "/blog" },
    { name: "Contact", path: "/contact" },
  ];

  const socialLinks = [
    { name: "GitHub", url: "https://github.com/yourusername" },
    { name: "LinkedIn", url: "https://linkedin.com/in/yourusername" },
    { name: "Twitter", url: "https://twitter.com/yourusername" },
    { name: "Email", url: "mailto:youremail@example.com" },
  ];

  return (
    <footer className="bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand */}
        <div>
          <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 mb-3">
            MyPortfolio
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-sm">
            Full Stack Developer specializing in building exceptional digital
            experiences with modern web technologies.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-4">
            Quick Links
          </h4>
          <ul className="space-y-2">
            {quickLinks.map((link) => (
              <li key={link.name}>
                <Link
                  to={link.path}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Social */}
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-4">
            Connect
          </h4>
          <ul className="space-y-2">
            {socialLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-800 py-4">
        <p className="text-center text-xs text-gray-500 dark:text-gray-500">
          © {currentYear} MyPortfolio. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
