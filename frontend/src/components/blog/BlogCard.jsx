import { Link } from "react-router-dom";

const BlogCard = ({ blog }) => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow hover:shadow-lg transition overflow-hidden flex flex-col">
      {(blog.thumbnail || blog.coverImage?.url) && (
        <div className="h-48 w-full overflow-hidden">
          <img
            src={blog.thumbnail || blog.coverImage?.url}
            alt={blog.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      )}

      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          {blog.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
          {blog.excerpt || blog.content?.slice(0, 120) + "..."}
        </p>

        <div className="mt-auto flex items-center justify-between">
          <Link
            to={`/blog/${blog.slug || blog._id}`}
            className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
          >
            Read More →
          </Link>

          {blog.createdAt && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {new Date(blog.createdAt).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
