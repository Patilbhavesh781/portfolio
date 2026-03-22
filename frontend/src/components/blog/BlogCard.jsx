import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const BlogCard = ({ blog }) => {
  const contentType = blog.type === "article" ? "article" : "blog";
  const contentLabel = contentType === "article" ? "Article" : "Blog";
  const detailPath = `/${contentType === "article" ? "articles" : "blog"}/${
    blog.slug || blog._id
  }`;

  return (
    <div className="flex flex-col overflow-hidden rounded-xl bg-white shadow transition hover:shadow-lg dark:bg-gray-900">
      {(blog.thumbnail || blog.coverImage?.url) && (
        <div className="h-48 w-full overflow-hidden">
          <img
            src={blog.thumbnail || blog.coverImage?.url}
            alt={blog.title}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      )}

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3">
          <span className="inline-flex rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
            {contentLabel}
          </span>
        </div>

        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
          {blog.title}
        </h3>

        <div className="mb-4 line-clamp-3 text-sm text-gray-600 dark:text-gray-400">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              p: ({ children }) => <p className="inline">{children}</p>,
              code: ({ children }) => (
                <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-gray-800">
                  {children}
                </code>
              ),
            }}
          >
            {blog.excerpt || `${blog.content?.slice(0, 160) || ""}...`}
          </ReactMarkdown>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3">
          <Link
            to={detailPath}
            className="font-medium text-indigo-600 hover:underline dark:text-indigo-400"
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
