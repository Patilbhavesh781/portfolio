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
  const [selectedExperience, setSelectedExperience] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    description: "",
    technologies: "",
    startDate: "",
    endDate: "",
    isCurrent: false,
    location: "",
  });

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const response = await api.get("/experiences");
      setExperiences(response.data?.data || []);
    } catch (err) {
      setError("Failed to load experience.");
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingExperience(null);
    setFormData({
      title: "",
      company: "",
      description: "",
      technologies: "",
      startDate: "",
      endDate: "",
      isCurrent: false,
      location: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (experience) => {
    setEditingExperience(experience);
    setFormData({
      title: experience.title || "",
      company: experience.company || "",
      description: experience.description || "",
      technologies: experience.technologies?.join(", ") || "",
      startDate: experience.startDate
        ? new Date(experience.startDate).toISOString().slice(0, 10)
        : "",
      endDate: experience.endDate
        ? new Date(experience.endDate).toISOString().slice(0, 10)
        : "",
      isCurrent: !!experience.isCurrent,
      location: experience.location || "",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingExperience(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
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
        await api.put(`/experiences/${editingExperience._id}`, payload);
      } else {
        await api.post("/experiences", payload);
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
      await api.delete(`/experiences/${id}`);
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
                Title
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
                  {exp.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                  {exp.company}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                  {exp.startDate ? new Date(exp.startDate).toLocaleDateString() : ""} - {exp.isCurrent ? "Present" : exp.endDate ? new Date(exp.endDate).toLocaleDateString() : "Present"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                  <Button size="sm" variant="secondary" onClick={() => setSelectedExperience(exp)}>
                    View
                  </Button>
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
      <Modal
        isOpen={isModalOpen}
        title={editingExperience ? "Edit Experience" : "Add Experience"}
        onClose={closeModal}
        size="xl"
      >
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Title / Position"
              required
              className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Location"
              className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="Company Name"
              required
              className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description"
              rows="4"
              required
              className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="text"
              name="technologies"
              value={formData.technologies}
              onChange={handleChange}
              placeholder="Technologies (comma separated)"
              className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                disabled={formData.isCurrent}
                className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                name="isCurrent"
                checked={formData.isCurrent}
                onChange={handleChange}
              />
              Current role
            </label>

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

      <Modal
        isOpen={!!selectedExperience}
        title="Experience Details"
        onClose={() => setSelectedExperience(null)}
        size="xl"
      >
        {selectedExperience && (
          <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">Title</p>
                <p>{selectedExperience.title}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">Company</p>
                <p>{selectedExperience.company}</p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">Location</p>
                <p>{selectedExperience.location || "-"}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">Duration</p>
                <p>
                  {selectedExperience.startDate ? new Date(selectedExperience.startDate).toLocaleDateString() : "N/A"} - {selectedExperience.isCurrent ? "Present" : selectedExperience.endDate ? new Date(selectedExperience.endDate).toLocaleDateString() : "Present"}
                </p>
              </div>
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-gray-100">Technologies</p>
              <p className="break-words">{selectedExperience.technologies?.join(", ") || "-"}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-gray-100">Description</p>
              <p className="whitespace-pre-wrap break-words">{selectedExperience.description}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ManageExperience;



