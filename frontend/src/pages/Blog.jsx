import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import clsx from "clsx";
import BlogList from "../components/blog/BlogList";
import Loader from "../components/common/Loader";
import ScrollReveal from "../components/common/ScrollReveal";
import { getAllBlogs } from "../services/blogService";
import { setSEO } from "../utils/seo";

const Blog = ({ contentType = "blog" }) => {
  const location = useLocation();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const contentLabel = contentType === "article" ? "Articles" : "Blogs";

  useEffect(() => {
    setSEO({
      title: `${contentLabel} | Bhavesh Patil - Full Stack Developer`,
      description:
        contentType === "article"
          ? "Read long-form articles by Bhavesh Patil on development, engineering, and practical software lessons."
          : "Read blog posts and tutorials by Bhavesh Patil on web development, MERN stack, React, Node.js, and software engineering best practices.",
      keywords:
        contentType === "article"
          ? "Articles, Software Engineering, Web Development, MERN Stack"
          : "Blog, Web Development, MERN Stack, React, JavaScript, Node.js, MongoDB",
    });
  }, [contentLabel, contentType]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAllBlogs({ type: contentType });
        setBlogs(data);
      } catch (err) {
        setError(`Failed to load ${contentLabel.toLowerCase()}.`);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [contentLabel, contentType]);

  if (loading) return <Loader text={`Loading ${contentLabel.toLowerCase()}...`} />;
  if (error) return <p className="text-center text-red-600">{error}</p>;

  return (
    <div className="space-y-12">
      <ScrollReveal>
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-4 text-4xl font-bold">{contentLabel}</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {contentType === "article"
              ? "Long-form writing, deeper engineering thoughts, and practical lessons from real projects."
              : "Insights, tutorials, and quick thoughts on modern web development and software engineering."}
          </p>
          <div className="mt-6 inline-flex rounded-full border border-gray-200 bg-white p-1 shadow-sm dark:border-gray-700 dark:bg-gray-900">
            {[
              { label: "Blogs", path: "/blog" },
              { label: "Articles", path: "/articles" },
            ].map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={clsx(
                    "rounded-full px-4 py-2 text-sm font-medium transition",
                    isActive
                      ? "bg-indigo-600 text-white"
                      : "text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.05}>
        <BlogList blogs={blogs} contentType={contentType} />
      </ScrollReveal>
    </div>
  );
};

export default Blog;
