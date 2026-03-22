import { useEffect, useState } from "react";
import api from "../../services/api";
import Loader from "../common/Loader";
import { useAuth } from "../../hooks/useAuth";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/stats");
        setStats(response.data?.data || null);
      } catch (err) {
        setError("Failed to load dashboard stats.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <Loader text="Loading dashboard..." />;
  if (error) return <p className="text-center text-red-600">{error}</p>;
  if (!stats) return null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Welcome back, {user?.name || "Admin"}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Here is what is happening on your portfolio today.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-6">
        <StatCard title="Projects" value={stats.projects} />
        <StatCard title="Blogs" value={stats.blogs} />
        <StatCard title="Articles" value={stats.articles || 0} />
        <StatCard title="Messages" value={stats.messages} />
        <StatCard title="Testimonials" value={stats.testimonials} />
        <StatCard title="Visitors" value={stats.visitors || 0} />
      </div>

      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Activity Summary
        </h2>
        <ul className="space-y-2 text-gray-600 dark:text-gray-400">
          <li>Total Projects: {stats.projects}</li>
          <li>Published Blogs: {stats.blogs}</li>
          <li>Published Articles: {stats.articles || 0}</li>
          <li>New Messages: {stats.messages}</li>
          <li>Testimonials Received: {stats.testimonials}</li>
          <li>Total Visitors: {stats.visitors || 0}</li>
        </ul>
      </div>
    </div>
  );
};

const StatCard = ({ title, value }) => {
  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow hover:shadow-md transition">
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
      <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">{value}</p>
    </div>
  );
};

export default Dashboard;
