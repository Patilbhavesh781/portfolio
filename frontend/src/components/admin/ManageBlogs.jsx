import { useEffect, useState } from "react";
import api from "../../services/api";
import Loader from "../common/Loader";
import Button from "../common/Button";
import Modal from "../common/Modal";

const ManageBlogs = ({ contentType = "blog" }) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    thumbnail: "",
    author: "",
    readTime: "",
    tags: "",
  });

  const contentLabel = contentType === "article" ? "Article" : "Blog";
  const contentLabelPlural = contentType === "article" ? "Articles" : "Blogs";

  useEffect(() => {
    fetchBlogs();
  }, [contentType]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/blogs", {
        params: { type: contentType },
      });
      setBlogs(response.data?.data || []);
    } catch (err) {
      setError(`Failed to load ${contentLabelPlural.toLowerCase()}.`);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      excerpt: "",
      thumbnail: "",
      author: "",
      readTime: "",
      tags: "",
    });
    setCoverFile(null);
  };

  const openCreateModal = () => {
    setEditingBlog(null);
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title || "",
      content: blog.content || "",
      excerpt: blog.excerpt || "",
      thumbnail: blog.coverImage?.url || blog.thumbnail || "",
      author: blog.author || "",
      readTime: blog.readTime || "",
      tags: blog.tags?.join(", ") || "",
    });
    setCoverFile(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBlog(null);
    resetForm();
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (coverFile) {
        const data = new FormData();
        data.append("type", contentType);
        data.append("title", formData.title);
        data.append("content", formData.content);
        data.append("excerpt", formData.excerpt);
        data.append("author", formData.author);
        data.append("readTime", formData.readTime);
        data.append("tags", formData.tags);
        if (formData.thumbnail) data.append("coverImageUrl", formData.thumbnail);
        data.append("coverImage", coverFile);

        if (editingBlog) {
          await api.put(`/blogs/${editingBlog._id}`, data, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        } else {
          await api.post("/blogs", data, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        }
      } else {
        const payload = {
          ...formData,
          type: contentType,
          tags: formData.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
          coverImageUrl: formData.thumbnail || undefined,
        };

        if (editingBlog) {
          await api.put(`/blogs/${editingBlog._id}`, payload);
        } else {
          await api.post("/blogs", payload);
        }
      }

      await fetchBlogs();
      closeModal();
    } catch (err) {
      alert(`Failed to save ${contentLabel.toLowerCase()}.`);
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        `Are you sure you want to delete this ${contentLabel.toLowerCase()}?`
      )
    ) {
      return;
    }

    try {
      await api.delete(`/blogs/${id}`);
      setBlogs((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      alert(`Failed to delete ${contentLabel.toLowerCase()}.`);
    }
  };

  if (loading) {
    return <Loader text={`Loading ${contentLabelPlural.toLowerCase()}...`} />;
  }

  if (error) {
    return <p className="text-center text-red-600">{error}</p>;
  }

  return (
    <div className="min-w-0 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Manage {contentLabelPlural}
        </h1>
        <Button onClick={openCreateModal}>Add {contentLabel}</Button>
      </div>

      <div className="w-full max-w-full overflow-x-auto rounded-xl bg-white shadow dark:bg-gray-900">
        <table className="min-w-[760px] w-full divide-y divide-gray-200 dark:divide-gray-800">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Author
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Read Time
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-800 dark:bg-gray-900">
            {blogs.map((blog) => (
              <tr key={blog._id}>
                <td className="max-w-[280px] px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                  <div className="break-words font-medium">{blog.title}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                  {blog.author || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className="inline-flex rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-medium capitalize text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
                    {blog.type || contentType}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                  {blog.readTime ? `${blog.readTime} min` : "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setSelectedBlog(blog)}
                  >
                    View
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => openEditModal(blog)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(blog._id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        title={editingBlog ? `Edit ${contentLabel}` : `Add ${contentLabel}`}
        onClose={closeModal}
        size="xl"
      >
        <form onSubmit={handleSubmit} className="min-w-0 space-y-4">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder={`${contentLabel} Title`}
            required
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500"
          />
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            placeholder="Author Name"
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500"
          />
          <input
            type="number"
            name="readTime"
            value={formData.readTime}
            onChange={handleChange}
            placeholder="Read Time (minutes)"
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500"
          />
          <input
            type="text"
            name="thumbnail"
            value={formData.thumbnail}
            onChange={handleChange}
            placeholder="Cover Image URL"
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500"
          />
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="Tags (comma separated)"
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500"
          />
          <div>
            <label className="mb-1 block text-sm text-gray-600 dark:text-gray-400">
              Cover Image Upload
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            />
          </div>
          <textarea
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            placeholder="Short excerpt"
            rows="3"
            required
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500"
          />
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder={`${contentLabel} content`}
            rows="8"
            required
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500"
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit">{editingBlog ? "Update" : "Create"}</Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={!!selectedBlog}
        title={`${contentLabel} Details`}
        onClose={() => setSelectedBlog(null)}
        size="xl"
      >
        {selectedBlog && (
          <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  Type
                </p>
                <p className="capitalize">{selectedBlog.type || contentType}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  Author
                </p>
                <p>{selectedBlog.author || "-"}</p>
              </div>
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                Title
              </p>
              <p className="break-words">{selectedBlog.title}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  Read Time
                </p>
                <p>
                  {selectedBlog.readTime ? `${selectedBlog.readTime} min` : "-"}
                </p>
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  Tags
                </p>
                <p className="break-words">
                  {selectedBlog.tags?.join(", ") || "-"}
                </p>
              </div>
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                Excerpt
              </p>
              <p className="whitespace-pre-wrap break-words">
                {selectedBlog.excerpt}
              </p>
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                Content
              </p>
              <p className="whitespace-pre-wrap break-words">
                {selectedBlog.content}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ManageBlogs;
