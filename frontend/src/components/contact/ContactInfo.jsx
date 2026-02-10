import { useEffect, useState } from "react";
import api from "../../services/api";
import Loader from "../common/Loader";

const ContactInfo = () => {
  const [about, setAbout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const response = await api.get("/about");
        setAbout(response.data?.data || null);
      } catch (err) {
        setError("Failed to load contact info.");
      } finally {
        setLoading(false);
      }
    };

    fetchAbout();
  }, []);

  if (loading) return <Loader text="Loading contact info..." />;
  if (error) return <p className="text-center text-red-600">{error}</p>;
  if (!about) return null;

  return (
    <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-xl shadow h-full">
      <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
        Contact Information
      </h3>

      <ul className="space-y-4 text-gray-700 dark:text-gray-300">
        {about.email && (
          <li>
            <strong>Email:</strong>{" "}
            <a
              href={`mailto:${about.email}`}
              className="text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              {about.email}
            </a>
          </li>
        )}

        {about.phone && (
          <li>
            <strong>Phone:</strong>{" "}
            <a
              href={`tel:${about.phone}`}
              className="text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              {about.phone}
            </a>
          </li>
        )}

        {about.location && (
          <li>
            <strong>Location:</strong> {about.location}
          </li>
        )}

        {(about.social?.github ||
          about.social?.linkedin ||
          about.social?.twitter ||
          about.social?.website) && (
          <li>
            <strong>Social:</strong>
            <div className="flex items-center gap-4 mt-2">
              {about.social?.github && (
                <a
                  href={about.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  GitHub
                </a>
              )}
              {about.social?.linkedin && (
                <a
                  href={about.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  LinkedIn
                </a>
              )}
              {about.social?.twitter && (
                <a
                  href={about.social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Twitter
                </a>
              )}
              {about.social?.website && (
                <a
                  href={about.social.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Website
                </a>
              )}
            </div>
          </li>
        )}
      </ul>
    </div>
  );
};

export default ContactInfo;
