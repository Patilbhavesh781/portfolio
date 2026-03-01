import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../common/Button";
import { useAuth } from "../../hooks/useAuth";

const TYPING_WORDS = [
  "Full Stack Developer",
  // "Machine Learning",
  // "Backend Engineering",
  "Frontend Designer",
];

const Hero = () => {
  const { user, isAuthenticated } = useAuth();
  const [wordIndex, setWordIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = TYPING_WORDS[wordIndex];
    let delay = isDeleting ? 60 : 110;

    if (!isDeleting && typedText === currentWord) {
      delay = 2200;
    } else if (isDeleting && typedText === "") {
      delay = 300;
    }

    const timeoutId = setTimeout(() => {
      if (!isDeleting && typedText === currentWord) {
        setIsDeleting(true);
        return;
      }

      if (isDeleting && typedText === "") {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % TYPING_WORDS.length);
        return;
      }

      setTypedText((prev) =>
        isDeleting
          ? currentWord.slice(0, Math.max(prev.length - 1, 0))
          : currentWord.slice(0, prev.length + 1)
      );
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [typedText, isDeleting, wordIndex]);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div>
          <h1 className="text-4xl sm:text-5xl xl:text-6xl font-bold leading-tight text-gray-900 dark:text-gray-100">
            Hi, I'm{" "}
            <span className="text-indigo-600 dark:text-indigo-400">
              Bhavesh Patil
            </span>
            <br />
            <span className="inline-block min-h-[0.6em]">
              {" "}
              <span className="text-indigo-600 dark:text-indigo-400 text-[0.99em]">
                {typedText}
              </span>
              <span
                className="animate-pulse text-indigo-600 dark:text-indigo-400 ml-1"
                style={{ animationIterationCount: "infinite" }}
              >
                |
              </span>
            </span>
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
              src="https://res.cloudinary.com/drf2rliqg/image/upload/v1770715631/portfolio/about/sojugsnp4epe8fryyzu7.jpg"
              alt="Profile"
              className="w-56 h-56 sm:w-72 sm:h-72 object-cover object-top rounded-full shadow-xl"
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
