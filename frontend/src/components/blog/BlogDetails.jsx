import { Link } from "react-router-dom";
import Loader from "../common/Loader";
import Button from "../common/Button";

const BlogDetails = ({ blog, loading, error }) => {
  if (loading) return <Loader text="Loading blog..." />;
  if (error) return <p className="text-center text-red-600">{error}</p>;
  if (!blog) return null;

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-6">
          <Link to="/blog">
            <Button variant="secondary" size="sm">
              Back to Blog
            </Button>
          </Link>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          {blog.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6">
          {blog.author && <span>By {blog.author}</span>}
          {blog.createdAt && (
            <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
          )}
          {blog.readTime && <span>{blog.readTime} min read</span>}
        </div>

        {(blog.thumbnail || blog.coverImage?.url) && (
          <div className="mb-8">
            <img
              src={blog.thumbnail || blog.coverImage?.url}
              alt={blog.title}
              className="w-full h-80 object-cover rounded-xl shadow"
            />
          </div>
        )}

        <article className="prose prose-indigo dark:prose-invert max-w-none">
          {blog.content}
        </article>
      </div>
    </section>
  );
};

export default BlogDetails;
