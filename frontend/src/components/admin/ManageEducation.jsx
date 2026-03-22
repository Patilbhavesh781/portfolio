import { useEffect, useState } from "react";
import api from "../../services/api";
import Loader from "../common/Loader";
import Button from "../common/Button";
import Modal from "../common/Modal";

const ManageEducation = () => {
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEducation, setEditingEducation] = useState(null);
  const [selectedEducation, setSelectedEducation] = useState(null);

  const [formData, setFormData] = useState({
    degree: "",
    institution: "",
    fieldOfStudy: "",
    startYear: "",
    endYear: "",
    grade: "",
    description: "",
  });

  useEffect(() => {
    fetchEducation();
  }, []);

  const fetchEducation = async () => {
    try {
      const response = await api.get("/education");
      setEducation(response.data?.data || []);
    } catch (err) {
      setError("Failed to load education.");
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingEducation(null);
    setFormData({
      degree: "",
      institution: "",
      fieldOfStudy: "",
      startYear: "",
      endYear: "",
      grade: "",
      description: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (edu) => {
    setEditingEducation(edu);
    setFormData({
      degree: edu.degree || "",
      institution: edu.institution || "",
      fieldOfStudy: edu.fieldOfStudy || "",
      startYear: edu.startYear || "",
      endYear: edu.endYear || "",
      grade: edu.grade || "",
      description: edu.description || "",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingEducation(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        startYear: formData.startYear ? Number(formData.startYear) : undefined,
        endYear: formData.endYear ? Number(formData.endYear) : undefined,
      };

      if (editingEducation) {
        await api.put(`/education/${editingEducation._id}`, payload);
      } else {
        await api.post("/education", payload);
      }

      await fetchEducation();
      closeModal();
    } catch (err) {
      alert("Failed to save education.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    try {
      await api.delete(`/education/${id}`);
      setEducation(education.filter((e) => e._id !== id));
    } catch (err) {
      alert("Failed to delete education.");
    }
  };

  if (loading) return <Loader text="Loading education..." />;
  if (error) return <p className="text-center text-red-600">{error}</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Manage Education
        </h1>
        <Button onClick={openCreateModal}>Add Education</Button>
      </div>

      <div className="overflow-x-auto bg-white dark:bg-gray-900 rounded-xl shadow">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Degree
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Institution
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Years
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
            {education.map((edu) => (
              <tr key={edu._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  {edu.degree}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                  {edu.institution}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                  {edu.startYear} - {edu.endYear || "Present"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                  <Button size="sm" variant="secondary" onClick={() => setSelectedEducation(edu)}>
                    View
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => openEditModal(edu)}>
                    Edit
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(edu._id)}>
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
        title={editingEducation ? "Edit Education" : "Add Education"}
        onClose={closeModal}
        size="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="degree"
            value={formData.degree}
            onChange={handleChange}
            placeholder="Degree"
            required
            className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="text"
            name="institution"
            value={formData.institution}
            onChange={handleChange}
            placeholder="Institution"
            required
            className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="text"
            name="fieldOfStudy"
            value={formData.fieldOfStudy}
            onChange={handleChange}
            placeholder="Field of Study"
            className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="number"
              name="startYear"
              value={formData.startYear}
              onChange={handleChange}
              placeholder="Start Year"
              required
              className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="number"
              name="endYear"
              value={formData.endYear}
              onChange={handleChange}
              placeholder="End Year"
              className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <input
            type="text"
            name="grade"
            value={formData.grade}
            onChange={handleChange}
            placeholder="Grade"
            className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            rows="4"
            className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit">
              {editingEducation ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={!!selectedEducation}
        title="Education Details"
        onClose={() => setSelectedEducation(null)}
        size="lg"
      >
        {selectedEducation && (
          <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">Degree</p>
                <p>{selectedEducation.degree}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">Institution</p>
                <p>{selectedEducation.institution}</p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">Field of Study</p>
                <p>{selectedEducation.fieldOfStudy || "-"}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">Years</p>
                <p>{selectedEducation.startYear} - {selectedEducation.endYear || "Present"}</p>
              </div>
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-gray-100">Grade</p>
              <p>{selectedEducation.grade || "-"}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-gray-100">Description</p>
              <p className="whitespace-pre-wrap break-words">{selectedEducation.description || "-"}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ManageEducation;

