import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              p: ({ children }) => <p className="inline">{children}</p>,
              code: ({ children }) => (
                <code className="rounded bg-gray-100 dark:bg-gray-800 px-1 py-0.5">
                  {children}
                </code>
              ),
            }}
          >
            {blog.excerpt || `${blog.content?.slice(0, 160) || ""}...`}
          </ReactMarkdown>
        </div>

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
