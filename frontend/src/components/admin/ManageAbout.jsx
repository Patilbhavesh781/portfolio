import { useEffect, useState } from "react";
import api from "../../services/api";
import Loader from "../common/Loader";
import Button from "../common/Button";

const ManageAbout = () => {
  const [about, setAbout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    title: "",
    shortBio: "",
    longBio: "",
    profileImage: "",
    resumeUrl: "",
    email: "",
    phone: "",
    location: "",
    github: "",
    linkedin: "",
    twitter: "",
    website: "",
  });
  const [profileFile, setProfileFile] = useState(null);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const response = await api.get("/about");
        const data = response.data?.data;
        setAbout(data);
        if (data) {
          setFormData({
            fullName: data.fullName || "",
            title: data.title || "",
            shortBio: data.shortBio || "",
            longBio: data.longBio || "",
            profileImage: data.profileImage || "",
            resumeUrl: data.resumeUrl || "",
            email: data.email || "",
            phone: data.phone || "",
            location: data.location || "",
            github: data.social?.github || "",
            linkedin: data.social?.linkedin || "",
            twitter: data.social?.twitter || "",
            website: data.social?.website || "",
          });
        }
      } catch (err) {
        setError("Failed to load about info.");
      } finally {
        setLoading(false);
      }
    };

    fetchAbout();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const hasFile = !!profileFile;
      if (hasFile) {
        const data = new FormData();
        data.append("fullName", formData.fullName);
        data.append("title", formData.title);
        data.append("shortBio", formData.shortBio);
        data.append("longBio", formData.longBio);
        data.append("profileImage", profileFile);
        data.append("profileImageUrl", formData.profileImage);
        data.append("resumeUrl", formData.resumeUrl);
        data.append("email", formData.email);
        data.append("phone", formData.phone);
        data.append("location", formData.location);
        data.append("social[github]", formData.github);
        data.append("social[linkedin]", formData.linkedin);
        data.append("social[twitter]", formData.twitter);
        data.append("social[website]", formData.website);

        const response = await api.put("/about", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setAbout(response.data?.data || null);
      } else {
        const payload = {
          fullName: formData.fullName,
          title: formData.title,
          shortBio: formData.shortBio,
          longBio: formData.longBio,
          profileImage: formData.profileImage,
          resumeUrl: formData.resumeUrl,
          email: formData.email,
          phone: formData.phone,
          location: formData.location,
          social: {
            github: formData.github,
            linkedin: formData.linkedin,
            twitter: formData.twitter,
            website: formData.website,
          },
        };

        const response = await api.put("/about", payload);
        setAbout(response.data?.data || null);
      }
    } catch (err) {
      setError("Failed to save about info.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader text="Loading about..." />;
      if (error) return <p className="text-center text-red-600">{error}</p>;
  if (!about) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Manage About
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow space-y-4">
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="Full Name"
          required
          className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Title"
          required
          className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <textarea
          name="shortBio"
          value={formData.shortBio}
          onChange={handleChange}
          placeholder="Short Bio"
          rows="3"
          className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <textarea
          name="longBio"
          value={formData.longBio}
          onChange={handleChange}
          placeholder="Long Bio"
          rows="6"
          required
          className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="url"
          name="profileImage"
          value={formData.profileImage}
          onChange={handleChange}
          placeholder="Profile Image URL"
          className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
            Profile Image Upload
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setProfileFile(e.target.files?.[0] || null)}
            className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <input
          type="url"
          name="resumeUrl"
          value={formData.resumeUrl}
          onChange={handleChange}
          placeholder="Resume URL"
          className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Phone"
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
          type="url"
          name="github"
          value={formData.github}
          onChange={handleChange}
          placeholder="GitHub URL"
          className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="url"
          name="linkedin"
          value={formData.linkedin}
          onChange={handleChange}
          placeholder="LinkedIn URL"
          className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="url"
          name="twitter"
          value={formData.twitter}
          onChange={handleChange}
          placeholder="Twitter URL"
          className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="url"
          name="website"
          value={formData.website}
          onChange={handleChange}
          placeholder="Website URL"
          className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <div className="flex justify-end gap-3 pt-2">
          <Button type="submit" isLoading={saving}>
            Save About
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ManageAbout;

