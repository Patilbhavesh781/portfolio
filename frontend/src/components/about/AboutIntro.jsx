import { useEffect, useState } from "react";
import api from "../../services/api";
import Loader from "../common/Loader";
import Button from "../common/Button";
import { Link } from "react-router-dom";

const AboutIntro = () => {
  const [about, setAbout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const response = await api.get("/about");
        setAbout(response.data);
      } catch (err) {
        setError("Failed to load about information.");
      } finally {
        setLoading(false);
      }
    };

    fetchAbout();
  }, []);

  if (loading) return <Loader text="Loading profile..." />;
  if (error) return <p className="text-center text-red-600">{error}</p>;
  if (!about) return null;

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Image */}
        <div className="flex justify-center">
          <img
            src={about.profileImage || "/assets/images/profile.png"}
            alt={about.fullName}
            className="w-64 h-64 sm:w-80 sm:h-80 object-cover rounded-2xl shadow-lg"
          />
        </div>

        {/* Content */}
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {about.fullName}
          </h1>
          <h2 className="text-lg text-indigo-600 dark:text-indigo-400 font-semibold mb-4">
            {about.title}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
            {about.longBio}
          </p>

          <div className="flex flex-wrap gap-4">
            {about.resumeUrl && (
              <a
                href={about.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="md">Download Resume</Button>
              </a>
            )}
            <Link to="/contact">
              <Button variant="outline" size="md">
                Contact Me
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutIntro;
