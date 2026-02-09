import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BlogDetails from "../components/blog/BlogDetails";
import Loader from "../components/common/Loader";
import { getBlogById } from "../services/blogService";
import { setSEO } from "../utils/seo";

const BlogPage = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const data = await getBlogById(id);
        setBlog(data);

        setSEO({
          title: `${data.title} | Your Name - Blog`,
          description: data.excerpt || data.content?.slice(0, 160),
          keywords: data.tags?.join(", "),
        });
      } catch (err) {
        setError("Failed to load blog.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  if (loading) return <Loader text="Loading blog..." />;
  if (error) return <p className="text-center text-red-600">{error}</p>;
  if (!blog) return null;

  return <BlogDetails blog={blog} />;
};

export default BlogPage;
