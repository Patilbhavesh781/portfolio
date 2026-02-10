import BlogCard from "./BlogCard";
const BlogList = ({ blogs = [] }) => {

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 dark:text-gray-100 mb-12">
          Blog & Articles
        </h2>

        {blogs.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-400">
            No blogs found.
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
