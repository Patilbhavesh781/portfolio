import BlogCard from "./BlogCard";

const BlogList = ({ blogs = [], contentType = "blog" }) => {
  const contentLabel = contentType === "article" ? "Articles" : "Blogs";

  return (
    <section className="bg-gray-50 py-20 dark:bg-gray-800">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="mb-12 text-center text-3xl font-bold text-gray-900 dark:text-gray-100 sm:text-4xl">
          {contentLabel}
        </h2>

        {blogs.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-400">
            No {contentLabel.toLowerCase()} found.
          </p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogList;
