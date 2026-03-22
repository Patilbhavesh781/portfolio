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

const BlogDetails = ({ blog, loading, error, contentType = "blog" }) => {
  if (loading) return <Loader text="Loading content..." />;
  if (error) return <p className="text-center text-red-600">{error}</p>;
  if (!blog) return null;

  const contentLabel = contentType === "article" ? "Article" : "Blog";
  const backPath = contentType === "article" ? "/articles" : "/blog";

  return (
    <section className="bg-white py-20 dark:bg-gray-900">
      <div className="mx-auto max-w-4xl px-6">
        <div className="mb-6">
          <Link to={backPath}>
            <Button variant="secondary" size="sm">
              Back to {contentLabel}
            </Button>
          </Link>
        </div>

        <div className="mb-4">
          <span className="inline-flex rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
            {contentLabel}
          </span>
        </div>

        <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-gray-100 sm:text-4xl">
          {blog.title}
        </h1>

        <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
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
                className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300"
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
              className="h-80 w-full rounded-xl object-cover shadow"
            />
          </div>
        )}

        <article className="prose prose-indigo max-w-none dark:prose-invert">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
              pre: ({ children }) => <>{children}</>,
              code: ({ inline, className, children, ...props }) =>
                inline ? (
                  <code
                    className="rounded bg-gray-100 px-1 py-0.5 dark:bg-gray-800"
                    {...props}
                  >
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
