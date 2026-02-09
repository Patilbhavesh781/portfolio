import { useEffect, useState } from "react";
import api from "../../services/api";
import Loader from "../common/Loader";
import Button from "../common/Button";
import Modal from "../common/Modal";

const ManageSkills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    level: "",
    category: "",
    icon: "",
  });

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const response = await api.get("/skills");
      setSkills(response.data);
    } catch (err) {
      setError("Failed to load skills.");
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingSkill(null);
    setFormData({ name: "", level: "", category: "", icon: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (skill) => {
    setEditingSkill(skill);
    setFormData({
      name: skill.name || "",
      level: skill.level || "",
      category: skill.category || "",
      icon: skill.icon || "",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSkill(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSkill) {
        await api.put(`/skills/${editingSkill._id}`, formData);
      } else {
        await api.post("/skills", formData);
      }

      await fetchSkills();
      closeModal();
    } catch (err) {
      alert("Failed to save skill.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this skill?")) return;
    try {
      await api.delete(`/skills/${id}`);
      setSkills(skills.filter((s) => s._id !== id));
    } catch (err) {
      alert("Failed to delete skill.");
    }
  };

  if (loading) return <Loader text="Loading skills..." />;
  if (error) return <p className="text-center text-red-600">{error}</p>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Manage Skills
        </h1>
        <Button onClick={openCreateModal}>Add Skill</Button>
      </div>

      {/* Skills Table */}
      <div className="overflow-x-auto bg-white dark:bg-gray-900 rounded-xl shadow">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Level
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
            {skills.map((skill) => (
              <tr key={skill._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  {skill.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                  {skill.level || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                  {skill.category || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                  <Button size="sm" variant="secondary" onClick={() => openEditModal(skill)}>
                    Edit
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(skill._id)}>
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
          title={editingSkill ? "Edit Skill" : "Add Skill"}
          onClose={closeModal}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Skill Name"
              required
              className="w-full px-4 py-2 border rounded-lg"
            />
            <input
              type="text"
              name="level"
              value={formData.level}
              onChange={handleChange}
              placeholder="Skill Level (e.g. Beginner, Intermediate, Expert)"
              className="w-full px-4 py-2 border rounded-lg"
            />
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Category (e.g. Frontend, Backend, Tools)"
              className="w-full px-4 py-2 border rounded-lg"
            />
            <input
              type="text"
              name="icon"
              value={formData.icon}
              onChange={handleChange}
              placeholder="Icon URL or class"
              className="w-full px-4 py-2 border rounded-lg"
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="secondary" onClick={closeModal}>
                Cancel
              </Button>
              <Button type="submit">
                {editingSkill ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default ManageSkills;
