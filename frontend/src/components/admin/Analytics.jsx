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
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
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

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              Pageviews Trend
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Daily pageviews for the selected period
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-indigo-500" />
            Pageviews
          </div>
        </div>

        <LineChart chart={analytics.chart || []} />
      </div>
    </section>
  );
};

const KpiCard = ({ label, value }) => (
  <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
    <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
    <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
  </div>
);

const LineChart = ({ chart }) => {
  const width = 920;
  const height = 320;
  const padding = { top: 20, right: 18, bottom: 42, left: 42 };
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  const maxValue = Math.max(1, ...chart.map((item) => item.pageviews || 0));
  const steps = 4;

  const points = useMemo(() => {
    if (!chart.length) return [];

    return chart.map((item, index) => {
      const x =
        padding.left +
        (chart.length === 1 ? innerWidth / 2 : (index / (chart.length - 1)) * innerWidth);
      const y =
        padding.top +
        innerHeight -
        ((item.pageviews || 0) / maxValue) * innerHeight;

      return {
        x,
        y,
        label: item.date?.slice(5) || "",
        value: item.pageviews || 0,
      };
    });
  }, [chart, innerHeight, innerWidth, maxValue, padding.left, padding.top]);

  const linePath = useMemo(() => {
    if (!points.length) return "";
    if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

    return points.reduce((path, point, index, arr) => {
      if (index === 0) return `M ${point.x} ${point.y}`;

      const prev = arr[index - 1];
      const midX = (prev.x + point.x) / 2;
      return `${path} C ${midX} ${prev.y}, ${midX} ${point.y}, ${point.x} ${point.y}`;
    }, "");
  }, [points]);

  const areaPath = useMemo(() => {
    if (!points.length) return "";
    const baseY = padding.top + innerHeight;
    return `${linePath} L ${points[points.length - 1].x} ${baseY} L ${points[0].x} ${baseY} Z`;
  }, [innerHeight, linePath, padding.top, points]);

  if (!chart.length) {
    return (
      <div className="flex h-72 items-center justify-center rounded-lg border border-dashed border-gray-300 text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
        No analytics data yet.
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[720px]">
        <svg viewBox={`0 0 ${width} ${height}`} className="h-80 w-full">
          {Array.from({ length: steps + 1 }).map((_, index) => {
            const value = Math.round((maxValue / steps) * (steps - index));
            const y = padding.top + (innerHeight / steps) * index;
            return (
              <g key={index}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="currentColor"
                  strokeOpacity="0.12"
                  className="text-gray-600 dark:text-gray-300"
                />
                <text
                  x={padding.left - 10}
                  y={y + 4}
                  textAnchor="end"
                  className="fill-gray-500 text-[11px] dark:fill-gray-400"
                >
                  {value}
                </text>
              </g>
            );
          })}

          <path d={areaPath} fill="rgba(99, 102, 241, 0.14)" />
          <path
            d={linePath}
            fill="none"
            stroke="rgb(99, 102, 241)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {points.map((point) => (
            <g key={`${point.label}-${point.value}`}>
              <circle
                cx={point.x}
                cy={point.y}
                r="5"
                fill="white"
                stroke="rgb(99, 102, 241)"
                strokeWidth="3"
              />
              <text
                x={point.x}
                y={point.y - 12}
                textAnchor="middle"
                className="fill-gray-600 text-[11px] dark:fill-gray-300"
              >
                {point.value}
              </text>
              <text
                x={point.x}
                y={height - 14}
                textAnchor="middle"
                className="fill-gray-500 text-[11px] dark:fill-gray-400"
              >
                {point.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
};

export default Analytics;
