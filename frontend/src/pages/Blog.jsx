import { useEffect, useState } from "react";
import BlogList from "../components/blog/BlogList";
import Loader from "../components/common/Loader";
import { getAllBlogs } from "../services/blogService";
import { setSEO } from "../utils/seo";

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setSEO({
      title: "Blog | Your Name - Full Stack Developer",
      description:
        "Read articles and tutorials by Your Name on web development, MERN stack, React, Node.js, and software engineering best practices.",
      keywords:
        "Blog, Web Development, MERN Stack, React, JavaScript, Node.js, MongoDB",
    });
  }, []);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await getAllBlogs();
        setBlogs(data);
      } catch (err) {
        setError("Failed to load blogs.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) return <Loader text="Loading blogs..." />;
  if (error) return <p className="text-center text-red-600">{error}</p>;

  return (
    <div className="space-y-12">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Blog</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Insights, tutorials, and thoughts on modern web development and software engineering.
        </p>
      </div>

      <BlogList blogs={blogs} />
    </div>
  );
};

export default Blog;
