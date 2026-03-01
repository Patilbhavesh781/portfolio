import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";
import Loader from "../common/Loader";

const RANGE_OPTIONS = [7, 14, 30, 90];

const formatDuration = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins <= 0) return `${secs}s`;
  return `${mins}m ${String(secs).padStart(2, "0")}s`;
};

const Analytics = () => {
  const [days, setDays] = useState(7);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await api.get(`/stats/analytics?days=${days}`);
        setAnalytics(response.data?.data || null);
      } catch (err) {
        setError("Failed to load analytics.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [days]);

  const maxPageviews = useMemo(() => {
    if (!analytics?.chart?.length) return 1;
    return Math.max(...analytics.chart.map((item) => item.pageviews), 1);
  }, [analytics]);

  if (loading) return <Loader text="Loading analytics..." />;
  if (error) return <p className="text-center text-red-600">{error}</p>;
  if (!analytics) return null;

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Analytics Overview
        </h1>
        <select
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100"
        >
          {RANGE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              Last {option} Days
            </option>
          ))}
        </select>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <KpiCard label="Unique Visitors" value={analytics.uniqueVisitors} />
        <KpiCard label="Total Pageviews" value={analytics.totalPageviews} />
        <KpiCard
          label="Visit Duration"
          value={formatDuration(analytics.avgVisitDurationSec || 0)}
        />
      </div>

      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
        <h2 className="mb-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
          Pageviews Trend
        </h2>
        <div className="h-64 overflow-x-auto">
          <div className="flex h-full min-w-[680px] items-end gap-2">
            {analytics.chart.map((item) => {
              const barHeight = (item.pageviews / maxPageviews) * 100;
              return (
                <div key={item.date} className="flex flex-1 flex-col items-center justify-end gap-2">
                  <div className="w-full text-center text-[10px] text-gray-500 dark:text-gray-400">
                    {item.pageviews}
                  </div>
                  <div className="w-full rounded-t bg-indigo-500/90" style={{ height: `${Math.max(barHeight, 2)}%` }} />
                  <div className="text-[10px] text-gray-500 dark:text-gray-400">
                    {item.date.slice(5)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

const KpiCard = ({ label, value }) => (
  <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
    <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
    <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
  </div>
);

export default Analytics;
