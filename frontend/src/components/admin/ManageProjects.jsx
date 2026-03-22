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
  const [selectedProject, setSelectedProject] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    technologies: "",
    liveUrl: "",
    githubUrl: "",
    category: "",
    thumbnail: "",
    imageUrls: "",
  });
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await api.get("/projects");
      setProjects(response.data?.data || []);
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
      startDate: "",
      endDate: "",
      technologies: "",
      liveUrl: "",
      githubUrl: "",
      category: "",
      thumbnail: "",
      imageUrls: "",
    });
    setThumbnailFile(null);
    setImageFiles([]);
    setIsModalOpen(true);
  };

  const openEditModal = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title || "",
      description: project.description || "",
      startDate: project.startDate ? new Date(project.startDate).toISOString().split("T")[0] : "",
      endDate: project.endDate ? new Date(project.endDate).toISOString().split("T")[0] : "",
      technologies: project.technologies?.join(", ") || "",
      liveUrl: project.liveUrl || "",
      githubUrl: project.githubUrl || "",
      category: project.category || "",
      thumbnail: project.thumbnail?.url || project.thumbnail || "",
      imageUrls: project.images?.map((img) => img?.url || img).join(", ") || "",
    });
    setThumbnailFile(null);
    setImageFiles([]);
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
      const hasFiles = thumbnailFile || imageFiles.length > 0;

      if (hasFiles) {
        const data = new FormData();
        data.append("title", formData.title);
        data.append("description", formData.description);
        if (formData.startDate) data.append("startDate", formData.startDate);
        if (formData.endDate) data.append("endDate", formData.endDate);
        data.append("technologies", formData.technologies);
        data.append("liveUrl", formData.liveUrl);
        data.append("githubUrl", formData.githubUrl);
        data.append("category", formData.category);
        if (formData.thumbnail) data.append("thumbnailUrl", formData.thumbnail);
        if (formData.imageUrls) data.append("imageUrls", formData.imageUrls);
        if (thumbnailFile) data.append("thumbnail", thumbnailFile);
        imageFiles.forEach((file) => data.append("images", file));

        if (editingProject) {
          await api.put(`/projects/${editingProject._id}`, data, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        } else {
          await api.post("/projects", data, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        }
      } else {
        const payload = {
          ...formData,
          technologies: formData.technologies
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
        };

        if (!payload.startDate) delete payload.startDate;
        if (!payload.endDate) delete payload.endDate;

        if (editingProject) {
          await api.put(`/projects/${editingProject._id}`, payload);
        } else {
          await api.post("/projects", payload);
        }
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
    <div className="min-w-0 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Manage Projects
        </h1>
        <Button onClick={openCreateModal}>Add Project</Button>
      </div>

      {/* Projects Table */}
      <div className="w-full max-w-full overflow-x-auto rounded-xl bg-white shadow dark:bg-gray-900">
        <table className="min-w-[860px] w-full divide-y divide-gray-200 dark:divide-gray-800">
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Timeline
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
            {projects.map((project) => (
              <tr key={project._id}>
                <td className="max-w-[220px] break-words px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                  {project.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                  {project.category || "-"}
                </td>
                <td className="max-w-[320px] break-words px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                  {project.technologies?.join(", ") || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                  {project.startDate || project.endDate
                    ? `${project.startDate ? new Date(project.startDate).toLocaleDateString() : "N/A"} - ${project.endDate ? new Date(project.endDate).toLocaleDateString() : "Present"}`
                    : "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                  <Button size="sm" variant="secondary" onClick={() => setSelectedProject(project)}>
                    View
                  </Button>
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
      <Modal
        isOpen={isModalOpen}
        title={editingProject ? "Edit Project" : "Add Project"}
        onClose={closeModal}
        size="xl"
      >
          <form onSubmit={handleSubmit} className="min-w-0 space-y-4">
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Project Title"
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <input
              type="text"
              name="technologies"
              value={formData.technologies}
              onChange={handleChange}
              placeholder="Technologies (comma separated)"
              className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select Category</option>
              <option value="frontend">Frontend</option>
              <option value="backend">Backend</option>
              <option value="fullstack">Fullstack</option>
              <option value="mobile">Mobile</option>
              <option value="other">Other</option>
            </select>
            <input
              type="url"
              name="liveUrl"
              value={formData.liveUrl}
              onChange={handleChange}
              placeholder="Live URL"
              className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="url"
              name="githubUrl"
              value={formData.githubUrl}
              onChange={handleChange}
              placeholder="GitHub URL"
              className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="text"
              name="thumbnail"
              value={formData.thumbnail}
              onChange={handleChange}
              placeholder="Thumbnail URL"
              className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="text"
              name="imageUrls"
              value={formData.imageUrls}
              onChange={handleChange}
              placeholder="Image URLs (comma separated)"
              className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Thumbnail Upload
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
                  className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Project Images (up to 5)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => setImageFiles(Array.from(e.target.files || []))}
                  className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

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

      <Modal
        isOpen={!!selectedProject}
        title="Project Details"
        onClose={() => setSelectedProject(null)}
        size="xl"
      >
        {selectedProject && (
          <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
            <div>
              <p className="font-semibold text-gray-900 dark:text-gray-100">Title</p>
              <p className="break-words">{selectedProject.title}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-gray-100">Description</p>
              <p className="whitespace-pre-wrap break-words">{selectedProject.description}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">Category</p>
                <p>{selectedProject.category || "-"}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">Timeline</p>
                <p>
                  {selectedProject.startDate ? new Date(selectedProject.startDate).toLocaleDateString() : "N/A"} - {selectedProject.endDate ? new Date(selectedProject.endDate).toLocaleDateString() : "Present"}
                </p>
              </div>
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-gray-100">Technologies</p>
              <p className="break-words">{selectedProject.technologies?.join(", ") || "-"}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">Live URL</p>
                <p className="break-all">{selectedProject.liveUrl || "-"}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">GitHub URL</p>
                <p className="break-all">{selectedProject.githubUrl || "-"}</p>
              </div>
            </div>
            {selectedProject.thumbnail?.url || selectedProject.thumbnail ? (
              <div>
                <p className="mb-2 font-semibold text-gray-900 dark:text-gray-100">Thumbnail</p>
                <img
                  src={selectedProject.thumbnail?.url || selectedProject.thumbnail}
                  alt={selectedProject.title}
                  className="max-h-56 w-full rounded-lg object-cover"
                />
              </div>
            ) : null}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ManageProjects;

