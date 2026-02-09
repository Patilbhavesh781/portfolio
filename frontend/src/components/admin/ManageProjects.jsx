import { useEffect, useState } from "react";
import api from "../../services/api";
import Loader from "../common/Loader";
import Button from "../common/Button";
import Modal from "../common/Modal";

const ManageProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    technologies: "",
    liveUrl: "",
    githubUrl: "",
    category: "",
    thumbnail: "",
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await api.get("/projects");
      setProjects(response.data);
    } catch (err) {
      setError("Failed to load projects.");
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingProject(null);
    setFormData({
      title: "",
      description: "",
      technologies: "",
      liveUrl: "",
      githubUrl: "",
      category: "",
      thumbnail: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title || "",
      description: project.description || "",
      technologies: project.technologies?.join(", ") || "",
      liveUrl: project.liveUrl || "",
      githubUrl: project.githubUrl || "",
      category: project.category || "",
      thumbnail: project.thumbnail || "",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
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

      if (editingProject) {
        await api.put(`/projects/${editingProject._id}`, payload);
      } else {
        await api.post("/projects", payload);
      }

      await fetchProjects();
      closeModal();
    } catch (err) {
      alert("Failed to save project.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      await api.delete(`/projects/${id}`);
      setProjects(projects.filter((p) => p._id !== id));
    } catch (err) {
      alert("Failed to delete project.");
    }
  };

  if (loading) return <Loader text="Loading projects..." />;
  if (error) return <p className="text-center text-red-600">{error}</p>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Manage Projects
        </h1>
        <Button onClick={openCreateModal}>Add Project</Button>
      </div>

      {/* Projects Table */}
      <div className="overflow-x-auto bg-white dark:bg-gray-900 rounded-xl shadow">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Tech Stack
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
            {projects.map((project) => (
              <tr key={project._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  {project.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                  {project.category || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                  {project.technologies?.join(", ") || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                  <Button size="sm" variant="secondary" onClick={() => openEditModal(project)}>
                    Edit
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(project._id)}>
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
          title={editingProject ? "Edit Project" : "Add Project"}
          onClose={closeModal}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Project Title"
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
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Category"
              className="w-full px-4 py-2 border rounded-lg"
            />
            <input
              type="url"
              name="liveUrl"
              value={formData.liveUrl}
              onChange={handleChange}
              placeholder="Live URL"
              className="w-full px-4 py-2 border rounded-lg"
            />
            <input
              type="url"
              name="githubUrl"
              value={formData.githubUrl}
              onChange={handleChange}
              placeholder="GitHub URL"
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

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="secondary" onClick={closeModal}>
                Cancel
              </Button>
              <Button type="submit">
                {editingProject ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default ManageProjects;
