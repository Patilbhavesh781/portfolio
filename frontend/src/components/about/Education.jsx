import { useEffect, useState } from "react";
import api from "../../services/api";
import Loader from "../common/Loader";

const Education = () => {
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEducation = async () => {
      try {
        const response = await api.get("/education");
        setEducation(response.data);
      } catch (err) {
        setError("Failed to load education.");
      } finally {
        setLoading(false);
      }
    };

    fetchEducation();
  }, []);

  if (loading) return <Loader text="Loading education..." />;
  if (error) return <p className="text-center text-red-600">{error}</p>;

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 dark:text-gray-100 mb-12">
          Education
        </h2>

        <div className="space-y-8">
          {education.map((edu) => (
            <div
              key={edu._id}
              className="p-6 bg-gray-100 dark:bg-gray-800 rounded-xl shadow hover:shadow-md transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {edu.degree}
                </h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {edu.startDate} – {edu.endDate || "Present"}
                </span>
              </div>
              <p className="text-indigo-600 dark:text-indigo-400 font-medium mb-2">
                {edu.institution}
              </p>
              {edu.fieldOfStudy && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Field: {edu.fieldOfStudy}
                </p>
              )}
              {edu.grade && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Grade: {edu.grade}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Education;
