import { useEffect, useState } from "react";
import api from "../../services/api";
import Loader from "../common/Loader";
import Button from "../common/Button";
import Modal from "../common/Modal";

const ManageTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    company: "",
    message: "",
    avatarUrl: "",
    rating: 5,
    isFeatured: false,
    isApproved: true,
    order: 0,
  });
  const [avatarFile, setAvatarFile] = useState(null);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await api.get("/testimonials");
      setTestimonials(response.data?.data || []);
    } catch (err) {
      setError("Failed to load testimonials.");
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingTestimonial(null);
    setFormData({
      name: "",
      role: "",
      company: "",
      message: "",
      avatarUrl: "",
      rating: 5,
      isFeatured: false,
      isApproved: true,
      order: 0,
    });
    setAvatarFile(null);
    setIsModalOpen(true);
  };

  const openEditModal = (testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData({
      name: testimonial.name || "",
      role: testimonial.role || "",
      company: testimonial.company || "",
      message: testimonial.message || "",
      avatarUrl: testimonial.avatar?.url || testimonial.avatar || "",
      rating: testimonial.rating || 5,
      isFeatured: !!testimonial.isFeatured,
      isApproved: testimonial.isApproved !== false,
      order: testimonial.order || 0,
    });
    setAvatarFile(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTestimonial(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const hasFile = !!avatarFile;
      if (hasFile) {
        const data = new FormData();
        data.append("name", formData.name);
        data.append("role", formData.role);
        data.append("company", formData.company);
        data.append("message", formData.message);
        data.append("avatarUrl", formData.avatarUrl);
        data.append("rating", formData.rating);
        data.append("isFeatured", formData.isFeatured);
        data.append("isApproved", formData.isApproved);
        data.append("order", formData.order);
        data.append("avatar", avatarFile);

        if (editingTestimonial) {
          await api.put(`/testimonials/${editingTestimonial._id}`, data, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        } else {
          await api.post("/testimonials", data, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        }
      } else {
        const payload = {
          name: formData.name,
          role: formData.role,
          company: formData.company,
          message: formData.message,
          avatarUrl: formData.avatarUrl || undefined,
          rating: Number(formData.rating) || 5,
          isFeatured: formData.isFeatured,
          isApproved: formData.isApproved,
          order: Number(formData.order) || 0,
        };

        if (editingTestimonial) {
          await api.put(`/testimonials/${editingTestimonial._id}`, payload);
        } else {
          await api.post("/testimonials", payload);
        }
      }

      await fetchTestimonials();
      closeModal();
    } catch (err) {
      alert("Failed to save testimonial.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this testimonial?")) return;
    try {
      await api.delete(`/testimonials/${id}`);
      setTestimonials(testimonials.filter((t) => t._id !== id));
    } catch (err) {
      alert("Failed to delete testimonial.");
    }
  };

  if (loading) return <Loader text="Loading testimonials..." />;
  if (error) return <p className="text-center text-red-600">{error}</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Manage Testimonials
        </h1>
        <Button onClick={openCreateModal}>Add Testimonial</Button>
      </div>

      <div className="overflow-x-auto bg-white dark:bg-gray-900 rounded-xl shadow">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Rating
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
            {testimonials.map((t) => (
              <tr key={t._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  {t.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                  {t.role || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                  {t.rating || 5}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                  {t.isApproved ? "Approved" : "Pending"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                  <Button size="sm" variant="secondary" onClick={() => openEditModal(t)}>
                    Edit
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(t._id)}>
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
        title={editingTestimonial ? "Edit Testimonial" : "Add Testimonial"}
        onClose={closeModal}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            required
            className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="text"
            name="role"
            value={formData.role}
            onChange={handleChange}
            placeholder="Role"
            className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="Company"
            className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Testimonial message"
            rows="4"
            required
            className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="url"
            name="avatarUrl"
            value={formData.avatarUrl}
            onChange={handleChange}
            placeholder="Avatar Image URL"
            className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
              Avatar Upload
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
              className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <input
              type="number"
              name="rating"
              min="1"
              max="5"
              value={formData.rating}
              onChange={handleChange}
              placeholder="Rating (1-5)"
              className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="number"
              name="order"
              value={formData.order}
              onChange={handleChange}
              placeholder="Order"
              className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleChange}
                />
                Featured
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <input
                  type="checkbox"
                  name="isApproved"
                  checked={formData.isApproved}
                  onChange={handleChange}
                />
                Approved
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit">
              {editingTestimonial ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageTestimonials;

