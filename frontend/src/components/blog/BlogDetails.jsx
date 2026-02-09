import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../services/api";
import Loader from "../common/Loader";
import Button from "../common/Button";

const BlogDetails = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await api.get(`/blogs/${id}`);
        setBlog(response.data);
      } catch (err) {
        setError("Failed to load blog details.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  if (loading) return <Loader text="Loading blog..." />;
  if (error) return <p className="text-center text-red-600">{error}</p>;
  if (!blog) return null;

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-6">
        {/* Back Button */}
        <div className="mb-6">
          <Link to="/blogs">
            <Button variant="secondary" size="sm">
              ← Back to Blogs
            </Button>
          </Link>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          {blog.title}
        </h1>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6">
          {blog.author && <span>By {blog.author}</span>}
          {blog.createdAt && (
            <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
          )}
          {blog.readTime && <span>{blog.readTime} min read</span>}
        </div>

        {/* Thumbnail */}
        {blog.thumbnail && (
          <div className="mb-8">
            <img
              src={blog.thumbnail}
              alt={blog.title}
              className="w-full h-80 object-cover rounded-xl shadow"
            />
          </div>
        )}

        {/* Content */}
        <article className="prose prose-indigo dark:prose-invert max-w-none">
          {blog.content}
        </article>
      </div>
    </section>
  );
};

export default BlogDetails;
