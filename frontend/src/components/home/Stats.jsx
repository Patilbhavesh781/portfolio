import { useEffect, useState } from "react";
import api from "../../services/api";
import Loader from "../common/Loader";

const Stats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/stats");
        setStats(response.data?.data || null);
      } catch (err) {
        setError("Failed to load stats.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <Loader text="Loading stats..." />;
  if (error) return <p className="text-center text-red-600">{error}</p>;
  if (!stats) return null;

  const items = [
    { label: "Projects", value: stats.projects || 0 },
    { label: "Blogs", value: stats.blogs || 0 },
    { label: "Articles", value: stats.articles || 0 },
    // { label: "Unread Messages", value: stats.messages || 0 },
    { label: "Testimonials", value: stats.testimonials || 0 },
  ];

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 gap-8 text-center sm:grid-cols-4 lg:grid-cols-5">
          {items.map((item, index) => (
            <div
              key={index}
              className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow hover:shadow-md transition"
            >
              <p className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">
                {item.value}+
              </p>
              <p className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
