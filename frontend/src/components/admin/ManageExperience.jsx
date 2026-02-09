import { useEffect, useState } from "react";
import api from "../../services/api";
import Loader from "../common/Loader";
import Button from "../common/Button";
import Modal from "../common/Modal";

const ManageExperience = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState(null);

  const [formData, setFormData] = useState({
    role: "",
    company: "",
    description: "",
    technologies: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const response = await api.get("/experience");
      setExperiences(response.data);
    } catch (err) {
      setError("Failed to load experience.");
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingExperience(null);
    setFormData({
      role: "",
      company: "",
      description: "",
      technologies: "",
      startDate: "",
      endDate: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (experience) => {
    setEditingExperience(experience);
    setFormData({
      role: experience.role || "",
      company: experience.company || "",
      description: experience.description || "",
      technologies: experience.technologies?.join(", ") || "",
      startDate: experience.startDate || "",
      endDate: experience.endDate || "",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingExperience(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        technologies: formData.technologies
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      };

      if (editingExperience) {
        await api.put(`/experience/${editingExperience._id}`, payload);
      } else {
        await api.post("/experience", payload);
      }

      await fetchExperiences();
      closeModal();
    } catch (err) {
      alert("Failed to save experience.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this experience?")) return;
    try {
      await api.delete(`/experience/${id}`);
      setExperiences(experiences.filter((e) => e._id !== id));
    } catch (err) {
      alert("Failed to delete experience.");
    }
  };

  if (loading) return <Loader text="Loading experience..." />;
  if (error) return <p className="text-center text-red-600">{error}</p>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Manage Experience
        </h1>
        <Button onClick={openCreateModal}>Add Experience</Button>
      </div>

      {/* Experience Table */}
      <div className="overflow-x-auto bg-white dark:bg-gray-900 rounded-xl shadow">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Company
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Duration
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
            {experiences.map((exp) => (
              <tr key={exp._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  {exp.role}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                  {exp.company}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                  {exp.startDate} – {exp.endDate || "Present"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                  <Button size="sm" variant="secondary" onClick={() => openEditModal(exp)}>
                    Edit
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(exp._id)}>
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
          title={editingExperience ? "Edit Experience" : "Add Experience"}
          onClose={closeModal}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="role"
              value={formData.role}
              onChange={handleChange}
              placeholder="Role / Position"
              required
              className="w-full px-4 py-2 border rounded-lg"
            />
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="Company Name"
              required
              className="w-full px-4 py-2 border rounded-lg"
            />
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description"
              rows="4"
              required
              className="w-full px-4 py-2 border rounded-lg"
            />
            <input
              type="text"
              name="technologies"
              value={formData.technologies}
              onChange={handleChange}
              placeholder="Technologies (comma separated)"
              className="w-full px-4 py-2 border rounded-lg"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg"
              />
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="secondary" onClick={closeModal}>
                Cancel
              </Button>
              <Button type="submit">
                {editingExperience ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default ManageExperience;
