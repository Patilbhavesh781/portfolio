import { useEffect, useState } from "react";
import Loader from "../common/Loader";
import api from "../../services/api";

const ResumeViewer = () => {
  const [resumeUrl, setResumeUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const response = await api.get("/resume");
        setResumeUrl(response.data.url);
      } catch (err) {
        setError("Failed to load resume.");
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, []);

  if (loading) return <Loader text="Loading resume..." />;
  if (error) return <p className="text-center text-red-600">{error}</p>;
  if (!resumeUrl) return null;

  return (
    <div className="w-full h-[80vh] border border-gray-300 dark:border-gray-700 rounded-xl overflow-hidden shadow">
      <iframe
        src={resumeUrl}
        title="Resume Viewer"
        className="w-full h-full"
      />
    </div>
  );
};

export default ResumeViewer;
