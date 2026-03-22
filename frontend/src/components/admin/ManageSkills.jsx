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
  const [selectedSkill, setSelectedSkill] = useState(null);

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
      setSkills(response.data?.data || []);
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
      const payload = {
        ...formData,
        level: formData.level === "" ? undefined : Number(formData.level),
        category: formData.category || undefined,
      };
      if (editingSkill) {
        await api.put(`/skills/${editingSkill._id}`, payload);
      } else {
        await api.post("/skills", payload);
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
    <div className="min-w-0 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Manage Skills
        </h1>
        <Button onClick={openCreateModal}>Add Skill</Button>
      </div>

      {/* Skills Table */}
      <div className="w-full max-w-full overflow-x-auto rounded-xl bg-white shadow dark:bg-gray-900">
        <table className="min-w-[680px] w-full divide-y divide-gray-200 dark:divide-gray-800">
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
                <td className="max-w-[240px] break-words px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                  {skill.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                  {skill.level || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                  {skill.category || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                  <Button size="sm" variant="secondary" onClick={() => setSelectedSkill(skill)}>
                    View
                  </Button>
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
      <Modal
        isOpen={isModalOpen}
        title={editingSkill ? "Edit Skill" : "Add Skill"}
        onClose={closeModal}
      >
          <form onSubmit={handleSubmit} className="min-w-0 space-y-4">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Skill Name"
              required
              className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="number"
              name="level"
              value={formData.level}
              onChange={handleChange}
              placeholder="Skill Level (1-100)"
              min="1"
              max="100"
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
              <option value="devops">DevOps</option>
              <option value="tools">Tools</option>
              <option value="other">Other</option>
            </select>
            <input
              type="text"
              name="icon"
              value={formData.icon}
              onChange={handleChange}
              placeholder="Icon URL or class"
              className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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

      <Modal
        isOpen={!!selectedSkill}
        title="Skill Details"
        onClose={() => setSelectedSkill(null)}
        size="lg"
      >
        {selectedSkill && (
          <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
            <div>
              <p className="font-semibold text-gray-900 dark:text-gray-100">Name</p>
              <p className="break-words">{selectedSkill.name}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">Level</p>
                <p>{selectedSkill.level || "-"}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">Category</p>
                <p>{selectedSkill.category || "-"}</p>
              </div>
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-gray-100">Icon</p>
              <p className="break-all">{selectedSkill.icon || "-"}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ManageSkills;

