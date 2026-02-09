import { useEffect, useState } from "react";
import api from "../../services/api";
import Loader from "../common/Loader";

const Experience = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const response = await api.get("/experience");
        setExperiences(response.data);
      } catch (err) {
        setError("Failed to load experience.");
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  if (loading) return <Loader text="Loading experience..." />;
  if (error) return <p className="text-center text-red-600">{error}</p>;

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 dark:text-gray-100 mb-12">
          Work Experience
        </h2>

        <div className="space-y-8">
          {experiences.map((exp) => (
            <div
              key={exp._id}
              className="p-6 bg-gray-100 dark:bg-gray-800 rounded-xl shadow hover:shadow-md transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {exp.role}
                </h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {exp.startDate} – {exp.endDate || "Present"}
                </span>
              </div>
              <p className="text-indigo-600 dark:text-indigo-400 font-medium mb-2">
                {exp.company}
              </p>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
                {exp.description}
              </p>
              {exp.technologies?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {exp.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 text-xs font-medium bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
