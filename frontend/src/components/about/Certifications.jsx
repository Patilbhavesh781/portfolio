import { useEffect, useState } from "react";
import api from "../../services/api";
import Loader from "../common/Loader";

const Certifications = () => {
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCertifications = async () => {
      try {
        const response = await api.get("/certifications");
        setCertifications(response.data);
      } catch (err) {
        setError("Failed to load certifications.");
      } finally {
        setLoading(false);
      }
    };

    fetchCertifications();
  }, []);

  if (loading) return <Loader text="Loading certifications..." />;
  if (error) return <p className="text-center text-red-600">{error}</p>;

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 dark:text-gray-100 mb-12">
          Certifications
        </h2>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {certifications.map((cert) => (
            <div
              key={cert._id}
              className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow hover:shadow-md transition"
            >
              {cert.logo && (
                <img
                  src={cert.logo}
                  alt={cert.title}
                  className="w-16 h-16 object-contain mb-4"
                />
              )}
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {cert.title}
              </h3>
              <p className="text-indigo-600 dark:text-indigo-400 font-medium mb-1">
                {cert.issuer}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                Issued: {cert.issueDate}
              </p>
              {cert.credentialUrl && (
                <a
                  href={cert.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  View Credential →
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Certifications;
