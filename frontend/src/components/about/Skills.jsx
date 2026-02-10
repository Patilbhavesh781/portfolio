import { useEffect, useState } from "react";
import api from "../../services/api";
import Loader from "../common/Loader";

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
  const fetchSkills = async () => {
    try {
      const response = await api.get("/skills");
      setSkills(response.data?.data || []);
    } catch (err) {
      setError("Failed to load skills.");
    } finally {
      setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  if (loading) return <Loader text="Loading skills..." />;
  if (error) return <p className="text-center text-red-600">{error}</p>;

  const groupedSkills = skills.reduce((acc, skill) => {
    const category = skill.category || "other";
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
    return acc;
  }, {});

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 dark:text-gray-100 mb-12">
          Skills & Technologies
        </h2>

        <div className="space-y-12">
          {Object.entries(groupedSkills).map(([category, skills]) => (
            <div key={category}>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {skills.map((skill) => (
                  <div
                    key={skill._id}
                    className="flex flex-col items-center justify-center p-4 bg-white dark:bg-gray-900 rounded-xl shadow hover:shadow-md transition"
                  >
                    {skill.icon && (
                      <img
                        src={skill.icon}
                        alt={skill.name}
                        className="w-10 h-10 mb-3"
                      />
                    )}
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      {skill.name}
                    </p>
                    {skill.level && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {skill.level}%
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
