import { Link } from "react-router-dom";
import Button from "../common/Button";
import { useAuth } from "../../hooks/useAuth";

const Hero = () => {
  const { user, isAuthenticated } = useAuth();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div>
          <h1 className="text-4xl sm:text-5xl xl:text-6xl font-bold leading-tight text-gray-900 dark:text-gray-100">
            Hi, I'm{" "}
            <span className="text-indigo-600 dark:text-indigo-400">
              Your Name
            </span>
            <br />
            Full Stack Developer
          </h1>

          <p className="mt-6 text-lg text-gray-600 dark:text-gray-400 max-w-xl">
            I build scalable, secure, and high-performance web applications
            using modern technologies like React, Node.js, and MongoDB.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link to="/projects">
              <Button size="lg">View Projects</Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" size="lg">
                Contact Me
              </Button>
            </Link>
            {isAuthenticated && user?.role === "admin" && (
              <Link to="/admin">
                <Button variant="secondary" size="lg">
                  Admin Dashboard
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Right Content (Image / Illustration) */}
        <div className="relative flex justify-center">
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">
            <img
              src="/assets/images/profile.png"
              alt="Profile"
              className="w-56 h-56 sm:w-72 sm:h-72 object-cover rounded-full shadow-xl"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
