import { useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../common/Loader";
import Button from "../common/Button";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const CodeBlock = ({ className, children }) => {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || "");
  const language = match?.[1] || "text";
  const code = String(children).replace(/\n$/, "");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (error) {
      setCopied(false);
    }
  };

  return (
    <div className="mb-6 overflow-hidden rounded-lg border border-gray-700">
      <div className="flex items-center justify-between bg-gray-800 px-3 py-2 text-xs text-gray-200">
        <span className="font-medium uppercase tracking-wide">{language}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="rounded border border-gray-600 px-2 py-1 text-gray-200 hover:bg-gray-700"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={oneDark}
        customStyle={{ margin: 0, borderRadius: 0, fontSize: "0.875rem" }}
        wrapLongLines
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

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

        {blog.tags?.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {blog.tags.map((tag, index) => (
              <span
                key={`${tag}-${index}`}
                className="px-3 py-1 text-xs font-medium bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

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
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
              pre: ({ children }) => <>{children}</>,
              code: ({ inline, className, children, ...props }) =>
                inline ? (
                  <code className="rounded bg-gray-100 dark:bg-gray-800 px-1 py-0.5" {...props}>
                    {children}
                  </code>
                ) : (
                  <CodeBlock className={className}>{children}</CodeBlock>
                ),
            }}
          >
            {blog.content || ""}
          </ReactMarkdown>
        </article>
      </div>
    </section>
  );
};

export default BlogDetails;
