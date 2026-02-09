import { useEffect, useState } from "react";
import api from "../../services/api";
import Loader from "../common/Loader";
import Button from "../common/Button";
import Modal from "../common/Modal";

const ManageBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    thumbnail: "",
    author: "",
    readTime: "",
  });

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await api.get("/blogs");
      setBlogs(response.data);
    } catch (err) {
      setError("Failed to load blogs.");
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingBlog(null);
    setFormData({
      title: "",
      content: "",
      excerpt: "",
      thumbnail: "",
      author: "",
      readTime: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title || "",
      content: blog.content || "",
      excerpt: blog.excerpt || "",
      thumbnail: blog.thumbnail || "",
      author: blog.author || "",
      readTime: blog.readTime || "",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBlog(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBlog) {
        await api.put(`/blogs/${editingBlog._id}`, formData);
      } else {
        await api.post("/blogs", formData);
      }

      await fetchBlogs();
      closeModal();
    } catch (err) {
      alert("Failed to save blog.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    try {
      await api.delete(`/blogs/${id}`);
      setBlogs(blogs.filter((b) => b._id !== id));
    } catch (err) {
      alert("Failed to delete blog.");
    }
  };

  if (loading) return <Loader text="Loading blogs..." />;
  if (error) return <p className="text-center text-red-600">{error}</p>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Manage Blogs
        </h1>
        <Button onClick={openCreateModal}>Add Blog</Button>
      </div>

      {/* Blogs Table */}
      <div className="overflow-x-auto bg-white dark:bg-gray-900 rounded-xl shadow">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Author
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Read Time
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
            {blogs.map((blog) => (
              <tr key={blog._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  {blog.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                  {blog.author || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                  {blog.readTime ? `${blog.readTime} min` : "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                  <Button size="sm" variant="secondary" onClick={() => openEditModal(blog)}>
                    Edit
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(blog._id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <Modal
          title={editingBlog ? "Edit Blog" : "Add Blog"}
          onClose={closeModal}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Blog Title"
              required
              className="w-full px-4 py-2 border rounded-lg"
            />
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              placeholder="Author Name"
              className="w-full px-4 py-2 border rounded-lg"
            />
            <input
              type="number"
              name="readTime"
              value={formData.readTime}
              onChange={handleChange}
              placeholder="Read Time (minutes)"
              className="w-full px-4 py-2 border rounded-lg"
            />
            <input
              type="text"
              name="thumbnail"
              value={formData.thumbnail}
              onChange={handleChange}
              placeholder="Thumbnail URL"
              className="w-full px-4 py-2 border rounded-lg"
            />
            <textarea
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              placeholder="Short excerpt"
              rows="3"
              className="w-full px-4 py-2 border rounded-lg"
            />
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Blog content"
              rows="6"
              required
              className="w-full px-4 py-2 border rounded-lg"
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="secondary" onClick={closeModal}>
                Cancel
              </Button>
              <Button type="submit">
                {editingBlog ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default ManageBlogs;
