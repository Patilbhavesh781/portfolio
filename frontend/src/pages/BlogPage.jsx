import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import BlogDetails from "../components/blog/BlogDetails";
import Loader from "../components/common/Loader";
import ScrollReveal from "../components/common/ScrollReveal";
import { getBlogById } from "../services/blogService";
import { setSEO } from "../utils/seo";

const BlogPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const contentType = location.pathname.startsWith("/articles")
    ? "article"
    : "blog";
  const contentLabel = contentType === "article" ? "Article" : "Blog";

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getBlogById(id);
        setBlog(data);

        setSEO({
          title: `${data.title} | Bhavesh Patil - ${contentLabel}`,
          description: data.excerpt || data.content?.slice(0, 160),
          keywords: data.tags?.join(", "),
        });
      } catch (err) {
        setError(`Failed to load ${contentLabel.toLowerCase()}.`);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [contentLabel, id]);

  if (loading) return <Loader text={`Loading ${contentLabel.toLowerCase()}...`} />;
  if (error) return <p className="text-center text-red-600">{error}</p>;
  if (!blog) return null;

  return (
    <ScrollReveal amount={0.1} y={20}>
      <BlogDetails
        blog={blog}
        loading={loading}
        error={error}
        contentType={contentType}
      />
    </ScrollReveal>
  );
};

export default BlogPage;
